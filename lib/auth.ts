import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';
const SESSION_SECRET = process.env.SESSION_SECRET || 'your-secret-key-change-this';

export interface SessionData {
  username: string;
  expiresAt: number;
}

export async function validateCredentials(username: string, password: string): Promise<boolean> {
  if (username !== ADMIN_USERNAME) {
    return false;
  }

  // If hash is not set, use plain comparison for development
  if (!ADMIN_PASSWORD_HASH) {
    return password === process.env.ADMIN_PASSWORD;
  }

  try {
    return await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
}

export async function createSession(username: string): Promise<string> {
  const sessionData: SessionData = {
    username,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };

  const sessionToken = crypto.randomBytes(32).toString('hex');
  // In production, store this in a database or Redis
  // For now, we'll store it in a cookie
  const encryptedSession = Buffer.from(JSON.stringify(sessionData)).toString('base64');

  const cookieStore = await cookies();
  cookieStore.set('admin-session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60, // 24 hours
  });

  // Also store session data (in production, use a database)
  cookieStore.set('admin-session-data', encryptedSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60,
  });

  return sessionToken;
}

export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const sessionData = cookieStore.get('admin-session-data')?.value;

    if (!sessionData) {
      return null;
    }

    const decoded: SessionData = JSON.parse(Buffer.from(sessionData, 'base64').toString());

    // Check if session has expired
    if (decoded.expiresAt < Date.now()) {
      await clearSession();
      return null;
    }

    return decoded;
  } catch (error) {
    console.error('Session retrieval error:', error);
    return null;
  }
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('admin-session');
  cookieStore.delete('admin-session-data');
}
