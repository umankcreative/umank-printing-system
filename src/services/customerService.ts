import api from '../lib/axios';
import { AxiosError } from 'axios';
import { Customer } from '../types/api';

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

interface SingleResponse<T> {
  data: T;
}

interface CustomerQueryParams {
  page?: number;
  search?: string;
  is_active?: boolean;
}

interface CreateCustomerPayload {
  name: string;
  email: string;
  phone: string;
  company: string;
  contact: string;
  address: string;
  is_active: boolean;
}

const customerService = {
  // Get paginated customers
  getCustomers: async (params: CustomerQueryParams = {}) => {
    try {
      const response = await api.get<PaginatedResponse<Customer>>('/customers', {
        params: {
          page: params.page || 1,
          search: params.search,
          is_active: params.is_active,
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error('API Error Response:', error.response.data);
        throw new Error(error.response.data.message || 'Failed to fetch customers');
      }
      throw error;
    }
  },

  // Get a single customer by ID
  getCustomer: async (id: string) => {
    try {
      const response = await api.get<SingleResponse<Customer>>(`/customers/${id}`);
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error('API Error Response:', error.response.data);
        throw new Error(error.response.data.message || 'Failed to fetch customer');
      }
      throw error;
    }
  },

  // Create a new customer
  createCustomer: async (data: CreateCustomerPayload) => {
    try {
      const response = await api.post<SingleResponse<Customer>>('/customers', data);
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error('API Error Response:', error.response.data);
        throw new Error(error.response.data.message || 'Failed to create customer');
      }
      throw error;
    }
  },

  // Update an existing customer
  updateCustomer: async (id: string, data: Partial<CreateCustomerPayload>) => {
    try {
      const response = await api.put<SingleResponse<Customer>>(`/customers/${id}`, data);
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error('API Error Response:', error.response.data);
        throw new Error(error.response.data.message || 'Failed to update customer');
      }
      throw error;
    }
  },

  // Delete a customer
  deleteCustomer: async (id: string) => {
    try {
      await api.delete(`/customers/${id}`);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error('API Error Response:', error.response.data);
        throw new Error(error.response.data.message || 'Failed to delete customer');
      }
      throw error;
    }
  }
};

export type { CustomerQueryParams, CreateCustomerPayload };
export default customerService; 