import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { db } from './db/connection';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

const secretKey = process.env.NEXTAUTH_SECRET || 'fallback-secret-key';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function login(email: string, password: string) {
  try {
    // Find user by email
    const userResult = await db.select().from(users).where(eq(users.email, email));

    if (userResult.length === 0) {
      return { success: false, error: 'Invalid credentials' };
    }

    const user = userResult[0];

    // Verify password
    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Create session
    const session = await encrypt({
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('session', session, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Authentication failed' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set('session', '', { expires: new Date(0) });
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;

  if (!session) return null;

  try {
    const payload = await decrypt(session);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getSession();

  if (!session?.userId) {
    return null;
  }

  try {
    const userResult = await db.select().from(users).where(eq(users.id, session.userId));

    if (userResult.length === 0) {
      return null;
    }

    const user = userResult[0];
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}