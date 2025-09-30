import { NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';
import { teams, players, officials, teamJerseys, documents } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(
  request: Request,
  context: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await context.params;

    // Fetch team with all related data
    const [team] = await db
      .select()
      .from(teams)
      .where(eq(teams.id, teamId))
      .limit(1);

    if (!team) {
      return NextResponse.json(
        { success: false, error: 'Team not found' },
        { status: 404 }
      );
    }

    // Fetch players with their documents
    const teamPlayers = await db
      .select()
      .from(players)
      .where(eq(players.teamId, teamId))
      .orderBy(asc(players.noJersey));

    // Fetch documents for each player
    const playersWithDocuments = await Promise.all(
      teamPlayers.map(async (player) => {
        const playerDocuments = await db
          .select()
          .from(documents)
          .where(eq(documents.playerId, player.id));

        return {
          ...player,
          documents: playerDocuments,
        };
      })
    );

    // Fetch officials
    const teamOfficials = await db
      .select()
      .from(officials)
      .where(eq(officials.teamId, teamId));

    // Fetch jerseys
    const [teamJersey] = await db
      .select()
      .from(teamJerseys)
      .where(eq(teamJerseys.teamId, teamId))
      .limit(1);

    return NextResponse.json({
      success: true,
      data: {
        team,
        players: playersWithDocuments,
        officials: teamOfficials,
        jerseys: teamJersey || null,
      },
    });
  } catch (error) {
    console.error('Error fetching team details:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team details' },
      { status: 500 }
    );
  }
}
