import { useState, useEffect } from 'react';
import { Branch, PaginatedResponse } from '../types/api';
import { branchService, BranchQueryParams } from '../services/branchService';

interface UseBranchesReturn {
  branches: Branch[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: BranchQueryParams;
  setFilters: (filters: Partial<BranchQueryParams>) => void;
  refetch: () => Promise<void>;
}

export const useBranches = (initialFilters: BranchQueryParams = {}): UseBranchesReturn => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginatedResponse, setPaginatedResponse] = useState<PaginatedResponse<Branch> | null>(null);
  const [filters, setFilters] = useState<BranchQueryParams>(initialFilters);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await branchService.getBranches(filters);
      setBranches(response.data);
      setPaginatedResponse(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch branches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, [filters.page, filters.per_page, filters.search, filters.is_active]);

  const updateFilters = (newFilters: Partial<BranchQueryParams>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      // Reset to page 1 when changing filters other than page
      page: newFilters.page || ('page' in newFilters ? undefined : 1),
    }));
  };

  return {
    branches,
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
    refetch: fetchBranches,
  };
}; 