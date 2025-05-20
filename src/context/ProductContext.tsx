import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Ingredient, RecipeIngredient } from '../types';
import {
  products,
  ingredients,
  recipes,
  productImages,
} from '../data/mockData';

interface ProductContextProps {
  products: Product[];
  ingredients: Ingredient[];
  loading: boolean;
  error: string | null;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  getProductWithIngredients: (id: string) => Product | undefined;
  addIngredient: (ingredient: Ingredient) => void;
  updateIngredient: (ingredient: Ingredient) => void;
  deleteIngredient: (id: string) => void;
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
  const [productList, setProductList] = useState<Product[]>(products);
  const [ingredientList, setIngredientList] =
    useState<Ingredient[]>(ingredients);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addProduct = (product: Product) => {
    setProductList([...productList, product]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProductList(
      productList.map((product) =>
        product.id === updatedProduct.id
          ? {
              ...updatedProduct,
              ingredients: updatedProduct.ingredients,
              images: updatedProduct.images,
            }
          : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProductList(productList.filter((product) => product.id !== id));
  };

  const getProduct = (id: string): Product | undefined => {
    return productList.find((product) => product.id === id);
  };

  const getProductWithIngredients = (
    productId: string
  ): Product | undefined => {
    const product = productList.find((p) => p.id === productId);

    if (!product) return undefined;

    if (product.ingredients && product.images) {
      return product;
    }

    const productRecipes = recipes.filter((r) => r.product_id === productId);
    const prodImages = productImages.filter(
      (img) => img.product_id === productId
    );

    const recipeIngredients = productRecipes
      .map((recipe) => {
        const ingredient = ingredientList.find(
          (i) => i.id === recipe.ingredient_id
        );
        if (!ingredient) return null;
        return {
          ingredient,
          quantity: recipe.quantity,
        };
      })
      .filter((item) => item !== null) as RecipeIngredient[];

    return {
      ...product,
      images: prodImages,
      ingredients: recipeIngredients,
    };
  };

  const addIngredient = (ingredient: Ingredient) => {
    setIngredientList([...ingredientList, ingredient]);
  };

  const updateIngredient = (updatedIngredient: Ingredient) => {
    setIngredientList(
      ingredientList.map((ingredient) =>
        ingredient.id === updatedIngredient.id ? updatedIngredient : ingredient
      )
    );
  };

  const deleteIngredient = (id: string) => {
    setIngredientList(
      ingredientList.filter((ingredient) => ingredient.id !== id)
    );
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
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
