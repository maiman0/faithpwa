import axios from 'axios';
import { getToken } from '../tokenContext';

const api = axios.create({
  baseURL: 'https://endpoint.daythree.ai/faithMobile/routes',
  timeout: 5000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
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
