import { fsdb } from '../utils/fsdb.js';

const TICKETS_FILE = 'tickets.json';

export async function resumenOperativo(req, res) {
  const data = (await fsdb.readJson(TICKETS_FILE)) ?? [];
  const estados = ['nuevo', 'en validacion', 'asignado', 'en ejecucion', 'en espera', 'solucionado', 'cerrado', 'reabierto'];

  const resumen = estados.map((estado) => ({
    estado,
    cantidad: data.filter((ticket) => ticket.estado === estado).length,
  }));

  res.json({ resumen, total: data.length });
}

export async function productividadOperario(req, res) {
  const data = (await fsdb.readJson(TICKETS_FILE)) ?? [];
  const porOperario = data.reduce((acc, ticket) => {
    const operarioId = ticket.asignacion?.operarioId ?? 'sin-asignar';
    const registro = acc[operarioId] ?? {
      operarioId,
      total: 0,
      cerrados: 0,
      enCurso: 0,
      preventivos: 0,
      correctivos: 0,
    };

    registro.total += 1;
    if (ticket.estado === 'cerrado') registro.cerrados += 1;
    if (['asignado', 'en ejecucion', 'en espera'].includes(ticket.estado)) registro.enCurso += 1;
    if (ticket.preventivo) registro.preventivos += 1;
    if (!ticket.preventivo) registro.correctivos += 1;

    acc[operarioId] = registro;
    return acc;
  }, {});

  res.json({ productividad: Object.values(porOperario) });
}

export async function backlogCritico(req, res) {
  const data = (await fsdb.readJson(TICKETS_FILE)) ?? [];
  const hoy = new Date();

  const backlog = data
    .filter((ticket) => ['asignado', 'en ejecucion', 'en espera'].includes(ticket.estado))
    .map((ticket) => {
      const fechaProgramada = ticket.asignacion?.fechaProgramada ? new Date(ticket.asignacion.fechaProgramada) : null;
      const diasRetraso = fechaProgramada ? Math.floor((hoy.getTime() - fechaProgramada.getTime()) / 86400000) : 0;
      return {
        id: ticket.id,
        numero: ticket.numero,
        prioridad: ticket.prioridad,
        estado: ticket.estado,
        fechaProgramada: ticket.asignacion?.fechaProgramada ?? null,
        diasRetraso: Math.max(diasRetraso, 0),
      };
    })
    .sort((a, b) => b.diasRetraso - a.diasRetraso);

  res.json({ backlog });
}

export async function reportePreventivos(req, res) {
  const data = (await fsdb.readJson(TICKETS_FILE)) ?? [];
  const preventivos = data.filter((ticket) => ticket.preventivo);

  const resumen = preventivos.reduce(
    (acc, ticket) => {
      acc.total += 1;
      if (ticket.estado === 'cerrado') acc.cerrados += 1;
      if (ticket.estado === 'en ejecucion') acc.enCurso += 1;
      return acc;
    },
    { total: 0, cerrados: 0, enCurso: 0 }
  );

  res.json({ resumen, preventivos });
}
