import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Ingredient, PaginatedResponse } from '../types/api'; // Pastikan PaginatedResponse juga diimpor
import { toast } from 'sonner';
import { productService, ProductQueryParams } from '../services/productService'; // Import productService dan ProductQueryParams
import { ingredientService, IngredientQueryParams, CreateIngredientPayload } from '../services/ingredientService'; // Import ingredientService dan tipe payload/params-nya
import axios from 'axios'; // Digunakan untuk AxiosError

interface ProductContextProps {
  products: Product[];
  ingredients: Ingredient[];
  loading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'images' | 'ingredients' | 'category' | 'tasks'>) => Promise<Product>;
  updateProduct: (id: string, product: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at' | 'images' | 'category' | 'tasks'>>, fields?: string[]) => Promise<Product>; // Sesuaikan tipe untuk Partial Product tanpa relasi
  deleteProduct: (id: string) => Promise<void>;
  getProduct: (id: string) => Product | undefined; // Ini akan tetap ambil dari state lokal setelah fetch awal
  getProductWithIngredients: (id: string) => Promise<Product | undefined>; // Akan fetch dari API untuk detail
  addIngredient: (ingredient: CreateIngredientPayload) => Promise<Ingredient>;
  updateIngredient: (id: string, ingredient: Partial<CreateIngredientPayload>) => Promise<Ingredient>;
  deleteIngredient: (id: string) => Promise<void>;
  fetchProducts: (params?: ProductQueryParams) => Promise<void>;
  fetchIngredients: (params?: IngredientQueryParams) => Promise<void>;
}

