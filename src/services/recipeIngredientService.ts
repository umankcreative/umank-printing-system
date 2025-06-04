import api from '../lib/axios';
import { RecipeIngredient, PaginatedResponse, TaskTemplate } from '../types/api';

export interface RecipeIngredientPayload {
  id: string;
  name: string;
  description: string;
  quantity: string;
  unit: string;
  price_per_unit: string;
  notes: string | null;
  task_templates: TaskTemplate[];
}

export const recipeIngredientService = {
  // Get all recipe ingredients
  getRecipeIngredients: async () => {
    const response = await api.get<PaginatedResponse<RecipeIngredient>>('/recipe-ingredients');
    return response.data;
  },

  // Get recipe ingredients for a specific product
  getProductRecipeIngredients: async (productId: string) => {
    const response = await api.get<PaginatedResponse<RecipeIngredient>>('/recipe-ingredients', {
      params: { product_id: productId }
    });
    return response.data;
  },

  // Create a new recipe ingredient
  createRecipeIngredient: async (data: RecipeIngredientPayload) => {
    const response = await api.post<{ data: RecipeIngredient }>('/recipe-ingredients', { data });
    return response.data.data;
  },

  // Update a recipe ingredient
  updateRecipeIngredient: async (id: string, data: Partial<RecipeIngredientPayload>) => {
    const response = await api.put<{ data: RecipeIngredient }>(`/recipe-ingredients/${id}`, { data });
    return response.data.data;
  },

  // Delete a recipe ingredient
  deleteRecipeIngredient: async (id: string) => {
    await api.delete(`/recipe-ingredients/${id}`);
  },

  // Update a single recipe ingredient's quantity
  updateQuantity: async (id: string, quantity: number) => {
    const response = await api.put<{ data: RecipeIngredient }>(
      `/recipe-ingredients/${id}/quantity`,
      { quantity }
    );
    return response.data.data;
  },

  // Bulk update recipe ingredient quantities
  bulkUpdateQuantities: async (productId: string, ingredients: { id: string; quantity: number }[]) => {
    const response = await api.put<{ data: RecipeIngredient[] }>(
      '/recipe-ingredients/bulk/quantities',
      {
        product_id: productId,
        ingredients: ingredients.map(ing => ({
          id: ing.id,
          quantity: Number(ing.quantity)
        }))
      }
    );
    return response.data.data;
  },
  // Bulk update recipe ingredient quantities
  


  
  // Bulk create/update recipe ingredients for a product
  bulkUpdateProductIngredients: async (productId: string, ingredients: RecipeIngredient[]) => {
    const response = await api.post<{ data: RecipeIngredient[] }>('/recipe-ingredients/bulk', {
      product_id: productId,
      ingredients: ingredients.map(ingredient => ({
        ingredient_id: ingredient.id,
        quantity: parseFloat(ingredient.quantity) || 0,
        notes: ingredient.notes || null
      }))
    });
    return response.data.data;
  }
}; 