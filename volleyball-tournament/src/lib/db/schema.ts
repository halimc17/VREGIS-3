import { pgTable, uuid, varchar, text, timestamp, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Define role enum for better type safety
export const roleEnum = pgEnum('role', ['user', 'administrator']);

// Define tournament category enum
export const categoryEnum = pgEnum('category', ['putra', 'putri', 'mixed']);

// Define team gender enum
export const genderEnum = pgEnum('gender', ['putra', 'putri']);

// Define player position enum
export const positionEnum = pgEnum('position', ['Outside Hitter', 'Middle Blocker', 'Setter', 'Libero', 'Opposite Hitter', 'Defensive Specialist']);

// Define official position enum
export const officialPositionEnum = pgEnum('official_position', ['Manager', 'Head Coach', 'Assistant Coach 1', 'Assistant Coach 2']);

// Define tournament status enum
export const tournamentStatusEnum = pgEnum('tournament_status', ['open', 'closed']);

// Users table for admin authentication
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('user'),
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
  token: varchar('token', { length: 8 }).notNull().unique(), // 8-character token for public access
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Registrations table for team tournament registrations (existing table)
export const registrations = pgTable('registrations', {
  id: uuid('id').primaryKey().defaultRandom(),
  tournamentId: uuid('tournament_id').notNull().references(() => tournaments.id, { onDelete: 'cascade' }),
  teamId: uuid('team_id').notNull().references(() => teams.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  registrationDate: timestamp('registration_date').defaultNow().notNull(),
  paymentStatus: varchar('payment_status', { length: 50 }).notNull().default('unpaid'),
  paymentDate: timestamp('payment_date'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Players table for team member registration
export const players = pgTable('players', {
  id: uuid('id').primaryKey().defaultRandom(),
  teamId: uuid('team_id').notNull().references(() => teams.id, { onDelete: 'cascade' }),
  namaLengkap: varchar('nama_lengkap', { length: 255 }).notNull(),
  namaJersey: varchar('nama_jersey', { length: 100 }),
  noJersey: integer('no_jersey').notNull(),
  position: positionEnum('position').notNull(),
  gender: genderEnum('gender').notNull(),
  tempatLahir: varchar('tempat_lahir', { length: 255 }).notNull(),
  tanggalLahir: timestamp('tanggal_lahir').notNull(),
  tinggi: integer('tinggi'), // in cm
  berat: integer('berat'), // in kg
  nik: varchar('nik', { length: 16 }).unique(),
  nisn: varchar('nisn', { length: 10 }).unique(),
  sekolah: varchar('sekolah', { length: 255 }).notNull(),
  kotaSekolahAsal: varchar('kota_sekolah_asal', { length: 255 }).notNull(),
  fotoAtlet: varchar('foto_atlet', { length: 500 }), // Cloudinary URL
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Officials table for team officials
export const officials = pgTable('officials', {
  id: uuid('id').primaryKey().defaultRandom(),
  teamId: uuid('team_id').notNull().references(() => teams.id, { onDelete: 'cascade' }),
  namaLengkap: varchar('nama_lengkap', { length: 255 }).notNull(),
  posisi: officialPositionEnum('posisi').notNull(),
  nomorTelepon: varchar('nomor_telepon', { length: 20 }).notNull(),
  fotoOfficial: varchar('foto_official', { length: 500 }), // Cloudinary URL
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});


// Define relationships
export const tournamentsRelations = relations(tournaments, ({ many }) => ({
  teams: many(teams),
  registrations: many(registrations),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  tournament: one(tournaments, {
    fields: [teams.tournamentId],
    references: [tournaments.id],
  }),
  players: many(players),
  officials: many(officials),
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

export const playersRelations = relations(players, ({ one }) => ({
  team: one(teams, {
    fields: [players.teamId],
    references: [teams.id],
  }),
}));

export const officialsRelations = relations(officials, ({ one }) => ({
  team: one(teams, {
    fields: [officials.teamId],
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

export type Player = typeof players.$inferSelect;
export type NewPlayer = typeof players.$inferInsert;

export type Official = typeof officials.$inferSelect;
export type NewOfficial = typeof officials.$inferInsert;

export type Registration = typeof registrations.$inferSelect;
export type NewRegistration = typeof registrations.$inferInsert;