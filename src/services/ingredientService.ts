import api from '../lib/axios';
import { Ingredient } from '../types/api';
import { AxiosError } from 'axios';

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
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

export interface IngredientQueryParams {
  page?: number;
  search?: string;
}

export interface CreateIngredientPayload {
  name: string;
  description: string;
  unit: string;
  price_per_unit: string;
  stock: number;
  branch_id: string;
}

export const ingredientService = {
  // Get paginated ingredients
  getIngredients: async (params: IngredientQueryParams = {}) => {
    const response = await api.get<PaginatedResponse<Ingredient>>('/ingredients', {
      params: {
        page: params.page || 1,
        search: params.search,
        with_task_templates: true
      },
    });
    return response.data;
  },

  // Get a single ingredient by ID
  getIngredient: async (id: string) => {
    const response = await api.get<{ data: Ingredient }>(`/ingredients/${id}`);
    return response.data.data;
  },

  // Create a new ingredient
  createIngredient: async (data: CreateIngredientPayload) => {
    try {
      // Format the data to match API expectations
      const payload = {
        name: data.name,
        description: data.description || '',
        unit: data.unit,
        price_per_unit: data.price_per_unit.toString(),
        stock: data.stock || 0,
        branch_id: data.branch_id
      };

      const response = await api.post<{ data: Ingredient }>('/ingredients', payload);
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error('API Error Response:', error.response.data);
        throw new Error(error.response.data.message || 'Failed to create ingredient');
      }
      throw error;
    }
  },

  // Update an existing ingredient
  updateIngredient: async (id: string, data: Partial<CreateIngredientPayload>) => {
    try {
      const response = await api.put<{ data: Ingredient }>(`/ingredients/${id}`, data);
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error('API Error Response:', error.response.data);
        throw new Error(error.response.data.message || 'Failed to update ingredient');
      }
      throw error;
    }
  },

  // Delete an ingredient
  deleteIngredient: async (id: string) => {
    try {
      await api.delete(`/ingredients/${id}`);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error('API Error Response:', error.response.data);
        throw new Error(error.response.data.message || 'Failed to delete ingredient');
      }
      throw error;
    }
  }
};

export default ingredientService; 