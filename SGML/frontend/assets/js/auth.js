import { api } from './api.js';

export const auth = {
  async login({ email, password }) {
    const response = await api.login({ email, password });
    localStorage.setItem('sgml_token', response.token);
    localStorage.setItem('sgml_user', JSON.stringify(response.usuario));
    return response.usuario;
  },
  async logout() {
    try {
      await api.logout();
    } catch (error) {
      console.warn('No se pudo cerrar sesión en el servidor, continuando...');
    }
    localStorage.removeItem('sgml_token');
    localStorage.removeItem('sgml_user');
  },
  getUser() {
    const raw = localStorage.getItem('sgml_user');
    return raw ? JSON.parse(raw) : null;
  },
  isAuthenticated() {
    return Boolean(localStorage.getItem('sgml_token'));
  },
  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = './login.html';
    }
  },
};
