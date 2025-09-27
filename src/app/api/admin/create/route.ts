import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcryptjs from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      // Update existing user password and role
      const hashedPassword = await bcryptjs.hash(password, 12);

      await db
        .update(users)
        .set({
          password: hashedPassword,
          role: 'administrator',
          updatedAt: new Date()
        })
        .where(eq(users.email, email));

      return NextResponse.json({
        message: 'Admin user updated successfully',
        user: {
          id: existingUser[0].id,
          name: existingUser[0].name,
          email: existingUser[0].email,
          role: 'administrator'
        }
      });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 12);

    // Create new admin user
    const newUser = await db
      .insert(users)
      .values({
        name: name,
        email: email,
        password: hashedPassword,
        role: 'administrator',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json({
      message: 'Admin user created successfully',
      user: {
        id: newUser[0].id,
        name: newUser[0].name,
        email: newUser[0].email,
        role: newUser[0].role
      }
    });

  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}