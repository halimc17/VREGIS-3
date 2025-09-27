import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';
import { teams } from '@/lib/db/schema';
import { eq, isNull } from 'drizzle-orm';
import { generateToken } from '@/lib/utils/token';

export async function POST(request: NextRequest) {
  try {
    console.log('Starting token generation for teams...');

    // Find teams without tokens
    const teamsWithoutTokens = await db
      .select()
      .from(teams)
      .where(isNull(teams.token));

    console.log(`Found ${teamsWithoutTokens.length} teams without tokens`);

    if (teamsWithoutTokens.length === 0) {
      return NextResponse.json({
        message: 'All teams already have tokens',
        updatedCount: 0
      });
    }

    const updatedTeams = [];

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

      updatedTeams.push({
        id: team.id,
        name: team.name,
        token: token!
      });

      console.log(`Updated team "${team.name}" with token: ${token!}`);
    }

    return NextResponse.json({
      message: 'Token generation completed successfully',
      updatedCount: updatedTeams.length,
      teams: updatedTeams
    });

  } catch (error) {
    console.error('Error generating tokens:', error);
    return NextResponse.json(
      { error: 'Failed to generate tokens' },
      { status: 500 }
    );
  }
}