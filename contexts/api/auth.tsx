import api from './api';
import { removeToken, storeToken } from '../tokenContext';

export type LoginCredentials = {
  username: string;
  password: string;
};

export type AuthResponse = {
  status: 'success' | 'invalid_password' | 'user_not_found' | string;
  token?: string;
  message?: string;
  staff_id?: number;
  SiteDepartmentProfileID?: string;
};

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth.php', credentials);
    const token = response.data.token;

    if (typeof token === 'string') {
      const expiration = Math.floor(Date.now() / 1000) + 604800;
      await storeToken(token, expiration);
    }

    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || 'Unexpected error';
    return { status: 'error', message };
  }
};

export const logout = async (): Promise<void> => {
  try {
    await removeToken();
  } catch {}
};
