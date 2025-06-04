import React from 'react';
import { useUsers } from '../../hooks/useUsers';
import { useBranches } from '../../hooks/useBranches';
import { Search, Pencil, Trash2, Filter } from 'lucide-react';
import { User, UserRole, UserStatus } from '../../types/user';
import { Card } from '../ui/card1';

interface UserBranchListProps {
  onEditUser?: (user: User) => void;
  onDeleteUser?: (user: User) => void;
}

const UserCard: React.FC<UserBranchListProps> = ({ onEditUser, onDeleteUser }) => {
  const {
    users,
    loading: usersLoading,
    error: usersError,
    pagination: usersPagination,
    filters: usersFilters,
    setFilters: setUsersFilters,
  } = useUsers();

  const {
    branches,
    loading: branchesLoading,
    error: branchesError,
  } = useBranches({ is_active: true });

  const handleSearch = (searchTerm: string) => {
    setUsersFilters({ search: searchTerm });
  };

  const handlePageChange = (page: number) => {
    setUsersFilters({ page });
  };

  const handleStatusFilter = (status: string) => {
    setUsersFilters({ status });
  };

  if (usersLoading || branchesLoading) {
    return <div>Loading data...</div>;
  }

  if (usersError || branchesError) {
    return <div>Error: {usersError || branchesError}</div>;
  }

   const getRoleColor = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return 'bg-indigo-100 text-indigo-800';
    case 'manager toko':
      return 'bg-blue-100 text-blue-800';
    case 'admin gudang':
      return 'bg-purple-100 text-purple-800';
    case 'kasir':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

 const getStatusColor = (status: UserStatus): string => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'inactive':
      return 'bg-gray-100 text-gray-800';
    case 'suspended':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

 const getStatusBadgeColor = (status: UserStatus): string => {
  switch (status) {
    case 'active':
      return 'bg-green-500';
    case 'inactive':
      return 'bg-gray-400';
    case 'suspended':
      return 'bg-red-500';
    default:
      return 'bg-gray-400';
  }
};
  return (
    <div className="grid grid-cols-2 gap-4">
        {users.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
              <Filter size={24} className="text-gray-400" />
            </div>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No users found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
          </div>
        ) : (
          users.map((user) => (
            <Card
              key={user.id}
              className="overflow-hidden transition-all duration-300 hover:shadow-md space-y-4"
            >
              <div className="sm:flex sm:flex-col space-y-2 sm:items-center sm:justify-between">
                <div className="sm:flex sm:space-x-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-full mb-4 sm:mb-0 sm:w-auto">
                    <div className="relative">
                      <img
                        className="w-14 h-14 rounded-full object-cover mx-auto sm:mx-0"
                        src={
                          user.avatar ||
                          'https://images.pexels.com/photos/1378723/pexels-photo-1378723.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
                        }
                        alt={`${user.name} avatar`}
                      />
                      <span
                        className={`absolute bottom-0 right-0 block w-3 h-3 rounded-full ring-2 ring-white ${getStatusBadgeColor(
                          user.status
                        )}`}
                      ></span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="text-center sm:text-left space-y-2">
                    <div className="space-y-0.5">
                      <p className="text-lg font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      <Badge
                        text={user.role}
                        className={getRoleColor(user.role)}
                      />
                      <Badge
                        text={user.status}
                        className={getStatusColor(user.status)}
                      />
                      <Badge
                        text={getBranchName(user.branch)}
                        className="bg-blue-100 text-blue-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 sm:mt-0 flex justify-center sm:justify-end space-x-2">
                  {user.status !== 'active' && (
                    <Button
                      variant="success"
                      size="sm"
                      icon={<UserCheck size={16} />}
                      onClick={() => handleStatusChange(user.id, 'active')}
                    >
                      <span className="sm:hidden md:inline">Activate</span>
                    </Button>
                  )}

                  {user.status !== 'suspended' && (
                    <Button
                      variant="danger"
                      size="sm"
                      icon={<AlertCircle size={16} />}
                      onClick={() => handleStatusChange(user.id, 'suspended')}
                    >
                      <span className="sm:hidden md:inline">Suspend</span>
                    </Button>
                  )}

                  {user.status !== 'inactive' && (
                    <Button
                      variant="light"
                      size="sm"
                      icon={<UserX size={16} />}
                      onClick={() => handleStatusChange(user.id, 'inactive')}
                    >
                      <span className="sm:hidden md:inline">Deactivate</span>
                    </Button>
                  )}

                  <Button
                    variant="info"
                    size="sm"
                    icon={<Edit size={16} />}
                    onClick={() => onEdit(user)}
                  >
                    <span className="sm:hidden md:inline">Edit</span>
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                    icon={<Trash2 size={16} />}
                    onClick={() => onDelete(user)}
                  >
                    <span className="sm:hidden md:inline">Delete</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
  );
};

export default UserCard; 