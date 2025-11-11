import { Router } from 'express';
import { authGuard, requireRoles } from '../middleware/auth.js';
import { changePassword, login, logout, profile, sessions } from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', login);
router.post('/logout', authGuard, logout);
router.get('/me', authGuard, profile);
router.post('/change-password', authGuard, changePassword);
router.get('/sessions', authGuard, requireRoles('oficina', 'programador'), sessions);

export default router;
