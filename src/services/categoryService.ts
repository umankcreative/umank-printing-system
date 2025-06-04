import { Category } from '../types/formTypes';
import api from '../lib/axios';

interface CategoryResponse {
  status: string;
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
  throw new Error('Gagal mengambil kategori');
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