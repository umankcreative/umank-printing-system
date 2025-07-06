import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Product, RecipeIngredient } from '../types/api';
import { productService } from '../services/productService';
import RecipeBuilder from './RecipeBuilder';
import MaterialForm from './productform/MaterialForm';
import { formatCurrency } from '../lib/utils';
import { ImagePlus, X, ToggleRight, ToggleLeft, FileText, Calculator, Utensils, Layers } from 'lucide-react';
import * as categoryService from '../services/categoryService';
import { Category } from '../types/formTypes';
import ProductImagesUpload from './productform/ProductImagesUpload';
// import BoxFileUpload from './box/BoxFileUpload'; // Add this import
import { useAuth } from '../context/AuthContext';

interface ProductFormProps {
  initialProduct?: Product;
  onSubmit: (product: Product) => void;
  onChange?: (product: Partial<Product>) => void;
}

type TabType = 'general' | 'recipe' | 'materials' | 'pricing';

const ProductForm: React.FC<ProductFormProps> = ({
  initialProduct,
  onSubmit,
  onChange,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await categoryService.getCategories();
        // Filter for product type categories only
        const productCategories = categories.filter(cat => cat.type === 'product');
        setCategories(productCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // toast('Gagal mengambil kategori');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Initialize product state with default values
  const [product, setProduct] = useState<Product>({
    id: '',
    name: '',
    description: '',
    thumbnail_id: '',
    category_id: '',
    cost_price: '0',
    price: '0',
    min_order: 1,
    stock: 0,
    branch_id: user?.branch_id || '',
    is_active: true,
    paper_type: null,
    paper_grammar: null,
    print_type: 'Full Color',
    finishing_type: 'Tanpa Finishing',
    custom_finishing: null,
    is_paper_enabled: false,
    is_printing_enabled: false,
    is_finishing_enabled: false,
  });

  // Fetch product data if we have an ID
  // Fetch product data only when initialProduct.id changes
  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;

    const fetchProduct = async () => {
      // Only fetch if we have an ID and it's a new ID (different from current product.id)
      if (initialProduct?.id && initialProduct.id !== product.id) {
        try {
          const productData = await productService.getProduct(initialProduct.id);
          // Only update if not aborted and still mounted
          if (!controller.signal.aborted && mounted) {
            setProduct(productData);
            onChange?.(productData);
          }
        } catch (error) {
          if (!controller.signal.aborted && mounted) {
            console.error('Error fetching product:', error);
            toast.error('Failed to load product data');
          }
        }
      } else if (initialProduct && !initialProduct.id) {
        // For new products, use initialProduct data
        setProduct(prev => ({
          ...prev,
          ...initialProduct,
        }));
      }
    };

    fetchProduct();

    // Cleanup: abort any in-flight requests when id changes or component unmounts
    return () => {
      mounted = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProduct?.id]); // We only want to re-fetch when the ID changes

  // Material form state
  const [paperType, setPaperType] = useState<string | null>(initialProduct?.paper_type || null);
  const [paperGrammar, setPaperGrammar] = useState<string | null>(initialProduct?.paper_grammar || null);
  const [materialCostPerCm2, setMaterialCostPerCm2] = useState(0);
  const [isPaperEnabled, setIsPaperEnabled] = useState(initialProduct?.is_paper_enabled ?? false);

  const [printType, setPrintType] = useState<'Black & White' | 'Full Color' | null>(
    initialProduct?.print_type as 'Black & White' | 'Full Color' | null || null
  );
  const [printCostPerCm2, setPrintCostPerCm2] = useState(0);
  const [isPrintingEnabled, setIsPrintingEnabled] = useState(initialProduct?.is_printing_enabled ?? false);

  const [finishingType, setFinishingType] = useState<'Tanpa Finishing' | 'Doff' | 'Glossy' | 'Lainnya' | null>(
    initialProduct?.finishing_type as 'Tanpa Finishing' | 'Doff' | 'Glossy' | 'Lainnya' | null || null
  );
  const [customFinishing, setCustomFinishing] = useState<string | null>(
    initialProduct?.custom_finishing || null
  );
  const [finishingCostPerCm2, setFinishingCostPerCm2] = useState(0);
  const [isFinishingEnabled, setIsFinishingEnabled] = useState(initialProduct?.is_finishing_enabled ?? false);

  const [markup, setMarkup] = useState(() => {
    if (initialProduct && initialProduct.cost_price !== '0.00') {
      const modalPrice = parseFloat(initialProduct.cost_price);
      const sellingPrice = parseFloat(initialProduct.price);
      return Math.round(((sellingPrice - modalPrice) / modalPrice) * 100);
    }
    return 100; // Default markup percentage
  });

  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>(
    initialProduct?.ingredients || []
);

  // Calculate product costs and update state
  const updateProductCosts = () => {
    if (!product) return;

    let totalCost = 0;

    // Calculate recipe ingredients cost
    if (recipeIngredients.length > 0) {
      totalCost += recipeIngredients.reduce((sum, ingredient) => {
        // Skip if ingredient or its data is missing
        if (!ingredient?.price_per_unit) {
          // console.warn('Missing price_per_unit for ingredient:', ingredient);
          return sum;
        }
        const quantity = parseFloat(ingredient.quantity?.toString() || '0') || 0;
        const pricePerUnit = parseFloat(ingredient.price_per_unit) || 0;
        return sum + (quantity * pricePerUnit);
      }, 0);
    }

    // Add material costs if enabled
    if (isPaperEnabled && materialCostPerCm2 > 0) {
      totalCost += materialCostPerCm2;
    }

    if (isPrintingEnabled && printCostPerCm2 > 0) {
      totalCost += printCostPerCm2;
    }

    if (isFinishingEnabled && finishingCostPerCm2 > 0) {
      totalCost += finishingCostPerCm2;
    }

    // Apply markup
    const markupMultiplier = 1 + (markup / 100);
    const sellingPrice = totalCost * markupMultiplier;

    const updatedProduct = {
      ...product,
      cost_price: totalCost.toFixed(2),
      price: sellingPrice.toFixed(2),
    };

    setProduct(updatedProduct);
    onChange?.(updatedProduct);
  };

  // Update costs when dependencies change
  useEffect(() => {
    updateProductCosts();
  }, [
    materialCostPerCm2,
    printCostPerCm2,
    finishingCostPerCm2,
    recipeIngredients,
    markup,
    paperType,
    paperGrammar,
    printType,
    finishingType,
    customFinishing,
    isPaperEnabled,
    isPrintingEnabled,
    isFinishingEnabled,
  ]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const updatedProduct = {
      ...product,
      [name]: name === 'is_active' ? (e.target as HTMLInputElement).checked : value,
    };
    setProduct(updatedProduct);
    onChange?.(updatedProduct);
  };

  const handleMarkupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMarkup = parseInt(e.target.value);
    setMarkup(newMarkup);
  };

  const handleRecipeChange = (updatedIngredients: RecipeIngredient[]) => {
    // console.log('Recipe ingredients updated in ProductForm:', updatedIngredients);
    setRecipeIngredients(updatedIngredients);

    // Create a complete updated product with all necessary fields
    const updatedProduct = {
      ...product,
      ingredients: updatedIngredients
    };

    // console.log('Updating product in ProductForm with new ingredients:', updatedProduct);
    setProduct(updatedProduct);
    onChange?.(updatedProduct);
  };

  

  // Update costs when recipe ingredients change
  useEffect(() => {
    const updateProductCosts = () => {
      if (recipeIngredients.length > 0) {
        // console.log('Recipe ingredients changed, updating costs:', recipeIngredients);
        let totalCost = 0;

        // Calculate total cost from ingredients with null checks
        totalCost += recipeIngredients.reduce((sum, ingredient) => {
          if (!ingredient?.price_per_unit) {
            // console.warn('Missing price_per_unit for ingredient:', ingredient);
            return sum;
          }
          const quantity = parseFloat(ingredient.quantity?.toString() || '0') || 0;
          const pricePerUnit = parseFloat(ingredient.price_per_unit) || 0;
          return sum + (quantity * pricePerUnit);
        }, 0);

        // Update cost price
        setProduct(prev => ({
          ...prev,
          cost_price: totalCost.toFixed(2)
        }));
      }
    };

    updateProductCosts();
  }, [recipeIngredients]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🟦 Form submission started');
    
    // Validate required fields
    if (!product.category_id || !product.name) {
      console.log('🔴 Validation failed:', { category_id: product.category_id, name: product.name });
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      console.log('🟨 Preparing submission data:', product);
      
      // Clean up the product data before submission
      const submissionData: Product = {
        id: product.id || '', // Include existing id or empty string for new products
        name: product.name,
        description: product.description || '',
        thumbnail_id: product.thumbnail_id || '', // Required by API
        category_id: product.category_id,
        cost_price: (parseFloat(product.cost_price) || 0).toFixed(2),
        price: (parseFloat(product.price) || 0).toFixed(2),
        min_order: Number(product.min_order) || 1,
        stock: Number(product.stock) || 1,
        branch_id: user?.branch_id || '', // Get from authenticated user
        is_active: product.is_active,
        
        // Material fields
        paper_type: isPaperEnabled ? paperType : null,
        paper_grammar: isPaperEnabled ? paperGrammar : null,
        print_type: isPrintingEnabled ? (printType || 'Full Color') : 'Full Color', // Default to 'Full Color'
        finishing_type: isFinishingEnabled ? finishingType : 'Tanpa Finishing',
        custom_finishing: isFinishingEnabled && finishingType === 'Lainnya' ? customFinishing : null,
        
        // Feature flags
        is_paper_enabled: isPaperEnabled,
        is_printing_enabled: isPrintingEnabled,
        is_finishing_enabled: isFinishingEnabled,
        
        // Recipe ingredients
        ingredients: recipeIngredients.map(ing => ({
          ...ing,
          ingredient_id: ing.id,
          quantity: ing.quantity,
          notes: ing.notes || null,
        })),
      };

      console.log('🟩 Submitting product data:', submissionData);
      onSubmit(submissionData);
    } catch (error) {
      console.error('🔴 Error in form submission:', error);
      toast.error('Failed to submit form');
    }
  };

  const toggleProductStatus = () => {
    const updatedProduct = {
      ...product,
      is_active: !product.is_active,
      updated_at: new Date().toISOString(),
    };
    setProduct(updatedProduct);
    onChange?.(updatedProduct);
  };

  const tabs = [
    { id: 'general', label: 'Umum', icon: <FileText className="w-5 h-5" /> },
    { id: 'recipe', label: 'Resep', icon: <Utensils className="w-5 h-5" /> },
    { id: 'materials', label: 'Cetak Custom', icon: <Layers className="w-5 h-5" /> },
    { id: 'pricing', label: 'Harga', icon: <Calculator className="w-5 h-5" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`
                flex items-center py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Tab */}
        <div className={activeTab === 'general' ? '' : 'hidden'}>
          <div className="grid grid-cols-1 gap-6">
            {/* Product Status Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Status Produk</h3>
                <p className="text-sm text-gray-500">
                  {product.is_active ? 'Active' : 'Inactive'}
                </p>
              </div>
              <button
                type="button"
                onClick={toggleProductStatus}
                className="text-purple-600 hover:text-purple-700"
                
              >
                {product.is_active ? (
                  <div className="flex items-center">
                                  <span className="mr-2 text-sm text-green-600">Active</span>
                                  <ToggleRight className="h-12 w-12 text-green-500" />
                                </div>
                ) : (
                  <div className="flex items-center">
                                  <span className="mr-2 text-sm text-red-500">Inactive</span>
                                  <ToggleLeft className="h-12 w-12 text-red-400" />
                                </div>
                )}
              </button>
            </div>

            {/* Basic Fields */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nama Produk
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={product.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Deskripsi
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                value={product.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
              />
            </div>

              <div className="flex w-full items-stretch space-x-4">
                    <div>
                      <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                        Kategori
                      </label>
                      <select
                        name="category_id"
                        id="category_id"
                        value={product.category_id}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                        required
                        disabled={loading}
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {loading && (
                        <p className="mt-1 text-sm text-gray-500">Loading categories...</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="min_order" className="block text-sm font-medium text-gray-700">
                        Minimum Order
                      </label>
                      <input
                        type="number"
                        name="min_order"
                        id="min_order"
                        value={product.min_order}
                        onChange={handleChange}
                        min="1"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                        Stock
                      </label>
                      <input
                        type="number"
                        name="stock"
                        id="stock"
                        value={product.stock}
                        onChange={handleChange}
                        min="0"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                        required
                      />
                    </div>
              </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Thumbnail
              </label>
              <div className="mt-1 flex items-center space-x-4">
                {product.thumbnail_id && (
                  <div className="relative w-32 h-32">
                    <img
                      src={product.thumbnail_id}
                      alt="Product thumbnail"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updatedProduct = {
                          ...product,
                          thumbnail_id: ''
                        };
                        setProduct(updatedProduct);
                        onChange?.(updatedProduct);
                      }}
                      className="absolute -top-2 -right-2 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) }
              </div>
            </div>

            {/* Additional Images Upload */}
            {product.id && (
              <div>
                
                {/* <BoxFileUpload/> */}
                <ProductImagesUpload
                  productId={product.id}
                  existingImages={product.additional_images}
                  onImagesUploaded={() => {
                    // Refresh the product data to show newly uploaded images
                    if (onChange) {
                      onChange(product);
                    }
                  }}
                  onSetThumbnail={(imageUrl: string) => {
                    const updatedProduct = {
                      ...product,
                      thumbnail_id: imageUrl
                    };
                    setProduct(updatedProduct);
                    onChange?.(updatedProduct);
                    toast.success('Thumbnail updated successfully');
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Recipe Tab */}
        <div className={activeTab === 'recipe' ? '' : 'hidden'}>
          <RecipeBuilder
            ingredients={recipeIngredients}
            onChange={handleRecipeChange}
            productId={product.id}
          />
        </div>

        {/* Materials Tab */}
        <div className={activeTab === 'materials' ? '' : 'hidden'}>
          <MaterialForm
            paperType={paperType}
            setPaperType={setPaperType}
            paperGrammar={paperGrammar}
            setPaperGrammar={setPaperGrammar}
            materialCostPerCm2={materialCostPerCm2}
            setMaterialCostPerCm2={setMaterialCostPerCm2}
            isPaperEnabled={isPaperEnabled}
            setIsPaperEnabled={setIsPaperEnabled}
            printType={printType}
            setPrintType={setPrintType}
            printCostPerCm2={printCostPerCm2}
            setPrintCostPerCm2={setPrintCostPerCm2}
            isPrintingEnabled={isPrintingEnabled}
            setIsPrintingEnabled={setIsPrintingEnabled}
            finishingType={finishingType}
            setFinishingType={setFinishingType}
            customFinishing={customFinishing}
            setCustomFinishing={setCustomFinishing}
            finishingCostPerCm2={finishingCostPerCm2}
            setFinishingCostPerCm2={setFinishingCostPerCm2}
            isFinishingEnabled={isFinishingEnabled}
            setIsFinishingEnabled={setIsFinishingEnabled}
          />
        </div>

        {/* Pricing Tab */}
        <div className={activeTab === 'pricing' ? '' : 'hidden'}>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Harga</h3>
              <p className="mt-1 text-sm text-gray-500">
                Atur harga produk berdasarkan biaya dan markup yang ditentukan.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Harga Modal
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">Rp</span>
                  </div>
                  <input
                    type="text"
                    name="cost_price"
                    value={formatCurrency(product.cost_price.toString())}
                    className="block w-full pl-12 pr-12 sm:text-sm border-gray-300 rounded-md"
                    disabled
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Selling Price
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">Rp</span>
                  </div>
                  <input
                    type="text"
                    name="price"
                    value={formatCurrency(product.price.toString())}
                    className="block w-full pl-12 pr-12 sm:text-sm border-gray-300 rounded-md"
                    disabled
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="markup" className="block text-sm font-medium text-gray-700">
                Persentasi Markup
              </label>
            <div className="flex w-full items-center space-x-4 mt-2">
              <input
            type="range"
            value={markup}
            onChange={handleMarkupChange}
            name="markup"
            id="markup"
            min="0"
            max="200"
            step="1"
            className="flex-grow h-2 w-full rounded-lg appearance-none bg-gray-200 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
              />
              <span className="ml-4 bg-gray-100 py-1 px-2 rounded text-sm min-w-[60px] text-center">
            {markup}%
                </span>
            </div>
              <p className="mt-2 text-sm text-gray-500">
                Ini akan otomatis menghitung Harga jual berdasarkan harga modal
              </p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-secondary"
            >
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              Simpan Perubahan
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;

