import { apiClient } from './client';
import type { ApiResponse, DashboardKPIs } from '../types';

export const dashboardApi = {
  getKPIs: async () => {
    const response = await apiClient.get<ApiResponse<DashboardKPIs>>('/dashboard/kpis');
    return response.data;
  },
};
