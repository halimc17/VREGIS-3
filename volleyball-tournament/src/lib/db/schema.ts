import { pgTable, uuid, varchar, text, timestamp, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Define role enum for better type safety
export const roleEnum = pgEnum('role', ['user', 'administrator']);

// Define tournament category enum
export const categoryEnum = pgEnum('category', ['putra', 'putri', 'mixed']);

// Define team gender enum
export const genderEnum = pgEnum('gender', ['putra', 'putri']);

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

// Teams table - simplified for tournament registration
export const teams = pgTable('teams', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  gender: genderEnum('gender').notNull(),
  tournamentId: uuid('tournament_id').notNull().references(() => tournaments.id, { onDelete: 'cascade' }),
  logo: varchar('logo', { length: 500 }), // Cloudinary URL
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});


// Define relationships
export const tournamentsRelations = relations(tournaments, ({ many }) => ({
  teams: many(teams),
}));

export const teamsRelations = relations(teams, ({ one }) => ({
  tournament: one(tournaments, {
    fields: [teams.tournamentId],
    references: [tournaments.id],
  }),
}));

// Types for use in the application
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Tournament = typeof tournaments.$inferSelect;
export type NewTournament = typeof tournaments.$inferInsert;

export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;