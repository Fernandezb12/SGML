import { fsdb } from '../utils/fsdb.js';

const TICKETS_FILE = 'tickets.json';

const ESTADOS = [
  { id: 'nuevo', nombre: 'Nuevo', descripcion: 'Ticket recién creado' },
  { id: 'en validacion', nombre: 'En validación', descripcion: 'En revisión por Oficina de Mantenimiento' },
  { id: 'asignado', nombre: 'Asignado', descripcion: 'Asignado a operario o cuadrilla' },
  { id: 'en ejecucion', nombre: 'En ejecución', descripcion: 'Operario en campo ejecutando actividades' },
  { id: 'en espera', nombre: 'En espera', descripcion: 'Esperando repuestos, acceso o autorización' },
  { id: 'solucionado', nombre: 'Solucionado', descripcion: 'Operario marcó el ticket como resuelto' },
  { id: 'cerrado', nombre: 'Cerrado', descripcion: 'Dependencia confirma solución' },
  { id: 'reabierto', nombre: 'Reabierto', descripcion: 'Dependencia solicita atención adicional' }
];

export async function listEstados(req, res) {
  res.json({ estados: ESTADOS });
}

export async function timeline(req, res) {
  const data = (await fsdb.readJson(TICKETS_FILE)) ?? [];
  const ticket = data.find((item) => item.id === req.params.id);

  if (!ticket) {
    return res.status(404).json({ message: 'Ticket no encontrado' });
  }

  res.json({ historial: ticket.historial ?? [] });
}

export async function kpis(req, res) {
  const data = (await fsdb.readJson(TICKETS_FILE)) ?? [];
  const total = data.length;

  const porEstado = data.reduce((acc, ticket) => {
    acc[ticket.estado] = (acc[ticket.estado] ?? 0) + 1;
    return acc;
  }, {});

  const tiempos = data
    .filter((ticket) => ticket.tiempos?.fechaInicio && ticket.tiempos?.fechaFin)
    .map((ticket) => ({
      id: ticket.id,
      horas: (new Date(ticket.tiempos.fechaFin).getTime() - new Date(ticket.tiempos.fechaInicio).getTime()) / 36e5,
    }));

  const promedioHoras = tiempos.length
    ? tiempos.reduce((sum, item) => sum + item.horas, 0) / tiempos.length
    : 0;

  res.json({
    total,
    porEstado,
    tiempos,
    promedioHoras,
  });
}
