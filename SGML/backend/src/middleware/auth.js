import { getSession } from '../utils/sessionStore.js';

export function authGuard(req, res, next) {
  const token = req.header('x-auth-token');
  const session = getSession(token);

  if (!session) {
    return res.status(401).json({
      message: 'No autorizado. Proporcione un token válido en la cabecera x-auth-token.',
    });
  }

  req.user = session;
  next();
}

export function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ message: 'No tiene permisos para esta operación' });
    }

    next();
  };
}
