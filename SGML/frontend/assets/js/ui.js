import { state } from './state.js';

function formatDate(value) {
  if (!value) return 'No definido';
  const date = new Date(value);
  return date.toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function renderTicketsTable(table) {
  if (!table) return;
  const tbody = table.querySelector('tbody');
  if (!tbody) return;

  tbody.innerHTML = state.tickets
    .map(
      (ticket) => `
        <tr>
          <td>${ticket.numero}</td>
          <td>${ticket.categoria}</td>
          <td><span class="status-chip" data-status="${ticket.prioridad}">${ticket.prioridad}</span></td>
          <td>${ticket.estado}</td>
          <td>${ticket.solicitante?.dependencia ?? ''}</td>
          <td>${formatDate(ticket.fechaCreacion)}</td>
          <td>${ticket.asignacion?.operarioId ?? 'Por asignar'}</td>
        </tr>
      `
    )
    .join('');
}

export function renderBacklog(container) {
  if (!container) return;
  container.innerHTML = state.backlog
    .map(
      (item) => `
      <div class="card">
        <div class="badge">${item.numero}</div>
        <h3 style="margin: 0.5rem 0">${item.prioridad.toUpperCase()}</h3>
        <p style="margin: 0; color: var(--color-text-muted)">Estado actual: <strong>${item.estado}</strong></p>
        <p style="margin: 0.25rem 0 0">Programado para: ${item.fechaProgramada ? formatDate(item.fechaProgramada) : 'No definido'}</p>
        <p style="margin: 0.25rem 0 0; color: var(--color-secondary); font-weight: 600">Retraso: ${item.diasRetraso} días</p>
      </div>
    `
    )
    .join('');
}

export function renderPreventivos(container) {
  if (!container) return;
  container.innerHTML = state.preventivos
    .map(
      (ticket) => `
        <article class="timeline__item">
          <header style="display:flex; justify-content:space-between; align-items:center; gap:1rem;">
            <div>
              <strong>${ticket.numero}</strong>
              <p style="margin:0.25rem 0 0; color: var(--color-text-muted)">${ticket.descripcion}</p>
            </div>
            <span class="status-chip" data-status="${ticket.prioridad}">${ticket.estado}</span>
          </header>
          <footer style="margin-top: 0.75rem; font-size:0.85rem; color: var(--color-text-muted)">
            Programado: ${ticket.asignacion?.fechaProgramada ? formatDate(ticket.asignacion.fechaProgramada) : 'No programado'}
          </footer>
        </article>
      `
    )
    .join('');
}
