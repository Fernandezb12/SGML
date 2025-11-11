import { fsdb } from '../utils/fsdb.js';
import { createSession, deleteSession, getSession, listActiveSessions } from '../utils/sessionStore.js';

const USERS_FILE = 'users.json';

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Debe enviar email y password' });
  }

  const users = (await fsdb.readJson(USERS_FILE)) ?? [];
  const user = users.find((item) => item.email === email && item.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  const token = createSession(user);

  res.json({
    token,
    usuario: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
    },
  });
}

export async function profile(req, res) {
  res.json({ usuario: req.user });
}

export async function logout(req, res) {
  const token = req.header('x-auth-token');
  deleteSession(token);
  res.json({ message: 'Sesión finalizada' });
}

export async function sessions(req, res) {
  res.json({ sesiones: listActiveSessions() });
}

export async function changePassword(req, res) {
  const { actual, nueva } = req.body;
  if (!actual || !nueva) {
    return res.status(400).json({ message: 'Debe enviar la contraseña actual y la nueva' });
  }

  const users = (await fsdb.readJson(USERS_FILE)) ?? [];
  const index = users.findIndex((user) => user.id === req.user.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  if (users[index].password !== actual) {
    return res.status(401).json({ message: 'La contraseña actual no coincide' });
  }

  users[index].password = nueva;
  await fsdb.writeJson(USERS_FILE, users);

  res.json({ message: 'Contraseña actualizada correctamente' });
}
