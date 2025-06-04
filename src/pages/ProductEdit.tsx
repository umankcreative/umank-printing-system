import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { productService } from '../services/productService';
import ProductForm from '../components/ProductForm';
import { Product } from '../types/api';
import FormSection from '../components/productform/FormSection';
import ProductPreview from '../components/ProductPreview';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [materialEnabled, setMaterialEnabled] = useState({
    paper: false,
    printing: false,
    finishing: false,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await productService.getProduct(id);
        console.log('Product response:', response);
        
        // Ensure ingredients is always an array
        const productWithIngredients = {
          ...response,
          ingredients: response.ingredients || []
        };
        
        setProduct(productWithIngredients);
        setPreviewProduct(productWithIngredients);
        
        if (response) {
          setMaterialEnabled({
            paper: !!response.paper_type,
            printing: !!response.print_type,
            finishing: !!response.finishing_type && response.finishing_type !== 'Tanpa Finishing',
          });
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (updatedProduct: Product) => {
    try {
      console.log('Submitting product with ingredients:', updatedProduct.ingredients);
      
      // Clean up the thumbnail_id if it's a URL
      const cleanedProduct = {
        ...updatedProduct,
        thumbnail_id: updatedProduct.thumbnail_id?.startsWith('http') ? undefined : updatedProduct.thumbnail_id
      };
      
      const response = await productService.updateProduct(id!, cleanedProduct, ['ingredients', 'thumbnail', 'additional_images']);
      
      console.log('Product updated successfully:', response);
      
      toast.success('Product updated successfully');
      navigate('/admin/products');
    } catch (err) {
      console.error('Error updating product:', err);
      
      let errorMessage = 'Failed to update product';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      if (err instanceof AxiosError && err.response?.data) {
        const apiError = err.response.data as ApiErrorResponse;
        if (apiError.errors) {
          console.error('Validation errors:', apiError.errors);
          const validationMessages = Object.entries(apiError.errors)
            .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
            .join('\n');
          errorMessage += '\n' + validationMessages;
        }
      }
      
      toast.error(errorMessage, {
        duration: 5000
      });
    }
  };

  const handleFormChange = (updatedProduct: Partial<Product>) => {
    console.log('Form change in ProductEdit:', updatedProduct);
    console.log('Current ingredients:', updatedProduct.ingredients);
    
    setPreviewProduct(prev => {
      if (!prev) return prev;
      
      // Create a complete updated preview with proper type handling for ingredients
      const newPreview = {
        ...prev,
        ...updatedProduct,
        is_active: updatedProduct.is_active ?? prev.is_active,
        ingredients: Array.isArray(updatedProduct.ingredients) ? updatedProduct.ingredients : prev.ingredients,
      };
      
      console.log('Updated preview product:', newPreview);
      console.log('Preview ingredients:', newPreview.ingredients);
      return newPreview;
    });

    // Also update the main product state with proper type handling
    setProduct(current => {
      if (!current) return current;
      const updatedMainProduct = {
        ...current,
        ...updatedProduct,
        ingredients: Array.isArray(updatedProduct.ingredients) ? updatedProduct.ingredients : current.ingredients,
      };
      console.log('Updated main product:', updatedMainProduct);
      return updatedMainProduct;
    });

    setMaterialEnabled({
      paper: !!updatedProduct.paper_type,
      printing: !!updatedProduct.print_type,
      finishing: !!updatedProduct.finishing_type && updatedProduct.finishing_type !== 'Tanpa Finishing',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-gray-600 mb-4">Product not found.</p>
        <button
          onClick={() => navigate('/admin/products')}
          className="btn btn-primary"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between">
      <div className="mb-6 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          Edit Produk: {product.name}
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-8 justify-between">
        <div className="bg-white rounded-lg shadow-md p-6 md:w-2/3">
          <ProductForm 
            initialProduct={product} 
            onSubmit={handleSubmit} 
            onChange={handleFormChange}
          />
        </div>
        
        <div>
          <div className="sticky top-24 md:w-[400px]">
            <FormSection title="Product Preview">
              <ProductPreview
                product={previewProduct || {
                  name: '',
                  description: '',
                  category_id: '',
                  cost_price: '0',
                  price: '0',
                  min_order: 0,
                  stock: 0,
                  branch_id: '',
                  is_active: true,
                  paper_type: null,
                  paper_grammar: null,
                  print_type: null,
                  finishing_type: 'Tanpa Finishing',
                  custom_finishing: null,
                  is_paper_enabled: false,
                  is_printing_enabled: false,
                  is_finishing_enabled: false,
                }}
                materialEnabled={materialEnabled}
              />
            </FormSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductEdit;
