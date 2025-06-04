import api from '../lib/axios';
import { Permission, RolePermission } from '../types/user';

export interface PermissionQueryParams {
  module?: string;
}

export const permissionService = {
  getPermissions: async (params: PermissionQueryParams = {}): Promise<Permission[]> => {
    const response = await api.get<{ data: Permission[] }>('/permissions', {
      params: {
        module: params.module,
      },
    });
    return response.data.data;
  },

  getRolePermissions: async (role: string): Promise<string[]> => {
    const response = await api.get<{ data: string[] }>(`/roles/${role}/permissions`);
    return response.data.data;
  },

  getAllRolePermissions: async (): Promise<RolePermission[]> => {
    const response = await api.get<{ data: RolePermission[] }>('/role-permissions');
    return response.data.data;
  },
}; 