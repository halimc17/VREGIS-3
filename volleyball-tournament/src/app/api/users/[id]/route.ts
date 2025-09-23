import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';
import { users } from '@/lib/db/schema';
import { getCurrentUser, hashPassword } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

// Validation schema for user update
const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  username: z.string().min(3, 'Username must be at least 3 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  role: z.enum(['user', 'administrator']).optional(),
});

// GET /api/users/[id] - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'administrator') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

// PUT /api/users/[id] - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'administrator') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check for username conflicts (if username is being updated)
    if (validatedData.username && validatedData.username !== existingUser.username) {
      const [conflictUser] = await db
        .select()
        .from(users)
        .where(eq(users.username, validatedData.username))
        .limit(1);

      if (conflictUser) {
        return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
      }
    }

    // Check for email conflicts (if email is being updated)
    if (validatedData.email && validatedData.email !== existingUser.email) {
      const [conflictUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, validatedData.email))
        .limit(1);

      if (conflictUser) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
      }
    }

    // Prepare update data
    const updateData: any = {
      ...validatedData,
      updatedAt: new Date(),
    };

    // Hash password if provided
    if (validatedData.password) {
      updateData.password = await hashPassword(validatedData.password);
    } else {
      delete updateData.password;
    }

    // Update user
    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        username: users.username,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'administrator') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Prevent self-deletion
    if (currentUser.id === id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete user
    await db.delete(users).where(eq(users.id, id));

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}