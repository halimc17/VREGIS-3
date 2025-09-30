import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';
import { tournaments, teams, registrations, players, officials, teamJerseys, documents } from '@/lib/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { eq, inArray } from 'drizzle-orm';
import { z } from 'zod';

const updateTournamentSchema = z.object({
  name: z.string().min(1, 'Tournament name is required').optional(),
  category: z.enum(['putra', 'putri', 'mixed']).optional(),
  status: z.enum(['open', 'closed']).optional(),
  location: z.string().min(1, 'Location is required').optional(),
  description: z.string().optional(),
  startDate: z.string().transform((str) => new Date(str)).optional(),
  endDate: z.string().transform((str) => new Date(str)).optional(),
  registrationDeadline: z.string().transform((str) => new Date(str)).optional(),
  maxPlayersPerTeam: z.number().min(1, 'Max players per team must be at least 1').optional(),
  poolsPutra: z.number().min(0, 'Pools cannot be negative').optional(),
  poolsPutri: z.number().min(0, 'Pools cannot be negative').optional(),
  entryFee: z.number().min(0, 'Entry fee cannot be negative').optional(),
});

// GET /api/tournaments/[id] - Get tournament by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [tournament] = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.id, id))
      .limit(1);

    if (!tournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }

    return NextResponse.json(tournament);
  } catch (error) {
    console.error('Error fetching tournament:', error);
    return NextResponse.json({ error: 'Failed to fetch tournament' }, { status: 500 });
  }
}

// PUT /api/tournaments/[id] - Update tournament
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user || user.role !== 'administrator') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateTournamentSchema.parse(body);

    // Check if tournament exists
    const [existingTournament] = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.id, id))
      .limit(1);

    if (!existingTournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }

    // Validate dates if provided
    const startDate = validatedData.startDate || existingTournament.startDate;
    const endDate = validatedData.endDate || existingTournament.endDate;
    const registrationDeadline = validatedData.registrationDeadline || existingTournament.registrationDeadline;

    if (startDate >= endDate) {
      return NextResponse.json({ error: 'End date must be after start date' }, { status: 400 });
    }

    if (registrationDeadline >= startDate) {
      return NextResponse.json({ error: 'Registration deadline must be before start date' }, { status: 400 });
    }

    // Prepare update data
    const updateData: any = {
      ...validatedData,
      updatedAt: new Date(),
    };

    // Update tournament
    const [updatedTournament] = await db
      .update(tournaments)
      .set(updateData)
      .where(eq(tournaments.id, id))
      .returning();

    return NextResponse.json(updatedTournament);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error('Error updating tournament:', error);
    return NextResponse.json({ error: 'Failed to update tournament' }, { status: 500 });
  }
}

// DELETE /api/tournaments/[id] - Delete tournament
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  console.log('[DELETE] Starting delete operation...');

  try {
    // Resolve params first
    const resolvedParams = await context.params;
    const { id } = resolvedParams;
    console.log('[DELETE] Tournament ID:', id);

    if (!id) {
      console.log('[DELETE] No ID provided');
      return NextResponse.json({ error: 'Tournament ID is required' }, { status: 400 });
    }

    // Get current user
    let user;
    try {
      user = await getCurrentUser();
      console.log('[DELETE] User:', user ? `${user.email} (${user.role})` : 'null');
    } catch (authError) {
      console.error('[DELETE] Auth error:', authError);
      return NextResponse.json({ error: 'Authentication error' }, { status: 401 });
    }

    if (!user || user.role !== 'administrator') {
      console.log('[DELETE] Unauthorized - no user or not admin');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if tournament exists
    let existingTournament;
    try {
      [existingTournament] = await db
        .select()
        .from(tournaments)
        .where(eq(tournaments.id, id))
        .limit(1);
      console.log('[DELETE] Tournament exists:', !!existingTournament);
    } catch (dbError) {
      console.error('[DELETE] Database error checking tournament:', dbError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!existingTournament) {
      console.log('[DELETE] Tournament not found');
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }

    // Delete related data in proper order (from child to parent)
    console.log('[DELETE] Starting cascade delete...');
    try {
      // Get all team IDs for this tournament
      const tournamentTeams = await db
        .select({ id: teams.id })
        .from(teams)
        .where(eq(teams.tournamentId, id));

      const teamIds = tournamentTeams.map(t => t.id);
      console.log('[DELETE] Found teams:', teamIds.length);

      if (teamIds.length > 0) {
        // Get all player IDs from these teams
        const teamPlayers = await db
          .select({ id: players.id })
          .from(players)
          .where(inArray(players.teamId, teamIds));

        const playerIds = teamPlayers.map(p => p.id);
        console.log('[DELETE] Found players:', playerIds.length);

        // Delete documents for all players
        if (playerIds.length > 0) {
          await db.delete(documents).where(inArray(documents.playerId, playerIds));
          console.log('[DELETE] Documents deleted');
        }

        // Delete players
        await db.delete(players).where(inArray(players.teamId, teamIds));
        console.log('[DELETE] Players deleted');

        // Delete officials
        await db.delete(officials).where(inArray(officials.teamId, teamIds));
        console.log('[DELETE] Officials deleted');

        // Delete team jerseys
        await db.delete(teamJerseys).where(inArray(teamJerseys.teamId, teamIds));
        console.log('[DELETE] Team jerseys deleted');
      }

      // Delete registrations
      await db.delete(registrations).where(eq(registrations.tournamentId, id));
      console.log('[DELETE] Registrations deleted');

      // Delete teams
      await db.delete(teams).where(eq(teams.tournamentId, id));
      console.log('[DELETE] Teams deleted');

      // Finally delete tournament
      await db.delete(tournaments).where(eq(tournaments.id, id));
      console.log('[DELETE] Tournament deleted successfully');
    } catch (dbError) {
      console.error('[DELETE] Database error during deletion:', dbError);
      const errorMessage = dbError instanceof Error ? dbError.message : 'Unknown database error';
      return NextResponse.json({
        error: 'Failed to delete tournament',
        details: errorMessage
      }, { status: 500 });
    }

    console.log('[DELETE] All operations completed successfully');
    return NextResponse.json({ message: 'Tournament deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('[DELETE] Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    console.error('[DELETE] Error stack:', errorStack);

    return NextResponse.json({
      error: 'Failed to delete tournament',
      details: errorMessage
    }, { status: 500 });
  }
}