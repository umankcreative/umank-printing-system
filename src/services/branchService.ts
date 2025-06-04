import api from '../lib/axios';
import { Branch, PaginatedResponse } from '../types/api';

export interface BranchQueryParams {
  page?: number;
  per_page?: number;
  is_active?: boolean;
  search?: string;
}

export const branchService = {
  getBranches: async (params: BranchQueryParams = {}): Promise<PaginatedResponse<Branch>> => {
    const response = await api.get<PaginatedResponse<Branch>>('/branches', {
      params: {
        page: params.page || 1,
        per_page: params.per_page || 15,
        is_active: params.is_active,
        search: params.search,
      },
    });
    return response.data;
  },

  getBranch: async (id: string): Promise<Branch> => {
    const response = await api.get<{ data: Branch }>(`/branches/${id}`);
    return response.data.data;
  },

  createBranch: async (branchData: Partial<Branch>): Promise<Branch> => {
    const response = await api.post<{ data: Branch }>('/branches', branchData);
    return response.data.data;
  },

  updateBranch: async (id: string, branchData: Partial<Branch>): Promise<Branch> => {
    const response = await api.put<{ data: Branch }>(`/branches/${id}`, branchData);
    return response.data.data;
  },

  deleteBranch: async (id: string): Promise<void> => {
    await api.delete(`/branches/${id}`);
  },
}; 