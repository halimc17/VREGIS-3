import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { pgTable, uuid, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { ilike } from 'drizzle-orm';

// Define schema inline
const genderEnum = pgEnum('gender', ['putra', 'putri']);

const tournaments = pgTable('tournaments', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }),
  status: varchar('status', { length: 50 }).default('open'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

const teams = pgTable('teams', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  gender: genderEnum('gender').notNull(),
  tournamentId: uuid('tournament_id').notNull(),
  logo: varchar('logo', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

const teamNames = [
  'Qubic', 'Kencana Jaya', 'Tunas', 'Gracia', 'Urban',
  'Gajah Mungkur', 'Karuci', 'SKY', 'Comet', 'Bharata Muda',
  'Pervina', 'JVC', 'VIKING'
];

async function addTeams() {
  try {
    console.log('Fetching tournaments...');
    const allTournaments = await db.select().from(tournaments);

    console.log('Available tournaments:');
    allTournaments.forEach(tournament => {
      console.log(`- ${tournament.name} (${tournament.category || 'No category'}) [${tournament.status}] - ID: ${tournament.id}`);
    });

    // Look for BEA PRO 17
    const beaProTournaments = await db
      .select()
      .from(tournaments)
      .where(ilike(tournaments.name, '%BEA PRO 17%'));

    let targetTournament;

    if (beaProTournaments.length === 0) {
      console.log('\nBEA PRO 17 tournament not found.');
      if (allTournaments.length > 0) {
        targetTournament = allTournaments[0];
        console.log(`Using first available tournament: ${targetTournament.name}`);
      } else {
        console.log('No tournaments available. Please create a tournament first.');
        return;
      }
    } else {
      targetTournament = beaProTournaments[0];
      console.log(`\nFound BEA PRO 17 tournament: ${targetTournament.name} - ID: ${targetTournament.id}`);
    }

    console.log(`\nAdding ${teamNames.length} putri teams to ${targetTournament.name}...`);

    for (const teamName of teamNames) {
      try {
        const result = await db.insert(teams).values({
          name: teamName,
          gender: 'putri',
          tournamentId: targetTournament.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }).returning();

        console.log(`✓ Added team: ${teamName} - ID: ${result[0].id}`);
      } catch (error) {
        if (error.message.includes('duplicate key value')) {
          console.log(`⚠ Team already exists: ${teamName}`);
        } else {
          console.log(`✗ Failed to add team: ${teamName} - ${error.message}`);
        }
      }
    }

    console.log(`\n✅ Finished adding putri teams to ${targetTournament.name}!`);

  } catch (error) {
    console.error('Error:', error);
  }
}

addTeams();