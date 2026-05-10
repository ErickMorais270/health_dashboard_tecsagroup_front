import type { ApiSuccess, DashboardData } from '@/services/api/types';
import { http } from '@/services/api/http';

export async function fetchDashboard(): Promise<DashboardData> {
  const { data } = await http.get<ApiSuccess<DashboardData>>('/dashboard');
  return data.data;
}
