import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';
import { teams, teamJerseys } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const jerseyCreateSchema = z.object({
  teamId: z.string().uuid(),
  warnaJersey1: z.string().nullable().optional(),
  warnaJersey2: z.string().nullable().optional(),
  warnaJersey3: z.string().nullable().optional(),
});

interface RouteParams {
  params: Promise<{
    token: string;
  }>;
}

// GET - Fetch team jerseys
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { token } = await params;

    // Verify team exists
    const team = await db
      .select({ id: teams.id })
      .from(teams)
      .where(eq(teams.token, token))
      .limit(1);

    if (team.length === 0) {
      return NextResponse.json(
        { message: 'Tim tidak ditemukan' },
        { status: 404 }
      );
    }

    // Get team jerseys
    const jerseys = await db
      .select()
      .from(teamJerseys)
      .where(eq(teamJerseys.teamId, team[0].id));

    return NextResponse.json({
      jerseys,
      message: 'Data jersey berhasil diambil'
    });
  } catch (error) {
    console.error('Error fetching jerseys:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat mengambil data jersey' },
      { status: 500 }
    );
  }
}

// POST - Create team jersey
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { token } = await params;
    const body = await request.json();

    // Validate input
    const validatedData = jerseyCreateSchema.parse(body);

    // Verify team exists
    const team = await db
      .select({ id: teams.id })
      .from(teams)
      .where(eq(teams.token, token))
      .limit(1);

    if (team.length === 0) {
      return NextResponse.json(
        { message: 'Tim tidak ditemukan' },
        { status: 404 }
      );
    }

    // Check if team already has jerseys (limit to 1 jersey record per team)
    const existingJerseys = await db
      .select()
      .from(teamJerseys)
      .where(eq(teamJerseys.teamId, team[0].id));

    if (existingJerseys.length > 0) {
      return NextResponse.json(
        { message: 'Tim sudah memiliki data jersey. Silakan edit data yang ada.' },
        { status: 409 }
      );
    }

    // Create new jersey record
    const newJersey = await db
      .insert(teamJerseys)
      .values({
        teamId: team[0].id,
        warnaJersey1: validatedData.warnaJersey1 || null,
        warnaJersey2: validatedData.warnaJersey2 || null,
        warnaJersey3: validatedData.warnaJersey3 || null,
      })
      .returning();

    return NextResponse.json({
      jersey: newJersey[0],
      message: 'Data jersey berhasil ditambahkan'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating jersey:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Data tidak valid', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Terjadi kesalahan saat menambahkan data jersey' },
      { status: 500 }
    );
  }
}