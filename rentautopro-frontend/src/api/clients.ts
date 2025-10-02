import { apiClient } from './client';
import type { ApiResponse, PaginatedResponse, Client } from '../types';

export const clientsApi = {
  getAll: async (params?: Record<string, any>) => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Client>>>('/clients', { params });
    return response.data;
  },

  getOne: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Client>>(`/clients/${id}`);
    return response.data;
  },

  create: async (data: Partial<Client>) => {
    const response = await apiClient.post<ApiResponse<Client>>('/clients', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Client>) => {
    const response = await apiClient.put<ApiResponse<Client>>(`/clients/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(`/clients/${id}`);
    return response.data;
  },
};
