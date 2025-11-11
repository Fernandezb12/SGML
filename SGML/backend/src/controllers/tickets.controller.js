import { randomUUID } from 'crypto';
import { fsdb } from '../utils/fsdb.js';

const TICKETS_FILE = 'tickets.json';

const ALLOWED_TRANSITIONS = {
  nuevo: ['en validacion', 'asignado'],
  'en validacion': ['asignado', 'en espera'],
  asignado: ['en ejecucion', 'en espera'],
  'en ejecucion': ['en espera', 'solucionado'],
  'en espera': ['asignado', 'en ejecucion'],
  solucionado: ['cerrado', 'reabierto'],
  cerrado: ['reabierto'],
  reabierto: ['asignado', 'en validacion'],
};

function generateTicketNumber() {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const random = Math.floor(Math.random() * 999).toString().padStart(3, '0');
  return `TCK-${stamp}-${random}`;
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

export async function listTickets(req, res) {
  const data = (await fsdb.readJson(TICKETS_FILE)) ?? [];
  const { estado, prioridad, tipo, preventivo, asignadoA, desde, hasta } = req.query;

  let filtered = data;

  if (estado) {
    filtered = filtered.filter((ticket) => ticket.estado === estado);
  }

  if (prioridad) {
    filtered = filtered.filter((ticket) => ticket.prioridad === prioridad);
  }

  if (tipo) {
    filtered = filtered.filter((ticket) => ticket.tipo === tipo);
  }

  if (preventivo === 'true') {
    filtered = filtered.filter((ticket) => ticket.preventivo === true);
  }

  if (preventivo === 'false') {
    filtered = filtered.filter((ticket) => ticket.preventivo === false);
  }

  if (asignadoA) {
    filtered = filtered.filter((ticket) => ticket.asignacion?.operarioId === asignadoA);
  }

  if (desde || hasta) {
    filtered = filtered.filter((ticket) => {
      const fecha = new Date(ticket.fechaCreacion).getTime();
      const desdeTime = desde ? new Date(desde).getTime() : null;
      const hastaTime = hasta ? new Date(hasta).getTime() : null;
      if (Number.isFinite(desdeTime) && fecha < desdeTime) return false;
      if (Number.isFinite(hastaTime) && fecha > hastaTime) return false;
      return true;
    });
  }

  res.json({ tickets: filtered });
}

export async function getTicket(req, res) {
  const data = (await fsdb.readJson(TICKETS_FILE)) ?? [];
  const ticket = data.find((item) => item.id === req.params.id);

  if (!ticket) {
    return res.status(404).json({ message: 'Ticket no encontrado' });
  }

  res.json({ ticket });
}

export async function createTicket(req, res) {
  const {
    tipo = 'correctivo',
    categoria,
    prioridad = 'media',
    descripcion,
    solicitante,
    ubicacion,
    evidencias = [],
    preventivo = false,
  } = req.body;

  if (!categoria || !descripcion || !solicitante?.nombre || !ubicacion?.sede) {
    return res.status(400).json({
      message: 'La categoría, descripción, solicitante.nombre y ubicacion.sede son obligatorios',
    });
  }

  const now = new Date().toISOString();
  const numero = generateTicketNumber();

  const ticket = {
    id: numero,
    numero,
    tipo,
    categoria,
    prioridad,
    estado: 'nuevo',
    descripcion,
    solicitante: {
      id: solicitante.id ?? randomUUID(),
      nombre: solicitante.nombre,
      dependencia: solicitante.dependencia ?? '',
      contacto: solicitante.contacto ?? '',
    },
    ubicacion: {
      sede: ubicacion.sede,
      bloque: ubicacion.bloque ?? '',
      espacio: ubicacion.espacio ?? '',
    },
    fechaCreacion: now,
    historial: [
      {
        estado: 'nuevo',
        fecha: now,
        usuario: req.user?.id ?? 'sistema',
        comentario: 'Ticket creado en el sistema',
      },
    ],
    evidencias: ensureArray(evidencias),
    checklist: [],
    insumos: [],
    preventivo,
    tiempos: {
      fechaInicio: null,
      fechaFin: null,
    },
    asignacion: null,
  };

  const data = (await fsdb.readJson(TICKETS_FILE)) ?? [];
  data.push(ticket);
  await fsdb.writeJson(TICKETS_FILE, data);

  res.status(201).json({ ticket });
}

function validateTransition(actual, nuevo) {
  if (actual === nuevo) return true;
  const opciones = ALLOWED_TRANSITIONS[actual] ?? [];
  return opciones.includes(nuevo);
}

function appendHistory(ticket, estado, usuario, comentario) {
  const registro = {
    estado,
    fecha: new Date().toISOString(),
    usuario,
    comentario,
  };
  ticket.historial = [...ensureArray(ticket.historial), registro];
}

export async function updateTicket(req, res) {
  const data = (await fsdb.readJson(TICKETS_FILE)) ?? [];
  const index = data.findIndex((item) => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Ticket no encontrado' });
  }

  const updated = {
    ...data[index],
    ...req.body,
  };

  data[index] = updated;
  await fsdb.writeJson(TICKETS_FILE, data);

  res.json({ ticket: updated });
}

export async function changeTicketState(req, res) {
  const { estado, comentario } = req.body;
  if (!estado) {
    return res.status(400).json({ message: 'Debe indicar el nuevo estado' });
  }

  const data = (await fsdb.readJson(TICKETS_FILE)) ?? [];
  const index = data.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Ticket no encontrado' });
  }

  const ticket = data[index];

  if (!validateTransition(ticket.estado, estado)) {
    return res.status(409).json({
      message: `Transición inválida de ${ticket.estado} a ${estado}`,
    });
  }

  if (estado === 'cerrado') {
    const checklistCompletado = ensureArray(ticket.checklist).every((item) => item.completado === true);
    const tieneEvidencias = ensureArray(ticket.evidencias).length > 0;

    if (!checklistCompletado || !tieneEvidencias) {
      return res.status(400).json({
        message: 'No se puede cerrar el ticket sin checklist completado y evidencias adjuntas',
      });
    }

    ticket.tiempos = {
      ...ticket.tiempos,
      fechaFin: new Date().toISOString(),
    };
  }

  if (estado === 'en ejecucion' && !ticket.tiempos?.fechaInicio) {
    ticket.tiempos = {
      ...ticket.tiempos,
      fechaInicio: new Date().toISOString(),
    };
  }

  ticket.estado = estado;
  appendHistory(ticket, estado, req.user?.id ?? 'sistema', comentario ?? '');

  data[index] = ticket;
  await fsdb.writeJson(TICKETS_FILE, data);

  res.json({ ticket });
}

