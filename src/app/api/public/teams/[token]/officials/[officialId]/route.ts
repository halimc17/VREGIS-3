import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';
import { teams, officials } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ token: string; officialId: string }> }
) {
  try {
    const { token, officialId } = await params;

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

    // Check if official exists and belongs to this team
    const existingOfficial = await db
      .select()
      .from(officials)
      .where(
        and(
          eq(officials.id, officialId),
          eq(officials.teamId, team[0].id)
        )
      )
      .limit(1);

    if (existingOfficial.length === 0) {
      return NextResponse.json(
        { error: 'Official tidak ditemukan' },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    // Extract form data
    const officialData = {
      namaLengkap: formData.get('namaLengkap') as string,
      posisi: formData.get('posisi') as string,
      nomorTelepon: formData.get('nomorTelepon') as string,
      fotoOfficial: existingOfficial[0].fotoOfficial, // Keep existing photo by default
    };

    // Validate required fields
    if (!officialData.namaLengkap || !officialData.posisi || !officialData.nomorTelepon) {
      return NextResponse.json(
        { error: 'Semua field yang bertanda * wajib diisi' },
        { status: 400 }
      );
    }

    // Check if position is already taken by another official
    const positionConflict = await db
      .select()
      .from(officials)
      .where(
        and(
          eq(officials.teamId, team[0].id),
          eq(officials.posisi, officialData.posisi)
        )
      );

    // Exclude current official from the conflict check
    const otherOfficialsWithPosition = positionConflict.filter(o => o.id !== officialId);

    if (otherOfficialsWithPosition.length > 0) {
      return NextResponse.json(
        { error: `Posisi ${officialData.posisi} sudah terisi` },
        { status: 400 }
      );
    }

    // Validate position against allowed positions
    const allowedPositions = ['Manager', 'Head Coach', 'Assistant Coach 1', 'Assistant Coach 2'];
    if (!allowedPositions.includes(officialData.posisi)) {
      return NextResponse.json(
        { error: 'Posisi official tidak valid' },
        { status: 400 }
      );
    }

    // Handle file upload to Cloudinary if new photo is provided
    const file = formData.get('fotoOfficial') as File | null;
    if (file && file.size > 0) {
      try {
        const uploadedUrl = await uploadToCloudinary(file, 'official-photos');
        officialData.fotoOfficial = uploadedUrl;
      } catch (uploadError) {
        console.error('Photo upload error:', uploadError);
        return NextResponse.json(
          { error: 'Gagal mengunggah foto official' },
          { status: 500 }
        );
      }
    }

    // Update official in database
    const updatedOfficial = await db
      .update(officials)
      .set({
        ...officialData,
        updatedAt: new Date()
      })
      .where(eq(officials.id, officialId))
      .returning();

    return NextResponse.json({
      message: 'Data official berhasil diperbarui',
      official: updatedOfficial[0]
    });

  } catch (error) {
    console.error('Error updating official:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memperbarui data official' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ token: string; officialId: string }> }
) {
  try {
    const { token, officialId } = await params;

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

    // Check if official exists and belongs to this team
    const existingOfficial = await db
      .select()
      .from(officials)
      .where(
        and(
          eq(officials.id, officialId),
          eq(officials.teamId, team[0].id)
        )
      )
      .limit(1);

    if (existingOfficial.length === 0) {
      return NextResponse.json(
        { error: 'Official tidak ditemukan' },
        { status: 404 }
      );
    }

    // Delete official from database
    await db
      .delete(officials)
      .where(eq(officials.id, officialId));

    return NextResponse.json({
      message: 'Official berhasil dihapus dari tim'
    });

  } catch (error) {
    console.error('Error deleting official:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menghapus official' },
      { status: 500 }
    );
  }
}