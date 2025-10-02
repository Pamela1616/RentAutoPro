import { apiClient } from './client';
import type { ApiResponse, PaginatedResponse, Rental } from '../types';

export const rentalsApi = {
  getAll: async (params?: Record<string, any>) => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Rental>>>('/rentals', { params });
    return response.data;
  },

  getOne: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Rental>>(`/rentals/${id}`);
    return response.data;
  },

  create: async (data: Partial<Rental>) => {
    const response = await apiClient.post<ApiResponse<Rental>>('/rentals', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Rental>) => {
    const response = await apiClient.put<ApiResponse<Rental>>(`/rentals/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(`/rentals/${id}`);
    return response.data;
  },

  complete: async (id: string, endKm: number) => {
    const response = await apiClient.post<ApiResponse<Rental>>(`/rentals/${id}/complete`, { end_km: endKm });
    return response.data;
  },

  generatePDF: async (id: string) => {
    const response = await apiClient.post(`/rentals/${id}/pdf`, {}, { responseType: 'blob' });
    return response.data;
  },
};
