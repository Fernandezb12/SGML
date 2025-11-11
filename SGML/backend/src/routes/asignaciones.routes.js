import { Router } from 'express';
import { authGuard, requireRoles } from '../middleware/auth.js';
import { reprogramar, resumenAsignaciones } from '../controllers/asignaciones.controller.js';

const router = Router();

router.get('/', authGuard, resumenAsignaciones);
router.post('/:id/reprogramar', authGuard, requireRoles('programador', 'oficina'), reprogramar);

export default router;
