import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';
import { teams } from '@/lib/db/schema';
import { z } from 'zod';

const teamSchema = z.object({
  name: z.string().min(1, 'Team name is required'),
  captainName: z.string().min(1, 'Captain name is required'),
  captainEmail: z.string().email('Invalid email format'),
  captainPhone: z.string().min(1, 'Captain phone is required'),
  institution: z.string().optional(),
  playerCount: z.number().min(6, 'Team must have at least 6 players').max(12, 'Team cannot have more than 12 players'),
  experience: z.enum(['beginner', 'intermediate', 'advanced']),
  notes: z.string().optional(),
});

export async function GET() {
  try {
    const allTeams = await db.select().from(teams).orderBy(teams.createdAt);

    return NextResponse.json({
      success: true,
      teams: allTeams,
    });

  } catch (error) {
    console.error('Get teams error:', error);
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
    const result = teamSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      );
    }

    const teamData = result.data;

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

    // Create team
    const [newTeam] = await db.insert(teams).values(teamData).returning();

    return NextResponse.json({
      success: true,
      team: newTeam,
    }, { status: 201 });

  } catch (error) {
    console.error('Create team error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}