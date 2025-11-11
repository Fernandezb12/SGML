export const state = {
  tickets: [],
  catalogo: null,
  backlog: [],
  preventivos: [],
  setTickets(tickets) {
    this.tickets = tickets;
  },
  setCatalogo(catalogo) {
    this.catalogo = catalogo;
  },
  setBacklog(backlog) {
    this.backlog = backlog;
  },
  setPreventivos(preventivos) {
    this.preventivos = preventivos;
  },
};
