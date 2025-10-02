import { apiClient } from './client';
import type { ApiResponse, PaginatedResponse, Vehicle } from '../types';

export const vehiclesApi = {
  getAll: async (params?: Record<string, any>) => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Vehicle>>>('/vehicles', { params });
    return response.data;
  },

  getOne: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Vehicle>>(`/vehicles/${id}`);
    return response.data;
  },

  create: async (data: Partial<Vehicle>) => {
    const response = await apiClient.post<ApiResponse<Vehicle>>('/vehicles', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Vehicle>) => {
    const response = await apiClient.put<ApiResponse<Vehicle>>(`/vehicles/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(`/vehicles/${id}`);
    return response.data;
  },

  getHistory: async (id: string) => {
    const response = await apiClient.get<ApiResponse<any>>(`/vehicles/${id}/history`);
    return response.data;
  },
};
