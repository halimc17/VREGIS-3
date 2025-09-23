import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';
import { teams, tournaments, players } from '@/lib/db/schema';
import { eq, and, count, sql } from 'drizzle-orm';
import { z } from 'zod';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { generateToken } from '@/lib/utils/token';

const teamSchema = z.object({
  name: z.string().min(1, 'Team name is required'),
  gender: z.enum(['putra', 'putri']),
  tournamentId: z.string().uuid('Invalid tournament ID'),
  logo: z.string().optional(), // Cloudinary URL
});

export async function GET() {
  try {
    // Get teams with tournament information and player count
    const allTeams = await db
      .select({
        id: teams.id,
        name: teams.name,
        gender: teams.gender,
        logo: teams.logo,
        token: teams.token,
        createdAt: teams.createdAt,
        tournament: {
          id: tournaments.id,
          name: tournaments.name,
          category: tournaments.category,
        },
        playerCount: sql<number>`COALESCE(${count(players.id)}, 0)`.as('playerCount')
      })
      .from(teams)
      .leftJoin(tournaments, eq(teams.tournamentId, tournaments.id))
      .leftJoin(players, eq(teams.id, players.teamId))
      .groupBy(teams.id, tournaments.id, tournaments.name, tournaments.category)
      .orderBy(teams.createdAt);

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
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const gender = formData.get('gender') as string;
    const tournamentId = formData.get('tournamentId') as string;
    const logoFile = formData.get('logo') as File | null;

    // Validate input
    const result = teamSchema.safeParse({
      name,
      gender,
      tournamentId,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      );
    }

    const teamData = result.data;

    // Check if tournament exists
    const tournament = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.id, teamData.tournamentId))
      .limit(1);

    if (tournament.length === 0) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      );
    }

    // Check if team name + gender combination already exists
    const existingTeams = await db
      .select()
      .from(teams)
      .where(
        and(
          eq(teams.name, teamData.name),
          eq(teams.gender, teamData.gender)
        )
      );

    if (existingTeams.length > 0) {
      return NextResponse.json(
        { error: `Tim ${teamData.name} dengan gender ${teamData.gender} sudah terdaftar` },
        { status: 400 }
      );
    }

    let logoUrl: string | undefined;

    // Handle logo upload to Cloudinary if provided
    if (logoFile && logoFile.size > 0) {
      try {
        logoUrl = await uploadToCloudinary(logoFile);
      } catch (uploadError) {
        console.error('Logo upload error:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload logo' },
          { status: 500 }
        );
      }
    }

    // Generate unique token
    let token: string;
    let isUnique = false;
    while (!isUnique) {
      token = generateToken();

      // Check if token already exists
      const existingToken = await db
        .select()
        .from(teams)
        .where(eq(teams.token, token))
        .limit(1);

      if (existingToken.length === 0) {
        isUnique = true;
      }
    }

    // Create team
    const [newTeam] = await db.insert(teams).values({
      ...teamData,
      logo: logoUrl,
      token: token!,
    }).returning();

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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('id');

    if (!teamId) {
      return NextResponse.json(
        { error: 'Team ID is required' },
        { status: 400 }
      );
    }

    // Check if team exists
    const existingTeam = await db
      .select()
      .from(teams)
      .where(eq(teams.id, teamId))
      .limit(1);

    if (existingTeam.length === 0) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    // Delete team
    await db.delete(teams).where(eq(teams.id, teamId));

    return NextResponse.json({
      success: true,
      message: 'Team deleted successfully',
    });

  } catch (error) {
    console.error('Delete team error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}