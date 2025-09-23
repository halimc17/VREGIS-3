import { NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';
import { tournaments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    // Get only open tournaments for public access
    const openTournaments = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.status, 'open'))
      .orderBy(tournaments.createdAt);

    return NextResponse.json({
      success: true,
      tournaments: openTournaments
    });

  } catch (error) {
    console.error('Get public tournaments error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}