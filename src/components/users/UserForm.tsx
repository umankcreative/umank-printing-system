import React, { useState, useEffect } from 'react';
import { User, UserRole, UserStatus } from '../../types/user';
import { branches } from '../../data/mockData';
import Button from '../ui/Buttonx';
import Select from '../ui/Selectx';
import { useUserContext } from '../../context/UserContext';
import { X, Save, UserPlus } from 'lucide-react';

interface UserFormProps {
  user?: User;
  onSubmit: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
  const { branches } = useUserContext();
  const [formData, setFormData] = useState<
    Omit<User, 'id' | 'createdAt' | 'updatedAt'>
  >({
    name: '',
    email: '',
    role: 'kasir',
    status: 'active',
    branch: '',
    avatar: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      const { id, createdAt, updatedAt, ...userData } = user;
      setFormData(userData);
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.branch) {
      newErrors.branch = 'Branch is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'manager toko', label: 'Manager Toko' },
    { value: 'admin gudang', label: 'Admin Gudang' },
    { value: 'kasir', label: 'Kasir' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' },
  ];

  const branchOptions = branches.map((branch) => ({
    value: branch.id,
    label: branch.name,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`bg-gray-50 border ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5`}
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`bg-gray-50 border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5`}
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <Select
          id="role"
          name="role"
          label="Role"
          value={formData.role}
          onChange={(value) => handleSelectChange('role', value)}
          options={roleOptions}
          required
          error={errors.role}
        />

        <Select
          id="status"
          name="status"
          label="Status"
          value={formData.status}
          onChange={(value) => handleSelectChange('status', value)}
          options={statusOptions}
          required
          error={errors.status}
        />

        <Select
          id="branch"
          name="branch"
          label="Branch"
          value={formData.branch}
          onChange={(value) => handleSelectChange('branch', value)}
          options={branchOptions}
          required
          error={errors.branch}
        />

        <div>
          <label
            htmlFor="avatar"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Avatar URL
          </label>
          <input
            type="text"
            id="avatar"
            name="avatar"
            value={formData.avatar || ''}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            placeholder="https://example.com/avatar.jpg"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <Button variant="light" onClick={onCancel} icon={<X size={18} />}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          icon={user ? <Save size={18} /> : <UserPlus size={18} />}
        >
          {user ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
