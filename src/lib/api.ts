import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// ✅ Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Auth API
export const authAPI = {
  login: async (email: string, password: string) =>
    (await api.post("/auth/login", { email, password })).data,

  me: async () => (await api.get("/auth/me")).data,
};

// ✅ Products API
export const productsAPI = {
  getVendorProducts: async () =>
    (await api.get("/products/vendor")).data,
  getAll: async (params?: any) => (await api.get('/products', { params })).data,
  create: async (data: any) =>
    (await api.post("/products", data)).data,
  update: async (id: string, data: any) =>
    (await api.put(`/products/${id}`, data)).data,
  delete: async (id: string) =>
    (await api.delete(`/products/${id}`)).data,
};
// ✅ Orders API (temporary mock implementation)
// src/lib/api.ts  — orders section
// --- Orders API ---
export const ordersAPI = {
  getMy: async () => (await api.get('/orders/me')).data,
  create: async (payload: any) => (await api.post('/orders', payload)).data,
  // (optional helpers)
  getMyOrders: async () => (await api.get('/orders/me')).data,
};


export default api;
