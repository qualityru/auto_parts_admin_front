const BASE = process.env.REACT_APP_ADMIN_API_BASE || 'http://127.0.0.1:8020';

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = localStorage.getItem('adminToken');
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!response.ok) {
    const text = await response.text();
    let message = text;
    try {
      const parsed = JSON.parse(text);
      message = parsed.detail || parsed.message || text;
    } catch (error) {
      // raw response is enough
    }
    const error = new Error(message || `Ошибка ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export const api = {
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request('/auth/me'),
  stats: () => request('/dashboard/stats'),
  orders: (params = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.search) query.set('search', params.search);
    return request(`/orders?${query.toString()}`);
  },
  order: (id) => request(`/orders/${id}`),
  updateOrderStatus: (id, status) => request(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  users: (search = '') => request(`/users${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  user: (id) => request(`/users/${id}`),
  userOrders: (id) => request(`/users/${id}/orders`),
  paymentProviders: () => request('/payments/providers'),
  paymentSettings: () => request('/payments/settings'),
};
