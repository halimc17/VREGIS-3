import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';
import { tournaments } from '@/lib/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const tournamentSchema = z.object({
  name: z.string().min(1, 'Tournament name is required'),
  category: z.enum(['putra', 'putri', 'mixed']),
  status: z.enum(['open', 'closed']).default('open'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().optional(),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)),
  registrationDeadline: z.string().transform((str) => new Date(str)),
  maxPlayersPerTeam: z.number().min(1, 'Max players per team must be at least 1'),
  poolsPutra: z.number().min(0, 'Pools cannot be negative'),
  poolsPutri: z.number().min(0, 'Pools cannot be negative'),
  entryFee: z.number().min(0, 'Entry fee cannot be negative').default(0),
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

    const allTournaments = await db.select().from(tournaments).orderBy(tournaments.createdAt);

    return NextResponse.json({
      success: true,
      tournaments: allTournaments
    });

  } catch (error) {
    console.error('Get tournaments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input
    const result = tournamentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      );
    }

    const tournamentData = result.data;

    // Validate dates
    if (tournamentData.startDate >= tournamentData.endDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    if (tournamentData.registrationDeadline >= tournamentData.startDate) {
      return NextResponse.json(
        { error: 'Registration deadline must be before start date' },
        { status: 400 }
      );
    }

    // Create tournament
    const [newTournament] = await db.insert(tournaments).values(tournamentData).returning();

    return NextResponse.json(newTournament, { status: 201 });

  } catch (error) {
    console.error('Create tournament error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}