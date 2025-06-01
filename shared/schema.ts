import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  numeric,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { sqliteTable, text as sqliteText, integer as sqliteInteger, real } from "drizzle-orm/sqlite-core";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User table
export const users = sqliteTable("users", {
  id: sqliteText("id").primaryKey(),
  email: sqliteText("email").notNull(),
  firstName: sqliteText("first_name"),
  lastName: sqliteText("last_name"),
  profileImageUrl: sqliteText("profile_image_url"),
  createdAt: sqliteText("created_at"),
  updatedAt: sqliteText("updated_at"),
});

// Coach profiles with additional info
export const coaches = sqliteTable("coaches", {
  id: sqliteInteger("id").primaryKey(),
  userId: sqliteText("user_id").notNull().references(() => users.id),
  businessName: sqliteText("business_name"),
  specializations: sqliteText("specializations"), // Stored as comma-separated string
  yearsExperience: sqliteInteger("years_experience"),
  certifications: sqliteText("certifications"), // Stored as comma-separated string
  timezone: sqliteText("timezone"),
  createdAt: sqliteText("created_at"),
});

// Client profiles
export const clients = sqliteTable("clients", {
  id: sqliteInteger("id").primaryKey(),
  userId: sqliteText("user_id").notNull().references(() => users.id),
  coachId: sqliteInteger("coach_id").references(() => coaches.id),
  goals: sqliteText("goals"), // Stored as comma-separated string
  preferences: sqliteText("preferences"), // Stored as JSON string
  engagementLevel: sqliteText("engagement_level"),
  lastSessionDate: sqliteText("last_session_date"),
  totalSessions: sqliteInteger("total_sessions"),
  createdAt: sqliteText("created_at"),
});

// Feedback submissions
export const feedback = sqliteTable("feedback", {
  id: sqliteInteger("id").primaryKey(),
  clientId: sqliteInteger("client_id").notNull().references(() => clients.id),
  source: sqliteText("source"),
  content: sqliteText("content"),
  originalLanguage: sqliteText("original_language"),
  translatedContent: sqliteText("translated_content"),
  sentiment: sqliteText("sentiment"),
  sentimentScore: real("sentiment_score"),
  isAnonymous: sqliteInteger("is_anonymous", { mode: 'boolean' }),
  submitterType: sqliteText("submitter_type"),
  isReviewed: sqliteInteger("is_reviewed", { mode: 'boolean' }),
  reviewedAt: sqliteText("reviewed_at"),
  coachNotes: sqliteText("coach_notes"),
  createdAt: sqliteText("created_at"),
});

// Practice sessions with AI
export const practiceSessions = sqliteTable("practice_sessions", {
  id: sqliteInteger("id").primaryKey(),
  clientId: sqliteInteger("client_id").notNull().references(() => clients.id),
  scenario: sqliteText("scenario"),
  difficulty: sqliteInteger("difficulty"),
  duration: sqliteInteger("duration"),
  score: sqliteInteger("score"),
  skillsAssessed: sqliteText("skills_assessed"), // Stored as comma-separated string
  conversation: sqliteText("conversation"), // Stored as JSON string
  improvements: sqliteText("improvements"),
  completedAt: sqliteText("completed_at"),
  createdAt: sqliteText("created_at"),
});

// Between-session check-ins
export const checkIns = sqliteTable("check_ins", {
  id: sqliteInteger("id").primaryKey(),
  clientId: sqliteInteger("client_id").notNull().references(() => clients.id),
  type: sqliteText("type").notNull(),
  prompt: sqliteText("prompt"),
  response: sqliteText("response"),
  mood: sqliteText("mood"),
  goals: sqliteText("goals"), // Stored as comma-separated string
  completedAt: sqliteText("completed_at"),
  createdAt: sqliteText("created_at"),
});

// Goal tracking
export const goals = sqliteTable("goals", {
  id: sqliteInteger("id").primaryKey(),
  clientId: sqliteInteger("client_id").notNull().references(() => clients.id),
  title: sqliteText("title").notNull(),
  description: sqliteText("description"),
  category: sqliteText("category"),
  targetDate: sqliteText("target_date"),
  status: sqliteText("status"),
  progress: sqliteInteger("progress"),
  milestones: sqliteText("milestones"), // Stored as JSON string
  createdAt: sqliteText("created_at"),
  updatedAt: sqliteText("updated_at"),
});

// Notifications for coaches
export const notifications = sqliteTable("notifications", {
  id: sqliteInteger("id").primaryKey(),
  coachId: sqliteInteger("coach_id").notNull().references(() => coaches.id),
  type: sqliteText("type").notNull(),
  title: sqliteText("title").notNull(),
  message: sqliteText("message"),
  priority: sqliteText("priority"),
  isRead: sqliteInteger("is_read", { mode: 'boolean' }),
  relatedClientId: sqliteInteger("related_client_id"),
  createdAt: sqliteText("created_at"),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  coach: one(coaches, {
    fields: [users.id],
    references: [coaches.userId],
  }),
  client: one(clients, {
    fields: [users.id],
    references: [clients.userId],
  }),
}));

export const coachesRelations = relations(coaches, ({ one, many }) => ({
  user: one(users, {
    fields: [coaches.userId],
    references: [users.id],
  }),
  clients: many(clients),
  notifications: many(notifications),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  user: one(users, {
    fields: [clients.userId],
    references: [users.id],
  }),
  coach: one(coaches, {
    fields: [clients.coachId],
    references: [coaches.id],
  }),
  feedback: many(feedback),
  practiceSessions: many(practiceSessions),
  checkIns: many(checkIns),
  goals: many(goals),
}));

export const feedbackRelations = relations(feedback, ({ one }) => ({
  client: one(clients, {
    fields: [feedback.clientId],
    references: [clients.id],
  }),
}));

export const practiceSessionsRelations = relations(practiceSessions, ({ one }) => ({
  client: one(clients, {
    fields: [practiceSessions.clientId],
    references: [clients.id],
  }),
}));

export const checkInsRelations = relations(checkIns, ({ one }) => ({
  client: one(clients, {
    fields: [checkIns.clientId],
    references: [clients.id],
  }),
}));

export const goalsRelations = relations(goals, ({ one }) => ({
  client: one(clients, {
    fields: [goals.clientId],
    references: [clients.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  coach: one(coaches, {
    fields: [notifications.coachId],
    references: [coaches.id],
  }),
}));

// Insert schemas
export const upsertUserSchema = createInsertSchema(users);
export const insertCoachSchema = createInsertSchema(coaches).omit({ id: true });
export const insertClientSchema = createInsertSchema(clients).omit({ id: true });
export const insertFeedbackSchema = createInsertSchema(feedback).omit({ id: true });
export const insertPracticeSessionSchema = createInsertSchema(practiceSessions).omit({ id: true });
export const insertCheckInSchema = createInsertSchema(checkIns).omit({ id: true });
export const insertGoalSchema = createInsertSchema(goals).omit({ id: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true });

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type Coach = typeof coaches.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type Feedback = typeof feedback.$inferSelect;
export type PracticeSession = typeof practiceSessions.$inferSelect;
export type CheckIn = typeof checkIns.$inferSelect;
export type Goal = typeof goals.$inferSelect;
export type Notification = typeof notifications.$inferSelect;

export type InsertCoach = z.infer<typeof insertCoachSchema>;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type InsertPracticeSession = z.infer<typeof insertPracticeSessionSchema>;
export type InsertCheckIn = z.infer<typeof insertCheckInSchema>;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
