export type UserRole = 'admin' | 'manager toko' | 'admin gudang' | 'kasir';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  branch_id: string;
  avatar: string | null;
  last_active: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  branch: Branch;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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
