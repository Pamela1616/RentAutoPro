import { apiClient } from './client';
import type { ApiResponse, PaginatedResponse, Maintenance } from '../types';

export const maintenancesApi = {
  getAll: async (params?: Record<string, any>) => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Maintenance>>>('/maintenances', { params });
    return response.data;
  },

  getOne: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Maintenance>>(`/maintenances/${id}`);
    return response.data;
  },

  create: async (data: Partial<Maintenance>) => {
    const response = await apiClient.post<ApiResponse<Maintenance>>('/maintenances', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Maintenance>) => {
    const response = await apiClient.put<ApiResponse<Maintenance>>(`/maintenances/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(`/maintenances/${id}`);
    return response.data;
  },

  getByVehicle: async (vehicleId: string) => {
    const response = await apiClient.get<ApiResponse<Maintenance[]>>(`/vehicles/${vehicleId}/maintenances`);
    return response.data;
  },
};
