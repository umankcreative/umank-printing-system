import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Buttonx';
import { User, Permission } from '../../types/user';
import { useUserContext } from '../../context/UserContext';
import { Save, Lock } from 'lucide-react';

interface UserPermissionsProps {
  user: User;
  onSave: () => void;
}

const UserPermissions: React.FC<UserPermissionsProps> = ({ user, onSave }) => {
  const { permissions, getPermissionsForRole } = useUserContext();
  const [activePermissions, setActivePermissions] = useState<Permission[]>([]);
  const [modules, setModules] = useState<string[]>([]);

  useEffect(() => {
    // Get permissions for this role
    const rolePermissions = getPermissionsForRole(user.role);
    setActivePermissions(rolePermissions);

    // Extract unique modules from permissions
    const uniqueModules = Array.from(new Set(permissions.map((p) => p.module)));
    setModules(uniqueModules);
  }, [user.role, getPermissionsForRole, permissions]);

  const isPermissionActive = (permissionId: string) => {
    return activePermissions.some((p) => p.id === permissionId);
  };

  return (
    <>
    <div className="flex gap-2">
      {modules.map((module) => {
        const modulePermissions = permissions.filter(
          (p) => p.module === module
        );

        return (
          <div key={module} className="overflow-hidden">
            <div className="border-b">
              <h3 className="text-md font-semibold capitalize">
                {module} Module
              </h3>
              <p className="text-xs text-gray-600">
                Permissions for {module} operations
              </p>
            </div>

            <div className="space-y-2">
              {modulePermissions.map((permission) => (
                <div
                  key={permission.id}
                  className="flex items-center justify-between p-1 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      {permission.name
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </p>
                    <p className="text-xs text-gray-600">
                      {permission.description}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ease-in-out ${
                        isPermissionActive(permission.id)
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-300 ease-in-out ${
                          isPermissionActive(permission.id)
                            ? 'translate-x-6'
                            : 'translate-x-0'
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      
      </div>

      <div className="flex justify-end mt-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-4 flex items-start">
          <Lock
            size={20}
            className="text-yellow-500 mr-2 flex-shrink-0 mt-0.5"
          />
          <div>
            <p className="text-sm text-yellow-700">
              <strong>Note:</strong> Permissions are determined by the user's
              role. To change permissions, please assign a different role to the
              user.
            </p>
          </div>
        </div>
      </div>

      </>
  );
};

export default UserPermissions;
