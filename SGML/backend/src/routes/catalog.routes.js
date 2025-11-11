import { Router } from 'express';
import { authGuard, requireRoles } from '../middleware/auth.js';
import { addCategoria, getCatalog, getCategorias, getPreventivos, getPrioridades, getSedes } from '../controllers/catalog.controller.js';

const router = Router();

router.get('/', authGuard, getCatalog);
router.get('/sedes', authGuard, getSedes);
router.get('/categorias', authGuard, getCategorias);
router.get('/prioridades', authGuard, getPrioridades);
router.get('/preventivos', authGuard, getPreventivos);
router.post('/categorias', authGuard, requireRoles('oficina', 'programador'), addCategoria);

export default router;
