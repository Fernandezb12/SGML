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
  if (!state.backlog.length) {
    container.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align:center; padding:2rem 1.5rem; border: 1px dashed rgba(0,0,0,0.08); background: rgba(0,104,55,0.04);">
        <h3 style="margin: 0; color: var(--color-primary)">Sin backlog crítico</h3>
        <p style="margin: 0.5rem 0 0; color: var(--color-text-muted)">
          No se detectaron órdenes atrasadas. Los casos aparecerán aquí cuando superen la fecha programada.
        </p>
      </div>
    `;
    return;
  }
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
  if (!state.preventivos.length) {
    container.innerHTML = `
      <div style="padding:2rem 1.5rem; border: 1px dashed rgba(0,0,0,0.08); border-radius:1rem; background: rgba(160,0,30,0.04); text-align:center;">
        <h3 style="margin:0; color: var(--color-primary)">Sin preventivos programados</h3>
        <p style="margin:0.5rem 0 0; color: var(--color-text-muted)">
          Programa actividades preventivas desde la oficina de mantenimiento para verlas reflejadas en esta línea de tiempo.
        </p>
      </div>
    `;
    return;
  }
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
