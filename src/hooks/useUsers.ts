import { useState, useEffect } from 'react';
import { User, PaginatedResponse } from '../types/api';
import { userService, UserQueryParams } from '../services/userService';

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: UserQueryParams;
  setFilters: (filters: Partial<UserQueryParams>) => void;
  refetch: () => Promise<void>;
}

export const useUsers = (initialFilters: UserQueryParams = {}): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginatedResponse, setPaginatedResponse] = useState<PaginatedResponse<User> | null>(null);
  const [filters, setFilters] = useState<UserQueryParams>(initialFilters);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getUsers(filters);
      setUsers(response.data);
      setPaginatedResponse(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters.page, filters.per_page, filters.search, filters.status, filters.role]);

  const updateFilters = (newFilters: Partial<UserQueryParams>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      // Reset to page 1 when changing filters other than page
      page: newFilters.page || ('page' in newFilters ? undefined : 1),
    }));
  };

  return {
    users,
    loading,
    error,
    pagination: paginatedResponse ? {
      currentPage: paginatedResponse.meta.current_page,
      totalPages: paginatedResponse.meta.last_page,
      totalItems: paginatedResponse.meta.total,
      hasNext: !!paginatedResponse.links.next,
      hasPrev: !!paginatedResponse.links.prev,
    } : {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      hasNext: false,
      hasPrev: false,
    },
    filters,
    setFilters: updateFilters,
    refetch: fetchUsers,
  };
}; 