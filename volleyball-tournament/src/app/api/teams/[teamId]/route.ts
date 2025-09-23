import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';
import { teams, tournaments } from '@/lib/db/schema';
import { eq, and, ne } from 'drizzle-orm';
import { z } from 'zod';
import { uploadToCloudinary } from '@/lib/cloudinary';

const teamUpdateSchema = z.object({
  name: z.string().min(1, 'Team name is required'),
  gender: z.enum(['putra', 'putri']),
  tournamentId: z.string().uuid('Invalid tournament ID'),
  logo: z.string().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await params;
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const gender = formData.get('gender') as string;
    const tournamentId = formData.get('tournamentId') as string;
    const logoFile = formData.get('logo') as File | null;

    // Validate input
    const result = teamUpdateSchema.safeParse({
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

    // Check if team name + gender combination already exists for other teams
    const duplicateTeams = await db
      .select()
      .from(teams)
      .where(
        and(
          eq(teams.name, teamData.name),
          eq(teams.gender, teamData.gender),
          ne(teams.id, teamId)
        )
      );

    if (duplicateTeams.length > 0) {
      return NextResponse.json(
        { error: `Tim ${teamData.name} dengan gender ${teamData.gender} sudah terdaftar` },
        { status: 400 }
      );
    }

    let logoUrl: string | undefined = existingTeam[0].logo || undefined;

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

    // Update team
    const [updatedTeam] = await db
      .update(teams)
      .set({
        ...teamData,
        logo: logoUrl,
        updatedAt: new Date(),
      })
      .where(eq(teams.id, teamId))
      .returning();

    return NextResponse.json({
      success: true,
      team: updatedTeam,
    });

  } catch (error) {
    console.error('Update team error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await params;

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