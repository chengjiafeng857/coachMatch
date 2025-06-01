import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertClientSchema, insertFeedbackSchema, insertPracticeSessionSchema, insertCheckInSchema, insertGoalSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user is a coach and get coach profile
      const coach = await storage.getCoachByUserId(userId);
      
      res.json({ 
        ...user, 
        coach: coach || null,
        isCoach: !!coach 
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", isAuthenticated, async (req: any, res) => {
    try {
      console.log('Dashboard stats route - user:', req.user);
      const userId = req.user.claims.sub;
      console.log('Dashboard stats route - userId:', userId);
      const coach = await storage.getCoachByUserId(userId);
      console.log('Dashboard stats route - coach:', coach);
      
      if (!coach) {
        console.log('Dashboard stats route - no coach found for userId:', userId);
        return res.status(403).json({ message: "Coach profile required" });
      }

      console.log('Dashboard stats route - calling getCoachDashboardStats with coachId:', coach.id);
      const stats = await storage.getCoachDashboardStats(coach.id);
      console.log('Dashboard stats route - stats result:', stats);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Client management
  app.get("/api/clients", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const coach = await storage.getCoachByUserId(userId);
      
      if (!coach) {
        return res.status(403).json({ message: "Coach profile required" });
      }

      const clients = await storage.getClientsByCoachId(coach.id);
      res.json(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });

  app.get("/api/clients/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const coach = await storage.getCoachByUserId(userId);
      const clientId = parseInt(req.params.id);
      
      if (!coach) {
        return res.status(403).json({ message: "Coach profile required" });
      }

      const client = await storage.getClientById(clientId);
      
      if (!client || client.coachId !== coach.id) {
        return res.status(404).json({ message: "Client not found" });
      }

      res.json(client);
    } catch (error) {
      console.error("Error fetching client:", error);
      res.status(500).json({ message: "Failed to fetch client" });
    }
  });

  app.post("/api/clients", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const coach = await storage.getCoachByUserId(userId);
      
      if (!coach) {
        return res.status(403).json({ message: "Coach profile required" });
      }

      const validatedData = insertClientSchema.parse({
        ...req.body,
        coachId: coach.id
      });

      const client = await storage.createClient(validatedData);
      res.status(201).json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating client:", error);
      res.status(500).json({ message: "Failed to create client" });
    }
  });

  // Feedback management
  app.get("/api/feedback", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const coach = await storage.getCoachByUserId(userId);
      const limit = parseInt(req.query.limit as string) || 10;
      
      if (!coach) {
        return res.status(403).json({ message: "Coach profile required" });
      }

      const feedback = await storage.getFeedbackByCoachId(coach.id, limit);
      res.json(feedback);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      res.status(500).json({ message: "Failed to fetch feedback" });
    }
  });

  app.get("/api/clients/:clientId/feedback", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const coach = await storage.getCoachByUserId(userId);
      const clientId = parseInt(req.params.clientId);
      const limit = parseInt(req.query.limit as string) || 10;
      
      if (!coach) {
        return res.status(403).json({ message: "Coach profile required" });
      }

      // Verify client belongs to coach
      const client = await storage.getClientById(clientId);
      if (!client || client.coachId !== coach.id) {
        return res.status(404).json({ message: "Client not found" });
      }

      const feedback = await storage.getFeedbackByClientId(clientId, limit);
      res.json(feedback);
    } catch (error) {
      console.error("Error fetching client feedback:", error);
      res.status(500).json({ message: "Failed to fetch client feedback" });
    }
  });

  app.post("/api/feedback", isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertFeedbackSchema.parse(req.body);
      const feedback = await storage.createFeedback(validatedData);
      res.status(201).json(feedback);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating feedback:", error);
      res.status(500).json({ message: "Failed to create feedback" });
    }
  });

  // Practice sessions
  app.get("/api/clients/:clientId/practice-sessions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const coach = await storage.getCoachByUserId(userId);
      const clientId = parseInt(req.params.clientId);
      const limit = parseInt(req.query.limit as string) || 10;
      
      if (!coach) {
        return res.status(403).json({ message: "Coach profile required" });
      }

      // Verify client belongs to coach
      const client = await storage.getClientById(clientId);
      if (!client || client.coachId !== coach.id) {
        return res.status(404).json({ message: "Client not found" });
      }

      const sessions = await storage.getPracticeSessionsByClientId(clientId, limit);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching practice sessions:", error);
      res.status(500).json({ message: "Failed to fetch practice sessions" });
    }
  });

  // Notifications
  app.get("/api/notifications", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const coach = await storage.getCoachByUserId(userId);
      const unreadOnly = req.query.unread === 'true';
      
      if (!coach) {
        return res.status(403).json({ message: "Coach profile required" });
      }

      const notifications = await storage.getNotificationsByCoachId(coach.id, unreadOnly);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.put("/api/notifications/:id/read", isAuthenticated, async (req: any, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      await storage.markNotificationAsRead(notificationId);
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  return createServer(app);
}
