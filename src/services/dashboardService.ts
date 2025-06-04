import api from '../lib/axios';

export interface DashboardStats {
  total_products: number;
  total_ingredients: number;
  total_orders: number;
  total_tasks: number;
  total_customers: number;
  total_revenue: number;
  recent_orders: {
    id: string;
    customer_name: string;
    total_amount: number;
    status: string;
    created_at: string;
  }[];
  top_products: {
    id: string;
    name: string;
    total_sales: number;
    revenue: number;
  }[];
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<{ data: DashboardStats }>('/dashboard/stats');
    return response.data.data;
  }
}; 