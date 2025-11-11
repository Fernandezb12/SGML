const API_BASE_URL = localStorage.getItem('sgml_api_url') || 'http://localhost:3000/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('sgml_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['x-auth-token'] = token;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const message = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(message.message || 'Error en la petición');
    }

    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('SGML API error', error);
    throw error;
  }
}

export const api = {
  setBaseUrl(url) {
    localStorage.setItem('sgml_api_url', url);
  },
  login(credentials) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  logout() {
    return request('/auth/logout', { method: 'POST' });
  },
  me() {
    return request('/auth/me');
  },
  resumenOperativo() {
    return request('/reportes/operativo');
  },
  productividad() {
    return request('/reportes/productividad');
  },
  backlog() {
    return request('/reportes/backlog');
  },
  preventivos() {
    return request('/reportes/preventivos');
  },
  estados() {
    return request('/estados');
  },
  catalogo() {
    return request('/catalogo');
  },
  tickets(params = '') {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return request(`/tickets${query}`);
  },
  crearTicket(payload) {
    return request('/tickets', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  actualizarEstado(id, payload) {
    return request(`/tickets/${id}/estado`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  asignarTicket(id, payload) {
    return request(`/tickets/${id}/asignacion`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
