require('dotenv').config({ path: '.env.local' });
const { drizzle } = require('drizzle-orm/neon-http');
const { neon } = require('@neondatabase/serverless');
const { tournaments, teams } = require('./src/lib/db/schema');
const { eq, ilike } = require('drizzle-orm');

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function addTeams() {
  try {
    // First, check tournaments
    console.log('Checking tournaments...');
    const allTournaments = await db.select().from(tournaments).orderBy(tournaments.createdAt);

    console.log('Available tournaments:');
    allTournaments.forEach(row => {
      console.log(`- ${row.name} (${row.category}) [${row.status}] - ID: ${row.id}`);
    });

    // Look for BEA PRO 17
    const beaProTournaments = await db
      .select()
      .from(tournaments)
      .where(ilike(tournaments.name, '%BEA PRO 17%'));

    if (beaProTournaments.length === 0) {
      console.log('\nTournament BEA PRO 17 not found. Available tournaments:');
      allTournaments.forEach(t => console.log(`- ${t.name}`));

      // Use any available tournament for demonstration
      if (allTournaments.length > 0) {
        const firstTournament = allTournaments[0];
        console.log(`\nUsing first available tournament: ${firstTournament.name}`);

        await addTeamsToTournament(firstTournament.id, firstTournament.name);
      } else {
        console.log('No tournaments available. Please create a tournament first.');
      }

      return;
    }

    const tournament = beaProTournaments[0];
    console.log(`\nFound tournament: ${tournament.name} - ID: ${tournament.id}`);

    await addTeamsToTournament(tournament.id, tournament.name);

  } catch (error) {
    console.error('Error:', error);
  }
}

async function addTeamsToTournament(tournamentId, tournamentName) {
  const teamNames = [
    'Qubic', 'Kencana Jaya', 'Tunas', 'Gracia', 'Urban',
    'Gajah Mungkur', 'Karuci', 'SKY', 'Comet', 'Bharata Muda',
    'Pervina', 'JVC', 'VIKING'
  ];

  console.log(`\nAdding ${teamNames.length} putri teams to ${tournamentName}...`);

  for (const teamName of teamNames) {
    try {
      const result = await db.insert(teams).values({
        name: teamName,
        gender: 'putri',
        tournamentId: tournamentId,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      console.log(`✓ Added team: ${teamName} - ID: ${result[0].id}`);
    } catch (error) {
      console.log(`✗ Failed to add team: ${teamName} - ${error.message}`);
    }
  }

  console.log(`\n✅ Finished adding putri teams to ${tournamentName}!`);
}

addTeams();