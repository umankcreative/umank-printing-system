import React, { useState } from 'react';
// import Layout from '../components/layout/Layout';
import UserList from '../components/users/UserList';
import UserForm from '../components/users/UserForm';
import Modal from '../components/ui/Modalx';
import Button from '../components/ui/Buttonx';
import UserPermissions from '../components/users/UserPermissions';
import { User } from '../types/user';
import { useUserContext } from '../context/UserContext';
import { UserCog, AlertTriangle } from 'lucide-react';
import { Tab } from '@headlessui/react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const UsersPage: React.FC = () => {
  const { addUser, updateUser, deleteUser } = useUserContext();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleCreateUser = (
    userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    addUser(userData);
    setIsCreateModalOpen(false);
  };

  const handleUpdateUser = (
    userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (selectedUser) {
      updateUser(selectedUser.id, userData);
      setIsEditModalOpen(false);
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

  const confirmDelete = () => {
    if (selectedUser) {
      deleteUser(selectedUser.id);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage user accounts, roles, and permissions for Umank Creative
            staff.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            variant="primary"
            icon={<UserCog size={20} />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add New User
          </Button>
        </div>
      </div>

      <UserList onEdit={handleEditUser} onDelete={handleDeleteClick} />

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New User"
        size="lg"
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
          size="lg"
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
        title="Confirm Delete"
        size="sm"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <AlertTriangle size={24} className="text-red-600" />
          </div>
          <h3 className="mt-3 text-lg font-medium text-gray-900">
            Delete User
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Are you sure you want to delete {selectedUser?.name}? This action
            cannot be undone.
          </p>
          <div className="mt-6 flex justify-center space-x-3">
            <Button variant="light" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UsersPage;
