import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';
import { users, type NewUser } from '@/lib/db/schema';
import { getCurrentUser, hashPassword } from '@/lib/auth';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

// Validation schema for user creation/update
const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  role: z.enum(['user', 'administrator']).default('user'),
});

// GET /api/users - Get all users
export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'administrator') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allUsers = await db
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
      .orderBy(desc(users.createdAt));

    return NextResponse.json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'administrator') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = userSchema.parse(body);

    // Check if username or email already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, validatedData.username))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }

    const existingEmail = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    if (existingEmail.length > 0) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password!);

    // Create new user
    const newUser: NewUser = {
      name: validatedData.name,
      username: validatedData.username,
      email: validatedData.email,
      password: hashedPassword,
      role: validatedData.role,
    };

    const [createdUser] = await db.insert(users).values(newUser).returning({
      id: users.id,
      name: users.name,
      username: users.username,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    });

    return NextResponse.json(createdUser, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}