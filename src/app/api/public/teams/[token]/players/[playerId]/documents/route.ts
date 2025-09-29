import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';
import { teams, players, documents } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(
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

    // Verify player exists and belongs to this team
    const player = await db
      .select()
      .from(players)
      .where(
        and(
          eq(players.id, playerId),
          eq(players.teamId, team[0].id)
        )
      )
      .limit(1);

    if (player.length === 0) {
      return NextResponse.json(
        { error: 'Atlet tidak ditemukan' },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    // Extract form data
    const documentType = formData.get('documentType') as string;
    const customDocumentType = formData.get('customDocumentType') as string || null;
    const file = formData.get('file') as File | null;

    // Validate required fields
    if (!documentType) {
      return NextResponse.json(
        { error: 'Tipe dokumen wajib dipilih' },
        { status: 400 }
      );
    }

    if (documentType === 'Lainnya' && !customDocumentType?.trim()) {
      return NextResponse.json(
        { error: 'Nama tipe dokumen wajib diisi untuk pilihan "Lainnya"' },
        { status: 400 }
      );
    }

    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: 'File dokumen wajib dipilih' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf'
    ];

    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Format file tidak didukung. Hanya JPG, PNG, dan PDF yang diperbolehkan' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Ukuran file tidak boleh lebih dari 10MB' },
        { status: 400 }
      );
    }

    // Upload file to Cloudinary
    let uploadedUrl: string;
    try {
      uploadedUrl = await uploadToCloudinary(file, 'player-documents');
    } catch (uploadError) {
      console.error('Document upload error:', uploadError);
      return NextResponse.json(
        { error: 'Gagal mengunggah file dokumen' },
        { status: 500 }
      );
    }

    // Prepare document data
    const documentData = {
      playerId: playerId,
      documentType: documentType as any, // Type assertion for enum
      customDocumentType: documentType === 'Lainnya' ? customDocumentType?.trim() : null,
      fileName: file.name,
      fileUrl: uploadedUrl,
      fileSize: file.size,
      mimeType: file.type,
    };

    // Insert document into database
    const newDocument = await db
      .insert(documents)
      .values(documentData)
      .returning();

    return NextResponse.json({
      message: 'Dokumen berhasil diunggah',
      document: newDocument[0]
    });

  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengunggah dokumen' },
      { status: 500 }
    );
  }
}

export async function GET(
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

    // Verify player exists and belongs to this team
    const player = await db
      .select()
      .from(players)
      .where(
        and(
          eq(players.id, playerId),
          eq(players.teamId, team[0].id)
        )
      )
      .limit(1);

    if (player.length === 0) {
      return NextResponse.json(
        { error: 'Atlet tidak ditemukan' },
        { status: 404 }
      );
    }

    // Get documents for this player
    const playerDocuments = await db
      .select()
      .from(documents)
      .where(eq(documents.playerId, playerId))
      .orderBy(documents.uploadedAt);

    return NextResponse.json({
      success: true,
      documents: playerDocuments
    });

  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data dokumen' },
      { status: 500 }
    );
  }
}