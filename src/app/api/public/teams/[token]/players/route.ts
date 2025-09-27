import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';
import { teams, players } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Verify team exists with this token
    const team = await db
      .select()
      .from(teams)
      .where(eq(teams.token, token))
      .limit(1);

    if (team.length === 0) {
      return NextResponse.json(
        { error: 'Tim tidak ditemukan' },
        { status: 404 }
      );
    }

    // Get players for this team
    const teamPlayers = await db
      .select()
      .from(players)
      .where(eq(players.teamId, team[0].id))
      .orderBy(players.noJersey);

    return NextResponse.json({
      success: true,
      players: teamPlayers
    });

  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data atlet' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Verify team exists with this token
    const team = await db
      .select()
      .from(teams)
      .where(eq(teams.token, token))
      .limit(1);

    if (team.length === 0) {
      return NextResponse.json(
        { error: 'Tim tidak ditemukan' },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    // Extract form data
    const playerData = {
      teamId: team[0].id,
      namaLengkap: formData.get('namaLengkap') as string,
      namaJersey: formData.get('namaJersey') as string || null,
      noJersey: parseInt(formData.get('noJersey') as string),
      position: formData.get('position') as string,
      gender: formData.get('gender') as string,
      tempatLahir: formData.get('tempatLahir') as string,
      tanggalLahir: new Date(formData.get('tanggalLahir') as string),
      tinggi: formData.get('tinggi') ? parseInt(formData.get('tinggi') as string) : null,
      berat: formData.get('berat') ? parseInt(formData.get('berat') as string) : null,
      nik: (formData.get('nik') as string) || null,
      nisn: (formData.get('nisn') as string) || null,
      sekolah: formData.get('sekolah') as string,
      kotaSekolahAsal: formData.get('kotaSekolahAsal') as string,
      fotoAtlet: null as string | null,
    };

    // Validate required fields
    if (!playerData.namaLengkap || !playerData.noJersey || !playerData.position ||
        !playerData.gender || !playerData.tempatLahir || !playerData.tanggalLahir ||
        !playerData.sekolah || !playerData.kotaSekolahAsal) {
      return NextResponse.json(
        { error: 'Semua field yang bertanda * wajib diisi' },
        { status: 400 }
      );
    }

    // Check if jersey number is already taken for this team
    const existingPlayer = await db
      .select()
      .from(players)
      .where(
        and(
          eq(players.teamId, team[0].id),
          eq(players.noJersey, playerData.noJersey)
        )
      )
      .limit(1);

    if (existingPlayer.length > 0) {
      return NextResponse.json(
        { error: `Nomor jersey ${playerData.noJersey} sudah digunakan` },
        { status: 400 }
      );
    }

    // Check if NIK is already used (only if NIK is provided)
    if (playerData.nik && playerData.nik.trim() !== '') {
      const existingNik = await db
        .select()
        .from(players)
        .where(eq(players.nik, playerData.nik))
        .limit(1);

      if (existingNik.length > 0) {
        return NextResponse.json(
          { error: 'NIK sudah terdaftar untuk atlet lain' },
          { status: 400 }
        );
      }

      // Validate NIK format (16 digits)
      if (!/^\d{16}$/.test(playerData.nik)) {
        return NextResponse.json(
          { error: 'NIK harus berupa 16 digit angka' },
          { status: 400 }
        );
      }
    }

    // Check if NISN is already used (only if NISN is provided)
    if (playerData.nisn && playerData.nisn.trim() !== '') {
      const existingNisn = await db
        .select()
        .from(players)
        .where(eq(players.nisn, playerData.nisn))
        .limit(1);

      if (existingNisn.length > 0) {
        return NextResponse.json(
          { error: 'NISN sudah terdaftar untuk atlet lain' },
          { status: 400 }
        );
      }

      // Validate NISN format (10 digits)
      if (!/^\d{10}$/.test(playerData.nisn)) {
        return NextResponse.json(
          { error: 'NISN harus berupa 10 digit angka' },
          { status: 400 }
        );
      }
    }

    // Handle file upload to Cloudinary
    const file = formData.get('fotoAtlet') as File | null;
    if (file && file.size > 0) {
      try {
        const uploadedUrl = await uploadToCloudinary(file, 'player-photos');
        playerData.fotoAtlet = uploadedUrl;
      } catch (uploadError) {
        console.error('Photo upload error:', uploadError);
        return NextResponse.json(
          { error: 'Gagal mengunggah foto atlet' },
          { status: 500 }
        );
      }
    }

    // Insert player into database
    const newPlayer = await db
      .insert(players)
      .values(playerData)
      .returning();

    return NextResponse.json({
      message: 'Atlet berhasil didaftarkan',
      player: newPlayer[0]
    });

  } catch (error) {
    console.error('Error registering player:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mendaftarkan atlet' },
      { status: 500 }
    );
  }
}