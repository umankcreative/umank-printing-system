import React, { useState } from 'react';
// import Layout from '../components/layout/Layout';
import UserList from '../components/users/UserBranchList';
import UserForm from '../components/users/UserForm';
import Modal from '../components/ui/Modalx';
// import Button from '../components/ui/Buttonx';
import UserPermissions from '../components/users/UserPermissions';
import { User } from '../types/user';
import { useUserContext } from '../context/UserContext';
import { AlertTriangle, Edit, Filter, Trash2 } from 'lucide-react';
import { Tab } from '@headlessui/react';
import { Button }  from '../components/ui/button';
import { Card } from '../components/ui/card1';
import { userService } from '../services/userService';
import UserCard from '../components/users/UserCard';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const UsersPage: React.FC = () => {
  const { addUser, updateUser, deleteUser } = useUserContext();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
 const [userData,setUserData] = useState<User[]>([]);

  // Initial default user stub
  const defaultUser = {
    name: '',
    email: '',
    password: '12345678',
    role: 'user',
    is_active: true,
    permissions: [],
    phone: '',
    address: ''
  };

  const handleCreateUser = async (
    userData: Omit<User, 'id' | 'created_at' | 'updated_at' | 'branch' | 'last_active' | 'email_verified_at'>
  ) => {
    try {
      const newUserData = { ...defaultUser, ...userData };
      await addUser(newUserData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create user:', error);
      // Handle error (show toast notification, etc.)
    }
  };

  const handleUpdateUser = async (
    userData: Omit<User, 'id' | 'created_at' | 'updated_at' | 'branch' | 'last_active' | 'email_verified_at'>
  ) => {
    if (selectedUser) {
      try {
        await updateUser(selectedUser.id, userData);
        setIsEditModalOpen(false);
        setSelectedUser(null);
      } catch (error) {
        console.error('Failed to update user:', error);
        // Handle error (show toast notification, etc.)
      }
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedUser) {
      try {
        await deleteUser(selectedUser.id);
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
      } catch (error) {
        console.error('Failed to delete user:', error);
        // Handle error (show toast notification, etc.)
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn btn-outline-primary flex items-center"
        >
          Tambah User
        </Button>
      </div>

      <UserList onEditUser={handleEditUser} onDeleteUser={handleDeleteClick} />
      {/* <UserCard users={userData} /> */}
      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Buat User Baru"
        size="xl"
      >
        <UserForm
          onSubmit={handleCreateUser}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Edit User Modal */}
      {selectedUser && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit User: ${selectedUser.name}`}
          size="xl"
        >
          <Tab.Group>
            <Tab.List className="flex p-1 space-x-1 bg-gray-100 rounded-lg mb-6">
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full py-2.5 text-sm font-medium text-gray-700 rounded-lg transition-all',
                    'focus:outline-none',
                    selected ? 'bg-white shadow' : 'hover:bg-gray-200'
                  )
                }
              >
                User Details
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full py-2.5 text-sm font-medium text-gray-700 rounded-lg transition-all',
                    'focus:outline-none',
                    selected ? 'bg-white shadow' : 'hover:bg-gray-200'
                  )
                }
              >
                Permissions
              </Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <UserForm
                  user={selectedUser}
                  onSubmit={handleUpdateUser}
                  onCancel={() => setIsEditModalOpen(false)}
                />
              </Tab.Panel>
              <Tab.Panel>
                <UserPermissions
                  user={selectedUser}
                  onSave={() => setIsEditModalOpen(false)}
                />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete User"
        size="sm"
      >
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="mt-3 text-center sm:mt-5">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Delete User
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="mt-5 sm:mt-6 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UsersPage;