export async function assignTicket(req, res) {
  const { operarioId, programadorId, fechaProgramada } = req.body;

  if (!operarioId) {
    return res.status(400).json({ message: 'Debe indicar el operario asignado' });
  }

  const data = (await fsdb.readJson(TICKETS_FILE)) ?? [];
  const index = data.findIndex((item) => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Ticket no encontrado' });
  }

  const ticket = data[index];
  ticket.asignacion = {
    operarioId,
    programadorId: programadorId ?? req.user?.id ?? 'sistema',
    fechaProgramada: fechaProgramada ?? new Date().toISOString(),
  };
  ticket.estado = 'asignado';
  appendHistory(ticket, 'asignado', req.user?.id ?? 'sistema', 'Ticket asignado a operario');

  data[index] = ticket;
  await fsdb.writeJson(TICKETS_FILE, data);

  res.json({ ticket });
}

export async function addChecklistItem(req, res) {
  const { titulo, completado = false, observacion = '' } = req.body;
  if (!titulo) {
    return res.status(400).json({ message: 'El título del paso de checklist es obligatorio' });
  }

  const data = (await fsdb.readJson(TICKETS_FILE)) ?? [];
  const index = data.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Ticket no encontrado' });
  }

  const ticket = data[index];
  const item = {
    id: randomUUID(),
    titulo,
    completado,
    observacion,
    actualizadoPor: req.user?.id ?? 'sistema',
    actualizadoEn: new Date().toISOString(),
  };

  ticket.checklist = [...ensureArray(ticket.checklist), item];
  appendHistory(ticket, ticket.estado, req.user?.id ?? 'sistema', `Checklist actualizado: ${titulo}`);

  data[index] = ticket;
  await fsdb.writeJson(TICKETS_FILE, data);

  res.status(201).json({ checklist: ticket.checklist });
}

export async function addEvidence(req, res) {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ message: 'Debe enviar la URL o referencia de la evidencia' });
  }

  const data = (await fsdb.readJson(TICKETS_FILE)) ?? [];
  const index = data.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Ticket no encontrado' });
  }

  const ticket = data[index];
  ticket.evidencias = [...ensureArray(ticket.evidencias), url];
  appendHistory(ticket, ticket.estado, req.user?.id ?? 'sistema', 'Se adjunta nueva evidencia');

  data[index] = ticket;
  await fsdb.writeJson(TICKETS_FILE, data);

  res.status(201).json({ evidencias: ticket.evidencias });
}

export async function addInsumo(req, res) {
  const { nombre, cantidad, costoUnitario } = req.body;
  if (!nombre || !cantidad) {
    return res.status(400).json({ message: 'Nombre y cantidad del insumo son obligatorios' });
  }

  const data = (await fsdb.readJson(TICKETS_FILE)) ?? [];
  const index = data.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Ticket no encontrado' });
  }

  const ticket = data[index];
  const insumo = {
    id: randomUUID(),
    nombre,
    cantidad,
    costoUnitario: costoUnitario ?? 0,
  };

  ticket.insumos = [...ensureArray(ticket.insumos), insumo];
  appendHistory(ticket, ticket.estado, req.user?.id ?? 'sistema', `Insumo registrado: ${nombre}`);

  data[index] = ticket;
  await fsdb.writeJson(TICKETS_FILE, data);

  res.status(201).json({ insumos: ticket.insumos });
}
