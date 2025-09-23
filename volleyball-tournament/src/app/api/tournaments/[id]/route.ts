import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';
import { tournaments } from '@/lib/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { eq } from 'drizzle-orm';
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user || user.role !== 'administrator') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if tournament exists
    const [existingTournament] = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.id, id))
      .limit(1);

    if (!existingTournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }

    // Delete tournament
    await db.delete(tournaments).where(eq(tournaments.id, id));

    return NextResponse.json({ message: 'Tournament deleted successfully' });
  } catch (error) {
    console.error('Error deleting tournament:', error);
    return NextResponse.json({ error: 'Failed to delete tournament' }, { status: 500 });
  }
}