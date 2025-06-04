import api from '../lib/axios';
import { PaginatedResponse, User } from '../types/api';

export interface UserQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  role?: string;
}

export const userService = {
  getUsers: async (params: UserQueryParams = {}): Promise<PaginatedResponse<User>> => {
    const response = await api.get<PaginatedResponse<User>>('/users', {
      params: {
        page: params.page || 1,
        per_page: params.per_page || 15,
        search: params.search,
        status: params.status,
        role: params.role,
      },
    });
    return response.data;
  },

  getUser: async (id: string): Promise<User> => {
    const response = await api.get<{ data: User }>(`/users/${id}`);
    return response.data.data;
  },

  createUser: async (userData: Partial<User>): Promise<User> => {
    const response = await api.post<{ data: User }>('/users', userData);
    return response.data.data;
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await api.put<{ data: User }>(`/users/${id}`, userData);
    return response.data.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
}; 