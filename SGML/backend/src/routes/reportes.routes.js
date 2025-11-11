import { Router } from 'express';
import { authGuard, requireRoles } from '../middleware/auth.js';
import { backlogCritico, productividadOperario, reportePreventivos, resumenOperativo } from '../controllers/reportes.controller.js';

const router = Router();

router.get('/operativo', authGuard, resumenOperativo);
router.get('/productividad', authGuard, productividadOperario);
router.get('/backlog', authGuard, backlogCritico);
router.get('/preventivos', authGuard, requireRoles('programador', 'preventivo', 'oficina'), reportePreventivos);

export default router;
