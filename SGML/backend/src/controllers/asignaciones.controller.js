import { fsdb } from '../utils/fsdb.js';

const TICKETS_FILE = 'tickets.json';

export async function resumenAsignaciones(req, res) {
  const data = (await fsdb.readJson(TICKETS_FILE)) ?? [];
  const asignados = data.filter((ticket) => ticket.asignacion?.operarioId);

  const porOperario = asignados.reduce((acc, ticket) => {
    const key = ticket.asignacion.operarioId;
    acc[key] = acc[key] ?? { operarioId: key, tickets: [] };
    acc[key].tickets.push({
      id: ticket.id,
      numero: ticket.numero,
      categoria: ticket.categoria,
      prioridad: ticket.prioridad,
      estado: ticket.estado,
      fechaProgramada: ticket.asignacion.fechaProgramada,
    });
    return acc;
  }, {});

  res.json({ asignaciones: Object.values(porOperario) });
}

export async function reprogramar(req, res) {
  const { fechaProgramada, comentario } = req.body;

  if (!fechaProgramada) {
    return res.status(400).json({ message: 'Debe indicar la nueva fecha programada' });
  }

  const data = (await fsdb.readJson(TICKETS_FILE)) ?? [];
  const index = data.findIndex((item) => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Ticket no encontrado' });
  }

  const ticket = data[index];
  if (!ticket.asignacion) {
    return res.status(400).json({ message: 'El ticket aún no tiene asignación' });
  }

  ticket.asignacion.fechaProgramada = fechaProgramada;
  ticket.historial = [
    ...(ticket.historial ?? []),
    {
      estado: ticket.estado,
      fecha: new Date().toISOString(),
      usuario: req.user?.id ?? 'sistema',
      comentario: comentario ?? 'Reprogramación de atención',
    },
  ];

  await fsdb.writeJson(TICKETS_FILE, data);
  res.json({ ticket });
}
