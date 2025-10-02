import { apiClient } from './client';
import type { ApiResponse } from '../types';

export const reportsApi = {
  getIncome: async (params?: { start_date?: string; end_date?: string; year?: number; month?: number }) => {
    const response = await apiClient.get<ApiResponse<any>>('/reports/income', { params });
    return response.data;
  },

  getMaintenanceCosts: async (params?: { start_date?: string; end_date?: string; year?: number; month?: number }) => {
    const response = await apiClient.get<ApiResponse<any>>('/reports/maintenance-costs', { params });
    return response.data;
  },

  getFleetAvailability: async () => {
    const response = await apiClient.get<ApiResponse<any>>('/reports/fleet-availability');
    return response.data;
  },
};
