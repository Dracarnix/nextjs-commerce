import { cookies } from 'next/headers';

const SESSION_KEY = 'admin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function getSession() {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get(SESSION_KEY)?.value;

  if (!sessionData) {
    return null;
  }

  try {
    const session = JSON.parse(sessionData);
    
    // Check if session has expired
    if (session.expiresAt && Date.now() > session.expiresAt) {
      // Session expired, delete it
      cookieStore.delete(SESSION_KEY);
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function createSession() {
  const cookieStore = await cookies();
  
  const session = {
    authenticated: true,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION,
  };

  cookieStore.set(SESSION_KEY, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
  });

  return session;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_KEY);
}

export async function requireAuth() {
  const session = await getSession();
  
  if (!session) {
    throw new Error('Unauthorized');
  }

  return session;
}
