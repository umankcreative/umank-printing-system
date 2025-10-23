import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { productService } from '../services/productService';
import ProductForm from '../components/ProductForm';
import { Product, RecipeIngredient } from '../types/api'; // Import RecipeIngredient
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
  // product state holds the "source of truth" for the form's initial data and is updated AFTER a successful save.
  const [product, setProduct] = useState<Product | null>(null);
  // previewProduct state is updated by the onChange handler to show real-time changes without affecting the main product state immediately.
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
        // console.log('Product response:', response);
        
        // Ensure ingredients is always an array, and deep copy if needed for reactivity
        const productWithIngredients: Product = {
          ...response,
          ingredients: response.ingredients ? [...response.ingredients] : [] // Deep copy ingredients to ensure reactivity
        };
        console.log('Fetched product with ingredients:', productWithIngredients);
        setProduct(productWithIngredients); // Set the main product state from API
        setPreviewProduct(productWithIngredients); // Initialize preview with the same data
        
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
      console.log('Product data submitted with ingredients:', updatedProduct.ingredients);
      
      // Clean up the thumbnail_id if it's a URL (assuming backend handles URL or ID)
      const cleanedProduct = {
        ...updatedProduct,
        thumbnail_id: updatedProduct.thumbnail_id
      };
      
      const response = await productService.updateProduct(id!, cleanedProduct, ['ingredients', 'thumbnail', 'additional_images']);
      
      console.log('Product updated successfully:', response);
      
      // IMPORTANT: Update the main product state in ProductEdit after a successful save
      // This ensures ProductForm receives the latest data on subsequent renders if needed
      setProduct(response); 
      setPreviewProduct(response); // Also update preview to match the saved data
      
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

  // This handler is ONLY for updating the preview state and material enabled flags
  // It does NOT update the `product` state that is passed as `initialProduct` to ProductForm.
  const handleFormChange = (updatedProductPartial: Partial<Product>) => {
    setPreviewProduct(prev => {
      // This should not happen if state is initialized correctly, but as a safeguard:
      if (!prev) return null;

      const newPreview = {
        ...prev,
        ...updatedProductPartial,
      };

      // Consistently derive material enabled state from the product data itself
      setMaterialEnabled({
        paper: !!newPreview.paper_type,
        printing: !!newPreview.print_type,
        finishing: !!newPreview.finishing_type && newPreview.finishing_type !== 'Tanpa Finishing',
      });

      return newPreview;
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
            initialProduct={product} // This is the source of truth for the form's initial load
            onSubmit={handleSubmit} 
            onChange={handleFormChange} // Used for real-time preview updates in parent
          />
        </div>
        
        <div>
          <div className="sticky top-24 md:w-[400px]">
            {/* <FormSection title="Product Preview">
              <ProductPreview
                product={previewProduct || { // Fallback if previewProduct is null initially
                  id: '', // Add ID here to match Product type
                  name: '',
                  description: '',
                  category_id: '',
                  cost_price: '0',
                  price: '0',
                  min_order: 0,
                  thumbnail_id: '',
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
                  ingredients: [] // Provide an empty array for ingredients
                }}
                materialEnabled={materialEnabled}
              />
            </FormSection> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductEdit;