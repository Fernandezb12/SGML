import { Router } from 'express';
import { authGuard, requireRoles } from '../middleware/auth.js';
import {
  addChecklistItem,
  addEvidence,
  addInsumo,
  assignTicket,
  changeTicketState,
  createTicket,
  getTicket,
  listTickets,
  updateTicket,
} from '../controllers/tickets.controller.js';

const router = Router();

router.get('/', authGuard, listTickets);
router.get('/:id', authGuard, getTicket);
router.post('/', authGuard, createTicket);
router.put('/:id', authGuard, updateTicket);
router.post('/:id/asignacion', authGuard, requireRoles('programador', 'oficina'), assignTicket);
router.post('/:id/estado', authGuard, changeTicketState);
router.post('/:id/checklist', authGuard, addChecklistItem);
router.post('/:id/evidencias', authGuard, addEvidence);
router.post('/:id/insumos', authGuard, addInsumo);

export default router;
