import React, { useState } from 'react';
import { User } from '../../types/user';
import Badge from '../ui/badge';
import Card from '../ui/Card';
import Button from '../ui/Buttonx';
import {
  Edit,
  Trash2,
  UserCheck,
  UserX,
  AlertCircle,
  Search,
  Filter,
} from 'lucide-react';
import { useUserContext } from '../../context/UserContext';
import {
  getRoleColor,
  getStatusColor,
  getStatusBadgeColor,
} from '../../data/mockData';

interface UserListProps {
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ onEdit, onDelete }) => {
  const { users, branches, updateUserStatus } = useUserContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [branchFilter, setBranchFilter] = useState<string>('');

  const handleStatusChange = (
    userId: string,
    newStatus: 'active' | 'inactive' | 'suspended'
  ) => {
    updateUserStatus(userId, newStatus);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || user.status === statusFilter;
    const matchesRole = roleFilter === '' || user.role === roleFilter;
    const matchesBranch = branchFilter === '' || user.branch === branchFilter;

    return matchesSearch && matchesStatus && matchesRole && matchesBranch;
  });

  const getBranchName = (branchId: string) => {
    const branch = branches.find((b) => b.id === branchId);
    return branch ? branch.name : 'Unknown Branch';
  };

  return (
    <div className="space-y-6">
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 pr-8"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 pr-8"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="manager toko">Manager Toko</option>
                <option value="admin gudang">Admin Gudang</option>
                <option value="kasir">Kasir</option>
              </select>
            </div>

            <div className="relative">
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 pr-8"
              >
                <option value="">All Branches</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        {filteredUsers.length === 0 ? (
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
          filteredUsers.map((user) => (
            <Card
              key={user.id}
              className="overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <div className="sm:flex sm:items-center sm:justify-between">
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
    </div>
  );
};

export default UserList;
