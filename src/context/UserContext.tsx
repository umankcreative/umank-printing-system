import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import {
  User,
  UserRole,
  UserStatus,
  Branch,
  Permission,
  RolePermission,
} from '../types/user';
import { userService } from '../services/userService';
import { branchService } from '../services/branchService';
import { permissionService } from '../services/permissionService';

interface UserContextType {
  users: User[];
  branches: Branch[];
  permissions: Permission[];
  rolePermissions: RolePermission[];
  addUser: (userData: Omit<User, 'id' | 'created_at' | 'updated_at' | 'branch' | 'last_active' | 'email_verified_at'>) => Promise<void>;
  updateUser: (id: string, userData: Partial<Omit<User, 'id' | 'created_at' | 'updated_at' | 'branch'>>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  updateUserStatus: (id: string, status: UserStatus) => Promise<void>;
  updateUserRole: (id: string, role: UserRole) => Promise<void>;
  getUserById: (id: string) => Promise<User | undefined>;
  getBranchById: (id: string) => Promise<Branch | undefined>;
  getPermissionsForRole: (role: UserRole) => Permission[];
  loading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          usersResponse,
          branchesResponse,
          permissionsResponse,
          rolePermissionsResponse
        ] = await Promise.all([
          userService.getUsers(),
          branchService.getBranches(),
          permissionService.getPermissions(),
          permissionService.getAllRolePermissions()
        ]);

        setUsers(usersResponse.data);
        setBranches(branchesResponse.data);
        setPermissions(permissionsResponse);
        setRolePermissions(rolePermissionsResponse);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addUser = async (userData: Omit<User, 'id' | 'created_at' | 'updated_at' | 'branch' | 'last_active' | 'email_verified_at'>) => {
    try {
      const newUser = await userService.createUser(userData);
      setUsers(prev => [...prev, newUser]);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create user');
    }
  };

  const updateUser = async (id: string, userData: Partial<Omit<User, 'id' | 'created_at' | 'updated_at' | 'branch'>>) => {
    try {
      const updatedUser = await userService.updateUser(id, userData);
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update user');
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await userService.deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const updateUserStatus = async (id: string, status: UserStatus) => {
    await updateUser(id, { status });
  };

  const updateUserRole = async (id: string, role: UserRole) => {
    await updateUser(id, { role });
  };

  const getUserById = async (id: string) => {
    try {
      return await userService.getUser(id);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      return undefined;
    }
  };

  const getBranchById = async (id: string) => {
    try {
      return await branchService.getBranch(id);
    } catch (err) {
      console.error('Failed to fetch branch:', err);
      return undefined;
    }
  };

  const getPermissionsForRole = (role: UserRole) => {
    const rolePermission = rolePermissions.find((rp) => rp.role === role);
    if (!rolePermission) return [];

    return permissions.filter((permission) =>
      rolePermission.permissions.includes(permission.id)
    );
  };

  return (
    <UserContext.Provider
      value={{
        users,
        branches,
        permissions,
        rolePermissions,
        addUser,
        updateUser,
        deleteUser,
        updateUserStatus,
        updateUserRole,
        getUserById,
        getBranchById,
        getPermissionsForRole,
        loading,
        error,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
