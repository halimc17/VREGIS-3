require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const fs = require('fs');

// Create connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
});

async function runScript() {
  try {
    // First, check tournaments
    console.log('Checking tournaments...');
    const tournamentsResult = await pool.query(
      "SELECT id, name, category, status FROM tournaments ORDER BY created_at DESC"
    );

    console.log('Available tournaments:');
    tournamentsResult.rows.forEach(row => {
      console.log(`- ${row.name} (${row.category}) [${row.status}] - ID: ${row.id}`);
    });

    // Look for BEA PRO 17
    const beaProResult = await pool.query(
      "SELECT id, name FROM tournaments WHERE name ILIKE '%BEA PRO 17%'"
    );

    if (beaProResult.rows.length === 0) {
      console.log('\nTournament BEA PRO 17 not found. Please create it first or use a different tournament.');

      // Ask user to specify tournament ID manually
      console.log('\nIf you want to add teams to a different tournament, please update the script with the correct tournament ID.');
      process.exit(1);
    }

    const tournamentId = beaProResult.rows[0].id;
    console.log(`\nFound tournament: ${beaProResult.rows[0].name} - ID: ${tournamentId}`);

    // Add teams
    console.log('\nAdding 13 putri teams...');

    const teams = [
      'Qubic', 'Kencana Jaya', 'Tunas', 'Gracia', 'Urban',
      'Gajah Mungkur', 'Karuci', 'SKY', 'Comet', 'Bharata Muda',
      'Pervina', 'JVC', 'VIKING'
    ];

    for (const teamName of teams) {
      await pool.query(
        `INSERT INTO teams (id, name, gender, tournament_id, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, 'putri', $2, NOW(), NOW())`,
        [teamName, tournamentId]
      );
      console.log(`✓ Added team: ${teamName}`);
    }

    console.log(`\n✅ Successfully added ${teams.length} putri teams to BEA PRO 17 tournament!`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

runScript();