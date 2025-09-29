import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';
import { players, teams, tournaments } from '@/lib/db/schema';
import { eq, and, or, like, sql } from 'drizzle-orm';
import { calculateAge, calculateAgeNumber } from '@/lib/utils/age';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const teamId = searchParams.get('teamId');
    const tournamentId = searchParams.get('tournamentId');
    const gender = searchParams.get('gender');

    let query = db
      .select({
        id: players.id,
        namaLengkap: players.namaLengkap,
        namaJersey: players.namaJersey,
        noJersey: players.noJersey,
        position: players.position,
        gender: players.gender,
        tanggalLahir: players.tanggalLahir,
        tinggi: players.tinggi,
        berat: players.berat,
        sekolah: players.sekolah,
        kotaSekolahAsal: players.kotaSekolahAsal,
        fotoAtlet: players.fotoAtlet,
        createdAt: players.createdAt,
        team: {
          id: teams.id,
          name: teams.name,
          gender: teams.gender,
        },
        tournament: {
          id: tournaments.id,
          name: tournaments.name,
          category: tournaments.category,
        },
      })
      .from(players)
      .leftJoin(teams, eq(players.teamId, teams.id))
      .leftJoin(tournaments, eq(teams.tournamentId, tournaments.id));

    // Apply filters
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(players.namaLengkap, `%${search}%`),
          like(players.namaJersey, `%${search}%`),
          like(players.sekolah, `%${search}%`)
        )
      );
    }

    if (teamId && teamId !== 'all') {
      conditions.push(eq(teams.id, teamId));
    }

    if (tournamentId && tournamentId !== 'all') {
      conditions.push(eq(tournaments.id, tournamentId));
    }

    if (gender && gender !== 'all') {
      conditions.push(eq(players.gender, gender as 'putra' | 'putri'));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const result = await query.orderBy(players.createdAt);

    // Calculate age for each athlete
    const athletesWithAge = result.map(athlete => ({
      ...athlete,
      age: calculateAge(athlete.tanggalLahir),
      ageNumber: calculateAgeNumber(athlete.tanggalLahir),
    }));

    return NextResponse.json({
      success: true,
      athletes: athletesWithAge,
    });

  } catch (error) {
    console.error('Get athletes error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}