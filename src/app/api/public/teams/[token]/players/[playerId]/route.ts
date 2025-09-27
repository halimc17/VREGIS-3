import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';
import { teams, players } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ token: string; playerId: string }> }
) {
  try {
    const { token, playerId } = await params;

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

    // Check if player exists and belongs to this team
    const existingPlayer = await db
      .select()
      .from(players)
      .where(
        and(
          eq(players.id, playerId),
          eq(players.teamId, team[0].id)
        )
      )
      .limit(1);

    if (existingPlayer.length === 0) {
      return NextResponse.json(
        { error: 'Atlet tidak ditemukan' },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    // Extract form data
    const playerData = {
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
      fotoAtlet: existingPlayer[0].fotoAtlet, // Keep existing photo by default
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

    // Check if jersey number is already taken by another player
    const jerseyConflict = await db
      .select()
      .from(players)
      .where(
        and(
          eq(players.teamId, team[0].id),
          eq(players.noJersey, playerData.noJersey)
        )
      );

    // Exclude current player from the conflict check
    const otherPlayersWithJersey = jerseyConflict.filter(p => p.id !== playerId);

    if (otherPlayersWithJersey.length > 0) {
      return NextResponse.json(
        { error: `Nomor jersey ${playerData.noJersey} sudah digunakan` },
        { status: 400 }
      );
    }

    // Check if NIK is already used by another player (only if NIK is provided)
    if (playerData.nik && playerData.nik.trim() !== '') {
      const nikConflict = await db
        .select()
        .from(players)
        .where(eq(players.nik, playerData.nik));

      // Exclude current player from the conflict check
      const otherPlayersWithNik = nikConflict.filter(p => p.id !== playerId);

      if (otherPlayersWithNik.length > 0) {
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

    // Check if NISN is already used by another player (only if NISN is provided)
    if (playerData.nisn && playerData.nisn.trim() !== '') {
      const nisnConflict = await db
        .select()
        .from(players)
        .where(eq(players.nisn, playerData.nisn));

      // Exclude current player from the conflict check
      const otherPlayersWithNisn = nisnConflict.filter(p => p.id !== playerId);

      if (otherPlayersWithNisn.length > 0) {
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

    // Handle file upload to Cloudinary if new photo is provided
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

    // Update player in database
    const updatedPlayer = await db
      .update(players)
      .set({
        ...playerData,
        updatedAt: new Date()
      })
      .where(eq(players.id, playerId))
      .returning();

    return NextResponse.json({
      message: 'Data atlet berhasil diperbarui',
      player: updatedPlayer[0]
    });

  } catch (error) {
    console.error('Error updating player:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memperbarui data atlet' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ token: string; playerId: string }> }
) {
  try {
    const { token, playerId } = await params;

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

    // Check if player exists and belongs to this team
    const existingPlayer = await db
      .select()
      .from(players)
      .where(
        and(
          eq(players.id, playerId),
          eq(players.teamId, team[0].id)
        )
      )
      .limit(1);

    if (existingPlayer.length === 0) {
      return NextResponse.json(
        { error: 'Atlet tidak ditemukan' },
        { status: 404 }
      );
    }

    // Delete player from database
    await db
      .delete(players)
      .where(eq(players.id, playerId));

    return NextResponse.json({
      message: 'Atlet berhasil dihapus dari tim'
    });

  } catch (error) {
    console.error('Error deleting player:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menghapus atlet' },
      { status: 500 }
    );
  }
}