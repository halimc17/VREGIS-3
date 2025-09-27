import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';
import { teams, officials } from '@/lib/db/schema';
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

    // Get officials for this team
    const teamOfficials = await db
      .select()
      .from(officials)
      .where(eq(officials.teamId, team[0].id))
      .orderBy(officials.createdAt);

    return NextResponse.json({
      success: true,
      officials: teamOfficials
    });

  } catch (error) {
    console.error('Error fetching officials:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data official' },
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
    const officialData = {
      teamId: team[0].id,
      namaLengkap: formData.get('namaLengkap') as string,
      posisi: formData.get('posisi') as string,
      nomorTelepon: formData.get('nomorTelepon') as string,
      fotoOfficial: null as string | null,
    };

    // Validate required fields
    if (!officialData.namaLengkap || !officialData.posisi || !officialData.nomorTelepon) {
      return NextResponse.json(
        { error: 'Semua field yang bertanda * wajib diisi' },
        { status: 400 }
      );
    }

    // Check if position is already taken for this team
    const existingOfficial = await db
      .select()
      .from(officials)
      .where(
        and(
          eq(officials.teamId, team[0].id),
          eq(officials.posisi, officialData.posisi)
        )
      )
      .limit(1);

    if (existingOfficial.length > 0) {
      return NextResponse.json(
        { error: `Posisi ${officialData.posisi} sudah terisi` },
        { status: 400 }
      );
    }

    // Check team has less than 4 officials
    const currentOfficials = await db
      .select()
      .from(officials)
      .where(eq(officials.teamId, team[0].id));

    if (currentOfficials.length >= 4) {
      return NextResponse.json(
        { error: 'Tim sudah mencapai batas maksimal 4 official' },
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

    // Handle file upload to Cloudinary
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

    // Insert official into database
    const newOfficial = await db
      .insert(officials)
      .values(officialData)
      .returning();

    return NextResponse.json({
      message: 'Official berhasil didaftarkan',
      official: newOfficial[0]
    });

  } catch (error) {
    console.error('Error registering official:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mendaftarkan official' },
      { status: 500 }
    );
  }
}