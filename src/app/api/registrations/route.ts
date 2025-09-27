import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';
import { registrations, teams, tournaments } from '@/lib/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';
import { eq, and } from 'drizzle-orm';

const registrationSchema = z.object({
  tournamentId: z.string().uuid('Invalid tournament ID'),
  teamData: z.object({
    name: z.string().min(1, 'Team name is required'),
    captainName: z.string().min(1, 'Captain name is required'),
    captainEmail: z.string().email('Invalid email format'),
    captainPhone: z.string().min(1, 'Captain phone is required'),
    institution: z.string().optional(),
    playerCount: z.number().min(6, 'Team must have at least 6 players').max(12, 'Team cannot have more than 12 players'),
    experience: z.enum(['beginner', 'intermediate', 'advanced']),
    notes: z.string().optional(),
  }),
});

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get all registrations with team and tournament data
    const allRegistrations = await db
      .select({
        registration: registrations,
        team: teams,
        tournament: tournaments,
      })
      .from(registrations)
      .leftJoin(teams, eq(registrations.teamId, teams.id))
      .leftJoin(tournaments, eq(registrations.tournamentId, tournaments.id))
      .orderBy(registrations.createdAt);

    return NextResponse.json({
      success: true,
      registrations: allRegistrations,
    });

  } catch (error) {
    console.error('Get registrations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const result = registrationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      );
    }

    const { tournamentId, teamData } = result.data;

    // Check if tournament exists and is accepting registrations
    const tournament = await db.select().from(tournaments).where(eq(tournaments.id, tournamentId));

    if (tournament.length === 0) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      );
    }

    const tournamentRecord = tournament[0];

    if (new Date() > new Date(tournamentRecord.registrationDeadline)) {
      return NextResponse.json(
        { error: 'Registration deadline has passed' },
        { status: 400 }
      );
    }

    if (tournamentRecord.status !== 'upcoming') {
      return NextResponse.json(
        { error: 'Tournament is not accepting registrations' },
        { status: 400 }
      );
    }

    // Check if team name already exists
    const existingTeams = await db.select().from(teams).where(
      db.sql`LOWER(${teams.name}) = LOWER(${teamData.name})`
    );

    if (existingTeams.length > 0) {
      return NextResponse.json(
        { error: 'Team name already exists' },
        { status: 400 }
      );
    }

    // Check current registrations count
    const currentRegistrations = await db
      .select()
      .from(registrations)
      .where(
        and(
          eq(registrations.tournamentId, tournamentId),
          eq(registrations.status, 'approved')
        )
      );

    const shouldAutoApprove = currentRegistrations.length < tournamentRecord.maxTeams;

    // Create team first
    const [newTeam] = await db.insert(teams).values(teamData).returning();

    // Create registration
    const [newRegistration] = await db.insert(registrations).values({
      tournamentId,
      teamId: newTeam.id,
      status: shouldAutoApprove ? 'approved' : 'waitlisted',
    }).returning();

    return NextResponse.json({
      success: true,
      registration: newRegistration,
      team: newTeam,
      status: shouldAutoApprove ? 'approved' : 'waitlisted',
    }, { status: 201 });

  } catch (error) {
    console.error('Create registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}