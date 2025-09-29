import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';
import { teams, teamJerseys } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const deleteColorSchema = z.object({
  colorField: z.enum(['warnaJersey1', 'warnaJersey2', 'warnaJersey3']),
});

interface RouteParams {
  params: Promise<{
    token: string;
    jerseyId: string;
  }>;
}

// DELETE - Delete specific jersey color
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { token, jerseyId } = await params;
    const body = await request.json();

    // Validate input
    const validatedData = deleteColorSchema.parse(body);

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

    // Create update object to set the specific color field to null
    const updateData: any = {
      updatedAt: new Date(),
    };
    updateData[validatedData.colorField] = null;

    // Update jersey to remove the specific color
    const updatedJersey = await db
      .update(teamJerseys)
      .set(updateData)
      .where(eq(teamJerseys.id, jerseyId))
      .returning();

    const colorNames = {
      warnaJersey1: 'Jersey Utama',
      warnaJersey2: 'Jersey Kedua',
      warnaJersey3: 'Jersey Ketiga'
    };

    return NextResponse.json({
      jersey: updatedJersey[0],
      message: `${colorNames[validatedData.colorField]} berhasil dihapus`
    });
  } catch (error) {
    console.error('Error deleting jersey color:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Data tidak valid', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Terjadi kesalahan saat menghapus warna jersey' },
      { status: 500 }
    );
  }
}