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

const putraTeamNames = [
  'Qubic',
  'Neval (Bogor)',
  'Ctyr\'s (Depok)',
  'Bharata Muda',
  'Anper',
  'Satria Muda',
  'Arest',
  'Karuci',
  'Alpha',
  'Angkasa',
  'Vanching',
  'Vobgard',
  'Paja One',
  'Jakarta Muda',
  'JVC',
  'Pervina',
  'Benteng Muda (Tangerang)'
];

async function addPutraTeams() {
  try {
    console.log('Fetching tournaments...');
    const allTournaments = await db.select().from(tournaments);

    console.log('Available tournaments:');
    allTournaments.forEach(tournament => {
      console.log(`- ${tournament.name} (${tournament.category || 'No category'}) [${tournament.status}] - ID: ${tournament.id}`);
    });

    // Look for BEA PRO U17
    const beaProTournaments = await db
      .select()
      .from(tournaments)
      .where(ilike(tournaments.name, '%BEA PRO U17%'));

    let targetTournament;

    if (beaProTournaments.length === 0) {
      console.log('\nBEA PRO U17 tournament not found.');
      console.log('Available tournaments:');
      allTournaments.forEach(t => console.log(`- ${t.name}`));
      return;
    } else {
      targetTournament = beaProTournaments[0];
      console.log(`\nFound BEA PRO U17 tournament: ${targetTournament.name} - ID: ${targetTournament.id}`);
    }

    console.log(`\nAdding ${putraTeamNames.length} putra teams to ${targetTournament.name}...`);

    for (const teamName of putraTeamNames) {
      try {
        const result = await db.insert(teams).values({
          name: teamName,
          gender: 'putra',
          tournamentId: targetTournament.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }).returning();

        console.log(`✓ Added team: ${teamName} - ID: ${result[0].id}`);
      } catch (error) {
        if (error.message.includes('duplicate key value')) {
          console.log(`⚠ Team already exists: ${teamName} (putra)`);
        } else {
          console.log(`✗ Failed to add team: ${teamName} - ${error.message}`);
        }
      }
    }

    console.log(`\n✅ Finished adding ${putraTeamNames.length} putra teams to ${targetTournament.name}!`);

  } catch (error) {
    console.error('Error:', error);
  }
}

addPutraTeams();