const ProductContext = createContext<ProductContextProps | undefined>(
  undefined
);

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [ingredientList, setIngredientList] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- Fungsi untuk mengambil produk dari API ---
  const fetchProducts = async (params: ProductQueryParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response: PaginatedResponse<Product> = await productService.getProducts(params);
      setProductList(response.data); // Karena productService.getProducts mengembalikan response.data langsung
      // toast.success('Products loaded successfully!'); // Mengurangi spam toast
    } catch (err) {
      console.error('🔴 ProductContext: Failed to fetch products:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to load products');
        toast.error(err.response?.data?.message || 'Failed to load products');
      } else {
        setError('An unexpected error occurred while loading products.');
        toast.error('An unexpected error occurred while loading products.');
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Fungsi untuk mengambil bahan dari API ---
  const fetchIngredients = async (params: IngredientQueryParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response: PaginatedResponse<Ingredient> = await ingredientService.getIngredients(params);
      setIngredientList(response.data); // Karena ingredientService.getIngredients mengembalikan response.data langsung
      // toast.success('Ingredients loaded successfully!'); // Mengurangi spam toast
    } catch (err) {
      console.error('🔴 ProductContext: Failed to fetch ingredients:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to load ingredients');
        toast.error(err.response?.data?.message || 'Failed to load ingredients');
      } else {
        setError('An unexpected error occurred while loading ingredients.');
        toast.error('An unexpected error occurred while loading ingredients.');
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Memuat data awal saat komponen mount ---
  useEffect(() => {
    fetchProducts();
    fetchIngredients();
  }, []); // Dependensi kosong agar hanya berjalan sekali

  const addProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'images' | 'ingredients' | 'category' | 'tasks'>): Promise<Product> => {
    console.log('🟦 ProductContext: Adding product');
    setLoading(true);
    setError(null);
    try {
      console.log('🟨 ProductContext: Sending to API:', productData);
      const newProduct = await productService.createProduct(productData);
      console.log('🟩 ProductContext: API Response:', newProduct);
      
      setProductList((prev) => [...prev, newProduct]);
      toast.success('Product added successfully!');
      return newProduct;
    } catch (error) {
      console.error('🔴 ProductContext: API Error:', error);
      if (axios.isAxiosError(error)) {
        console.error('🔴 Response data:', error.response?.data);
        console.error('🔴 Status code:', error.response?.status);
        setError(error.response?.data?.message || 'Failed to add product');
        toast.error(error.response?.data?.message || 'Failed to add product');
      } else {
        setError('An unexpected error occurred while adding product.');
        toast.error('An unexpected error occurred while adding product.');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, updatedProductData: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at' | 'images' | 'category' | 'tasks'>>, fields: string[] = []): Promise<Product> => {
    setLoading(true);
    setError(null);
    try {
      const updatedProduct = await productService.updateProduct(id, updatedProductData, fields);
      setProductList((prev) =>
        prev.map((product) =>
          product.id === id ? updatedProduct : product
        )
      );
      toast.success('Product updated successfully!');
      return updatedProduct;
    } catch (error) {
      console.error('🔴 ProductContext: API Error during update:', error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Failed to update product');
        toast.error(error.response?.data?.message || 'Failed to update product');
      } else {
        setError('An unexpected error occurred while updating product.');
        toast.error('An unexpected error occurred while updating product.');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await productService.deleteProduct(id);
      setProductList((prev) => prev.filter((product) => product.id !== id));
      toast.success('Product deleted successfully!');
    } catch (error) {
      console.error('🔴 ProductContext: API Error during delete:', error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Failed to delete product');
        toast.error(error.response?.data?.message || 'Failed to delete product');
      } else {
        setError('An unexpected error occurred while deleting product.');
        toast.error('An unexpected error occurred while deleting product.');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // getProduct ini hanya akan mencari di state lokal (productList) yang sudah di-cache
  const getProduct = (id: string): Product | undefined => {
    return productList.find((product) => product.id === id);
  };

  // getProductWithIngredients ini akan melakukan panggilan API baru untuk memastikan data terbaru
  const getProductWithIngredients = async (productId: string): Promise<Product | undefined> => {
    setLoading(true);
    setError(null);
    try {
      // productService.getProduct sudah mengembalikan Product yang lengkap dengan relasi (images, ingredients, tasks, category)
      const product = await productService.getProduct(productId);
      return product;
    } catch (error) {
      console.error('🔴 ProductContext: API Error fetching product with ingredients:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setError('Product not found.');
        toast.error('Product not found.');
      } else if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Failed to fetch product details.');
        toast.error(error.response?.data?.message || 'Failed to fetch product details.');
      } else {
        setError('An unexpected error occurred while fetching product details.');
        toast.error('An unexpected error occurred while fetching product details.');
      }
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  // --- Ingredient related functions ---
  const addIngredient = async (ingredientData: CreateIngredientPayload): Promise<Ingredient> => {
    setLoading(true);
    setError(null);
    try {
      const newIngredient = await ingredientService.createIngredient(ingredientData);
      setIngredientList((prev) => [...prev, newIngredient]);
      toast.success('Ingredient added successfully!');
      return newIngredient;
    } catch (error) {
      console.error('🔴 ProductContext: API Error adding ingredient:', error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Failed to add ingredient');
        toast.error(error.response?.data?.message || 'Failed to add ingredient');
      } else {
        setError('An unexpected error occurred while adding ingredient.');
        toast.error('An unexpected error occurred while adding ingredient.');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateIngredient = async (id: string, updatedIngredientData: Partial<CreateIngredientPayload>): Promise<Ingredient> => {
    setLoading(true);
    setError(null);
    try {
      const updatedIngredient = await ingredientService.updateIngredient(id, updatedIngredientData);
      setIngredientList((prev) =>
        prev.map((ingredient) =>
          ingredient.id === id ? updatedIngredient : ingredient
        )
      );
      toast.success('Ingredient updated successfully!');
      return updatedIngredient;
    } catch (error) {
      console.error('🔴 ProductContext: API Error updating ingredient:', error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Failed to update ingredient');
        toast.error(error.response?.data?.message || 'Failed to update ingredient');
      } else {
        setError('An unexpected error occurred while updating ingredient.');
        toast.error('An unexpected error occurred while updating ingredient.');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteIngredient = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await ingredientService.deleteIngredient(id);
      setIngredientList((prev) => prev.filter((ingredient) => ingredient.id !== id));
      toast.success('Ingredient deleted successfully!');
    } catch (error) {
      console.error('🔴 ProductContext: API Error deleting ingredient:', error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Failed to delete ingredient');
        toast.error(error.response?.data?.message || 'Failed to delete ingredient');
      } else {
        setError('An unexpected error occurred while deleting ingredient.');
        toast.error('An unexpected error occurred while deleting ingredient.');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products: productList,
        ingredients: ingredientList,
        loading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
        getProductWithIngredients,
        addIngredient,
        updateIngredient,
        deleteIngredient,
        fetchProducts,
        fetchIngredients,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};