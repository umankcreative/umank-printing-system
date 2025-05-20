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
import {
  users as initialUsers,
  branches,
  permissions,
  rolePermissions,
} from '../data/mockData';

interface UserContextType {
  users: User[];
  branches: Branch[];
  permissions: Permission[];
  rolePermissions: RolePermission[];
  addUser: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateUser: (id: string, userData: Partial<User>) => void;
  deleteUser: (id: string) => void;
  updateUserStatus: (id: string, status: UserStatus) => void;
  updateUserRole: (id: string, role: UserRole) => void;
  getUserById: (id: string) => User | undefined;
  getBranchById: (id: string) => Branch | undefined;
  getPermissionsForRole: (role: UserRole) => Permission[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const addUser = (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setUsers([...users, newUser]);
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, ...userData, updatedAt: new Date() } : user
      )
    );
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const updateUserStatus = (id: string, status: UserStatus) => {
    updateUser(id, { status });
  };

  const updateUserRole = (id: string, role: UserRole) => {
    updateUser(id, { role });
  };

  const getUserById = (id: string) => {
    return users.find((user) => user.id === id);
  };

  const getBranchById = (id: string) => {
    return branches.find((branch) => branch.id === id);
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
