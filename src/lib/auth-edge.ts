import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.NEXTAUTH_SECRET || 'fallback-secret-key';
const key = new TextEncoder().encode(secretKey);

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
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