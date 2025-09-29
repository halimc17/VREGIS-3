import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';
import { teams, teamJerseys } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const jerseyUpdateSchema = z.object({
  warnaJersey1: z.string().nullable().optional(),
  warnaJersey2: z.string().nullable().optional(),
  warnaJersey3: z.string().nullable().optional(),
});

interface RouteParams {
  params: Promise<{
    token: string;
    jerseyId: string;
  }>;
}

// PUT - Update team jersey
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { token, jerseyId } = await params;
    const body = await request.json();

    // Validate input
    const validatedData = jerseyUpdateSchema.parse(body);

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

    // Verify jersey exists and belongs to this team
    const existingJersey = await db
      .select()
      .from(teamJerseys)
      .where(
        and(
          eq(teamJerseys.id, jerseyId),
          eq(teamJerseys.teamId, team[0].id)
        )
      )
      .limit(1);

    if (existingJersey.length === 0) {
      return NextResponse.json(
        { message: 'Data jersey tidak ditemukan' },
        { status: 404 }
      );
    }

    // Update jersey
    const updatedJersey = await db
      .update(teamJerseys)
      .set({
        warnaJersey1: validatedData.warnaJersey1 || null,
        warnaJersey2: validatedData.warnaJersey2 || null,
        warnaJersey3: validatedData.warnaJersey3 || null,
        updatedAt: new Date(),
      })
      .where(eq(teamJerseys.id, jerseyId))
      .returning();

    return NextResponse.json({
      jersey: updatedJersey[0],
      message: 'Data jersey berhasil diperbarui'
    });
  } catch (error) {
    console.error('Error updating jersey:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Data tidak valid', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Terjadi kesalahan saat memperbarui data jersey' },
      { status: 500 }
    );
  }
}

// DELETE - Delete team jersey
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { token, jerseyId } = await params;

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

    // Verify jersey exists and belongs to this team
    const existingJersey = await db
      .select()
      .from(teamJerseys)
      .where(
        and(
          eq(teamJerseys.id, jerseyId),
          eq(teamJerseys.teamId, team[0].id)
        )
      )
      .limit(1);

    if (existingJersey.length === 0) {
      return NextResponse.json(
        { message: 'Data jersey tidak ditemukan' },
        { status: 404 }
      );
    }

    // Delete jersey
    await db
      .delete(teamJerseys)
      .where(eq(teamJerseys.id, jerseyId));

    return NextResponse.json({
      message: 'Data jersey berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting jersey:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat menghapus data jersey' },
      { status: 500 }
    );
  }
}