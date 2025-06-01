import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
// Import memorystore for development
import createMemoryStore from "memorystore";

// Check if running in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Only throw error if not in development mode and REPLIT_DOMAINS is missing
if (!isDevelopment && !process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  
  // In development, use memory store instead of PG
  if (isDevelopment) {
    const MemoryStore = createMemoryStore(session);
    return session({
      secret: process.env.SESSION_SECRET || 'dev-secret-key-change-in-production',
      store: new MemoryStore({
        checkPeriod: sessionTtl
      }),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: sessionTtl,
      },
    });
  }
  
  // Production uses PG store
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET || 'dev-secret-key-change-in-production',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Skip auth setup in development mode
  if (isDevelopment) {
    console.log("Running in development mode - bypassing Replit authentication");
    
    // Use a real coach user from the database instead of mock data
    const mockUser = {
      claims: {
        sub: 'usr_1', // Use actual coach user ID from database
        email: 'sarah.coach@example.com',
        first_name: 'Sarah',
        last_name: 'Williams',
        profile_image_url: 'https://randomuser.me/api/portraits/women/1.jpg',
      },
      expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
    };
    
    // Simple passport setup for development
    passport.serializeUser((user: Express.User, done) => done(null, user));
    passport.deserializeUser((user: Express.User, done) => done(null, user));
    
    // Set up a mock login endpoint for development
    app.get('/api/login', (req, res) => {
      req.login(mockUser, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login failed", error: err });
        }
        res.redirect('/');
      });
    });
    
    // Mock logout endpoint
    app.get('/api/logout', (req, res) => {
      req.logout(() => {
        res.redirect('/');
      });
    });
    
    return;
  }

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  for (const domain of process.env
    .REPLIT_DOMAINS!.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`,
      },
      verify,
    );
    passport.use(strategy);
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  // Skip authentication check in development mode
  if (isDevelopment) {
    // In development, set a real user from the database for testing
    if (!req.user) {
      req.user = {
        claims: {
          sub: 'usr_1', // Use actual coach user ID from database
          email: 'sarah.coach@example.com',
          first_name: 'Sarah',
          last_name: 'Williams',
          profile_image_url: 'https://randomuser.me/api/portraits/women/1.jpg',
        },
        expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
      };
    }
    return next();
  }

  const user = req.user as any;

  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
