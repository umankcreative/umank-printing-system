export type UserRole = 'admin' | 'manager toko' | 'admin gudang' | 'kasir';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  branch: string;
  avatar?: string;
  lastActive?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  isActive: boolean;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

export interface RolePermission {
  role: UserRole;
  permissions: string[]; // Permission IDs
}
