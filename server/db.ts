import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzleSQLite } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import ws from "ws";
import * as schema from "@shared/schema";
import { eq } from 'drizzle-orm';

// Check if running in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Declare variables for export
let db: any;
let pool: any = null;

if (isDevelopment) {
  console.log('Running in development mode with SQLite database');
  
  // Initialize SQLite database
  const sqlite = new Database('sql/dating_coach_platform.db');
  
  // Set the database connection
  db = drizzleSQLite(sqlite);
  
  // No pool is needed for SQLite
} else {
  // Neon PostgreSQL setup for production
  neonConfig.webSocketConstructor = ws;

  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }

  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzleNeon({ client: pool, schema });
}

// Export the database and pool
export { db, pool };