import { randomUUID } from 'crypto';

const sessions = new Map();

export function createSession(user) {
  const token = randomUUID();
  sessions.set(token, {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol,
    createdAt: new Date().toISOString(),
  });
  return token;
}

export function getSession(token) {
  if (!token) return null;
  return sessions.get(token) ?? null;
}

export function deleteSession(token) {
  sessions.delete(token);
}

export function listActiveSessions() {
  return Array.from(sessions.entries()).map(([token, value]) => ({ token, ...value }));
}
