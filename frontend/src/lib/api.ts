import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (name: string, email: string, password: string) =>
    api.post('/api/auth/register', { name, email, password }),
  
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  
  getMe: () => api.get('/api/auth/me'),
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve();
  },
};

// Build API
export const buildAPI = {
  create: (formData: FormData) =>
    api.post('/api/builds/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  getAll: (page = 1, limit = 10) =>
    api.get(`/api/builds?page=${page}&limit=${limit}`),
  
  getStatus: (buildId: string) =>
    api.get(`/api/builds/${buildId}`),
  
  download: (buildId: string) =>
    api.get(`/api/builds/${buildId}/download`, { responseType: 'blob' }),
  
  delete: (buildId: string) =>
    api.delete(`/api/builds/${buildId}`),
  
  cancel: (buildId: string) =>
    api.post(`/api/builds/${buildId}/cancel`),
};

// User API
export const userAPI = {
  getStats: () => api.get('/api/user/stats'),
};

// Payment API
export const paymentAPI = {
  createCheckout: (priceId: string) =>
    api.post('/api/payments/create-checkout', { priceId }),
  
  createPortal: () =>
    api.post('/api/payments/create-portal'),
};

export default api;
