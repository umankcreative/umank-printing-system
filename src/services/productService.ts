import api from '../lib/axios';
import { Product, PaginatedResponse } from '../types/api';
import { AxiosError } from 'axios';
import { recipeIngredientService } from './recipeIngredientService';

export interface ProductQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  category?: string;
  is_active?: boolean;
  with?: string[];  // For relationship loading
}

export interface ProductResponse {
  data: Product;
}

export const productService = {
  getProducts: async (params: ProductQueryParams = {}): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<PaginatedResponse<Product>>('/products', {
      params: {
        page: params.page || 1,
        per_page: params.per_page || 12,
        search: params.search,
        category_id: params.category,
        is_active: params.is_active,
        with: params.with?.join(','),
      },
    });
    return response.data;
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get<ProductResponse>(`/products/${id}`, {
      params: {
        with_images: true,
        with_ingredients: true,
        with_tasks: true
      },
    });
    return response.data.data;
  },

  createProduct: async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> => {
    const response = await api.post<ProductResponse>('/products', product);
    return response.data.data;
  },

  updateProduct: async (id: string, product: Partial<Product>, fields: string[] = []): Promise<Product> => {
    console.log('Updating product with data:', product);
    
    try {
      // First, update the product without ingredients
      const { ingredients, ...productData } = product;
      const response = await api.put<{ data: Product }>(`/products/${id}`, { 
        data: productData 
      }, {
        params: { fields: fields.join(',') }
      });

      console.log('Product update response:', response.data);
      
      // If there are ingredients to update, handle them separately
      if (ingredients && ingredients.length > 0) {
        console.log('Updating recipe ingredients:', ingredients);
        
        // Bulk update the recipe ingredients - using ingredients directly since they match the API structure
        await recipeIngredientService.bulkUpdateProductIngredients(id, ingredients);
      }

      // Get the updated product with all its relationships
      const updatedProduct = await api.get<{ data: Product }>(`/products/${id}`, {
        params: { fields: fields.join(',') }
      });

      return updatedProduct.data.data;
    } catch (error) {
      console.error('API Error:', error);
      if (error instanceof AxiosError && error.response) {
        console.error('API Error Response Data:', error.response.data);
        console.error('Full error response:', error.response);
        throw new Error(error.response.data.message || 'Failed to update product');
      }
      throw error;
    }
  },

  deleteProduct: async (id: string): Promise<void> => {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      console.error('Error deleting product:', error);
      if (error instanceof AxiosError && error.response) {
        console.error('API Error Response:', error.response.data);
        throw new Error(error.response.data.message || 'Failed to delete product');
      }
      throw error;
    }
  },

  uploadProductImages: async (productId: string, images: File[]): Promise<Product> => {
    console.log('Starting image upload process for product:', productId);
    console.log('Number of images to upload:', images.length);
    
    const formData = new FormData();
    
    // Append each image with array notation
    images.forEach((image, index) => {
      console.log(`Adding image ${index + 1}:`, {
        name: image.name,
        type: image.type,
        size: image.size,
        field: 'images[]'
      });
      formData.append('images[]', image);
    });

    // If this is the first image, set it as thumbnail
    if (images.length > 0) {
      formData.append('is_thumbnail', 'true');
    }

    // Log FormData contents (for debugging)
    console.log('FormData entries:');
    const formDataLog: Record<string, { name: string; type: string; size: number } | string> = {};
    for (const pair of formData.entries()) {
      const [key, value] = pair;
      if (value instanceof File) {
        formDataLog[key] = {
          name: value.name,
          type: value.type,
          size: value.size
        };
      } else {
        formDataLog[key] = value;
      }
    }
    console.log('Complete FormData contents:', formDataLog);

    try {
      console.log('Sending upload request to:', `/products/${productId}/images`);
      console.log('Request configuration:', {
        url: `/products/${productId}/images`,
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      // Upload the images
      const uploadResponse = await api.post<ProductResponse>(`/products/${productId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      console.log('Upload response:', uploadResponse.data);

      // Get the updated product with all relationships
      console.log('Fetching updated product data');
      const updatedProduct = await api.get<ProductResponse>(`/products/${productId}`, {
        params: {
          with_images: true
        }
      });

      console.log('Updated product data:', updatedProduct.data);
      return updatedProduct.data.data;
    } catch (error) {
      console.error('Error uploading product images:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data;
        console.error('API Error Response:', errorData);
        console.error('Full error details:', {
          status: error.response.status,
          statusText: error.response.statusText,
          headers: error.response.headers,
          data: error.response.data
        });
        
        // Extract validation errors if they exist
        const validationErrors = errorData.errors ? 
          Object.values(errorData.errors).flat().join(', ') : 
          errorData.message;
        
        throw new Error(validationErrors || 'Failed to upload product images');
      }
      throw error;
    }
  },

  deleteProductImage: async (productId: string, imageId: string): Promise<void> => {
    try {
      await api.delete(`/products/${productId}/images/${imageId}`);
    } catch (error) {
      console.error('Error deleting product image:', error);
      if (error instanceof AxiosError && error.response) {
        console.error('API Error Response:', error.response.data);
        throw new Error(error.response.data.message || 'Failed to delete product image');
      }
      throw error;
    }
  },

  // Helper method to get the available relationships
  getAvailableRelationships(): string[] {
    return ['category', 'thumbnail', 'additional_images', 'ingredients'];
  }
}; 