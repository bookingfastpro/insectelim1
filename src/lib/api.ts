const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

let authToken: string | null = localStorage.getItem('auth_token');

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
};

export const getAuthToken = () => authToken;

const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
};

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      const data = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setAuthToken(data.token);
      return data;
    },
    register: async (email: string, password: string) => {
      const data = await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setAuthToken(data.token);
      return data;
    },
    logout: () => {
      setAuthToken(null);
    },
  },
  services: {
    getAll: () => fetchApi('/services'),
    getById: (id: string) => fetchApi(`/services/${id}`),
    create: (service: any) => fetchApi('/services', {
      method: 'POST',
      body: JSON.stringify(service),
    }),
    update: (id: string, service: any) => fetchApi(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(service),
    }),
    delete: (id: string) => fetchApi(`/services/${id}`, {
      method: 'DELETE',
    }),
  },
  blog: {
    getAll: () => fetchApi('/blog'),
    getById: (id: string) => fetchApi(`/blog/${id}`),
    create: (post: any) => fetchApi('/blog', {
      method: 'POST',
      body: JSON.stringify(post),
    }),
    update: (id: string, post: any) => fetchApi(`/blog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(post),
    }),
    delete: (id: string) => fetchApi(`/blog/${id}`, {
      method: 'DELETE',
    }),
  },
  messages: {
    getAll: () => fetchApi('/messages'),
    create: (message: any) => fetchApi('/messages', {
      method: 'POST',
      body: JSON.stringify(message),
    }),
    markAsRead: (id: string) => fetchApi(`/messages/${id}/read`, {
      method: 'PATCH',
    }),
    delete: (id: string) => fetchApi(`/messages/${id}`, {
      method: 'DELETE',
    }),
  },
  settings: {
    getAll: () => fetchApi('/settings'),
    getByKey: (key: string) => fetchApi(`/settings/${key}`),
    update: (key: string, value: any) => fetchApi(`/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    }),
  },
};
