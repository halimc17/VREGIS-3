import * as dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function checkTournaments() {
  try {
    console.log('Checking tournaments table...');

    // Check tournaments table structure
    const tournamentColumns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'tournaments' AND table_schema = 'public'
      ORDER BY ordinal_position;
    `;

    console.log('🏆 Tournaments table structure:');
    if (tournamentColumns.length === 0) {
      console.log('Tournaments table not found.');
      return;
    }

    tournamentColumns.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(nullable)' : '(not null)'}`);
    });
    console.log('');

    // Count tournaments
    const tournamentCount = await sql`SELECT COUNT(*) as count FROM tournaments`;
    console.log(`📊 Total tournaments: ${tournamentCount[0].count}`);

    // Show tournaments if any exist
    const tournaments = await sql`SELECT * FROM tournaments LIMIT 3`;
    if (tournaments.length > 0) {
      console.log('🏆 Sample tournaments:');
      tournaments.forEach(tournament => {
        console.log(`- ID: ${tournament.id}`);
        console.log(`  Name: ${tournament.name || 'N/A'}`);
        console.log(`  Location: ${tournament.location || 'N/A'}`);
        console.log(`  Status: ${tournament.status || 'N/A'}`);
        console.log('');
      });
    } else {
      console.log('No tournaments found in the database.');
      console.log('');
      console.log('Creating a sample tournament...');

      // Create a sample tournament
      await sql`
        INSERT INTO tournaments (name, location, status, created_at, updated_at)
        VALUES ('Sample Tournament', 'Jakarta', 'upcoming', NOW(), NOW())
      `;

      console.log('✅ Sample tournament created!');
    }

  } catch (error) {
    console.error('❌ Error checking tournaments:', error);
    process.exit(1);
  }
}

checkTournaments().then(() => {
  console.log('\n✅ Tournament check completed');
  process.exit(0);
});