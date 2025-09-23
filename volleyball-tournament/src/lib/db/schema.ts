import { pgTable, uuid, varchar, text, timestamp, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Define role enum for better type safety
export const roleEnum = pgEnum('role', ['user', 'administrator']);

// Define tournament category enum
export const categoryEnum = pgEnum('category', ['putra', 'putri', 'mixed']);

// Define tournament status enum
export const tournamentStatusEnum = pgEnum('tournament_status', ['open', 'closed']);

// Users table for admin authentication
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: roleEnum('role').notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tournaments table
export const tournaments = pgTable('tournaments', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  category: categoryEnum('category').notNull(),
  status: tournamentStatusEnum('status').notNull().default('open'),
  location: varchar('location', { length: 255 }).notNull(),
  description: text('description'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  registrationDeadline: timestamp('registration_deadline').notNull(),
  maxPlayersPerTeam: integer('max_players_per_team').notNull().default(14),
  poolsPutra: integer('pools_putra').notNull().default(0),
  poolsPutri: integer('pools_putri').notNull().default(0),
  entryFee: integer('entry_fee').default(0), // in cents
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Teams table
export const teams = pgTable('teams', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  captainName: varchar('captain_name', { length: 255 }).notNull(),
  captainEmail: varchar('captain_email', { length: 255 }).notNull(),
  captainPhone: varchar('captain_phone', { length: 20 }).notNull(),
  institution: varchar('institution', { length: 255 }),
  playerCount: integer('player_count').notNull().default(6),
  experience: varchar('experience', { length: 50 }).notNull(), // beginner, intermediate, advanced
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Team registrations for tournaments
export const registrations = pgTable('registrations', {
  id: uuid('id').primaryKey().defaultRandom(),
  tournamentId: uuid('tournament_id').notNull().references(() => tournaments.id, { onDelete: 'cascade' }),
  teamId: uuid('team_id').notNull().references(() => teams.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 50 }).notNull().default('pending'), // pending, approved, rejected, waitlisted
  registrationDate: timestamp('registration_date').defaultNow().notNull(),
  paymentStatus: varchar('payment_status', { length: 50 }).notNull().default('unpaid'), // unpaid, paid, refunded
  paymentDate: timestamp('payment_date'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Define relationships
export const tournamentsRelations = relations(tournaments, ({ many }) => ({
  registrations: many(registrations),
}));

export const teamsRelations = relations(teams, ({ many }) => ({
  registrations: many(registrations),
}));

export const registrationsRelations = relations(registrations, ({ one }) => ({
  tournament: one(tournaments, {
    fields: [registrations.tournamentId],
    references: [tournaments.id],
  }),
  team: one(teams, {
    fields: [registrations.teamId],
    references: [teams.id],
  }),
}));

// Types for use in the application
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Tournament = typeof tournaments.$inferSelect;
export type NewTournament = typeof tournaments.$inferInsert;

export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;

export type Registration = typeof registrations.$inferSelect;
export type NewRegistration = typeof registrations.$inferInsert;