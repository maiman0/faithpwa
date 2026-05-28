import axios from 'axios';
import { getStoredToken } from '../tokenContext';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || '/api',
  timeout: 30000, // Increased to 30s
});

api.interceptors.request.use(
  async (config) => {
    const token = await getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export default api;
