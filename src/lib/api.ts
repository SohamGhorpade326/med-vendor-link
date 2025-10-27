import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },
  register: async (name: string, email: string, password: string, role: 'customer' | 'vendor') => {
    const { data } = await api.post('/auth/register', { name, email, password, role });
    return data;
  },
  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },
};

// Products API
export const productsAPI = {
  getAll: async (params?: any) => {
    const { data } = await api.get('/products', { params });
    return data;
  },
  getVendorProducts: async () => {
    const { data } = await api.get('/products/vendor');
    return data;
  },
  create: async (product: any) => {
    const { data } = await api.post('/products', product);
    return data;
  },
  update: async (id: string, product: any) => {
    const { data } = await api.put(`/products/${id}`, product);
    return data;
  },
  delete: async (id: string) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },
};

// Orders API
export const ordersAPI = {
  create: async (order: any) => {
    const { data } = await api.post('/orders', order);
    return data;
  },
  pay: async (orderId: string) => {
    const { data } = await api.post(`/orders/${orderId}/pay`);
    return data;
  },
  getMy: async () => {
    const { data } = await api.get('/orders/my');
    return data;
  },
};

export default api;
