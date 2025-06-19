import api  from '../lib/axios';
import { Category } from '../types/api';

interface CategoryResponse {
  status: string;
  slug: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  data: Category[];
}

// Cache for categories
let categoriesCache: Category[] | null = null;

export const getCategories = async (): Promise<Category[]> => {
  // Return cached categories if available
  if (categoriesCache) {
    return categoriesCache;
  }

  const response = await api.get<CategoryResponse>('/categories');
  if (response.data.status === 'success') {
    categoriesCache = response.data.data;
    return categoriesCache;
  }
  throw new Error(`Failed to fetch categories: ${response.data.status}`);
};

export const getCategoriesByType = async (type: 'product' | 'form'): Promise<Category[]> => {
  const categories = await getCategories();
  return categories.filter(category => category.type === type);
};

export const getCategory = async (id: string): Promise<Category | null> => {
  const categories = await getCategories();
  return categories.find(category => category.id === id) || null;
};

export const getCategoryName = async (id?: string): Promise<string> => {
  if (!id) return 'No Category';
  
  try {
    const category = await getCategory(id);
    return category?.name || 'Kategori Tidak Ditemukan';
  } catch (error) {
    console.error('Error fetching category name:', error);
    return 'Kategori Tidak Ditemukan';
  }
};

export const getCategoryTemplates = async (id: string) => {
  const response = await api.get(`/categories/${id}/templates`);
  return response.data;
};

// Method to clear cache if needed (e.g., after updates)
export const clearCache = () => {
  categoriesCache = null;
};

/**
 * Add a new category
 * @param categoryData The category data to create
 * @returns Promise<Category>
 */
export const addCategory = async (categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> => {
  try {
    const response = await api.post<Category>('/categories', categoryData);
    return response.data;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

/**
 * Update an existing category
 * @param id The category ID to update
 * @param categoryData The updated category data
 * @returns Promise<Category>
 */
export const updateCategory = async (id: string, categoryData: Partial<Category>): Promise<Category> => {
  try {
    const response = await api.put<Category>(`/categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

/**
 * Delete a category
 * @param id The category ID to delete
 * @returns Promise<void>
 */
export const deleteCategory = async (id: string): Promise<void> => {
  try {
    await api.delete(`/categories/${id}`);
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};