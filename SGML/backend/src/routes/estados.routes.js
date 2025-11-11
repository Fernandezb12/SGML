import { Router } from 'express';
import { authGuard } from '../middleware/auth.js';
import { kpis, listEstados, timeline } from '../controllers/estados.controller.js';

const router = Router();

router.get('/', authGuard, listEstados);
router.get('/kpis', authGuard, kpis);
router.get('/:id/historial', authGuard, timeline);

export default router;
