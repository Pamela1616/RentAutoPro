import { apiClient } from './client';
import type { ApiResponse, LoginCredentials, RegisterData, User } from '../types';

export const authApi = {
  register: async (data: RegisterData) => {
    const response = await apiClient.post<ApiResponse<{ user: User; token: string }>>('/register', data);
    return response.data;
  },

  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post<ApiResponse<{ user: User; token: string }>>('/login', credentials);
    if (response.data.data) {
      localStorage.setItem('auth_token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post<ApiResponse<null>>('/logout');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    return response.data;
  },

  me: async () => {
    const response = await apiClient.get<ApiResponse<User>>('/me');
    return response.data;
  },
};
