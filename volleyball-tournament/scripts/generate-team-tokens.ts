import * as dotenv from 'dotenv';
import { db } from '../src/lib/db/connection';
import { teams } from '../src/lib/db/schema';
import { eq, isNull } from 'drizzle-orm';
import { generateToken } from '../src/lib/utils/token';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function generateTeamTokens() {
  try {
    console.log('Starting token generation for teams...');

    // Find teams without tokens
    const teamsWithoutTokens = await db
      .select()
      .from(teams)
      .where(isNull(teams.token));

    console.log(`Found ${teamsWithoutTokens.length} teams without tokens`);

    if (teamsWithoutTokens.length === 0) {
      console.log('All teams already have tokens');
      return;
    }

    // Update each team with a unique token
    for (const team of teamsWithoutTokens) {
      let token: string;
      let isUnique = false;

      // Keep generating tokens until we find a unique one
      while (!isUnique) {
        token = generateToken();

        // Check if token already exists
        const existingTeam = await db
          .select()
          .from(teams)
          .where(eq(teams.token, token))
          .limit(1);

        if (existingTeam.length === 0) {
          isUnique = true;
        }
      }

      // Update team with token
      await db
        .update(teams)
        .set({
          token: token!,
          updatedAt: new Date()
        })
        .where(eq(teams.id, team.id));

      console.log(`Updated team "${team.name}" with token: ${token!}`);
    }

    console.log('Token generation completed successfully');
  } catch (error) {
    console.error('Error generating tokens:', error);
    process.exit(1);
  }
}

// Run the script
generateTeamTokens().then(() => {
  console.log('Done');
  process.exit(0);
});