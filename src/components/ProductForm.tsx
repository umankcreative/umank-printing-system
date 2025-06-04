import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Product, RecipeIngredient } from '../types/api';
import RecipeBuilder from './RecipeBuilder';
import MaterialForm from './productform/MaterialForm';
import { formatCurrency } from '../lib/utils';
import { ImagePlus, X, ToggleRight, ToggleLeft, FileText, Calculator, Utensils, Layers } from 'lucide-react';
import * as categoryService from '../services/categoryService';
import { Category } from '../types/formTypes';
import ProductImagesUpload from './productform/ProductImagesUpload';
import BoxFileUpload from './box/BoxFileUpload';

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
        toast.error('Gagal mengambil kategori');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const [product, setProduct] = useState<Product>(initialProduct || {
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
  } as Product);

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
    return 50; // Default markup percentage
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
          console.warn('Missing price_per_unit for ingredient:', ingredient);
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
    console.log('Recipe ingredients updated in ProductForm:', updatedIngredients);
    setRecipeIngredients(updatedIngredients);

    // Create a complete updated product with all necessary fields
    const updatedProduct = {
      ...product,
      ingredients: updatedIngredients
    };

    console.log('Updating product in ProductForm with new ingredients:', updatedProduct);
    setProduct(updatedProduct);
    onChange?.(updatedProduct);
  };

  // Update costs when recipe ingredients change
  useEffect(() => {
    const updateProductCosts = () => {
      if (recipeIngredients.length > 0) {
        console.log('Recipe ingredients changed, updating costs:', recipeIngredients);
        let totalCost = 0;

        // Calculate total cost from ingredients with null checks
        totalCost += recipeIngredients.reduce((sum, ingredient) => {
          if (!ingredient?.price_per_unit) {
            console.warn('Missing price_per_unit for ingredient:', ingredient);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!product.category_id) {
      toast.error('Please select a category');
      return;
    }
    
    // Clean up the product data before submission
    const submissionData: Product = {
      id: product.id,
      name: product.name,
      description: product.description || '',
      category_id: product.category_id,
      cost_price: (parseFloat(product.cost_price) || 0).toFixed(2),
      price: (parseFloat(product.price) || 0).toFixed(2),
      min_order: Number(product.min_order) || 1,
      thumbnail_id: product.thumbnail_id,
      stock: Number(product.stock) || 0,
      branch_id: product.branch_id,
      is_active: product.is_active,
      // Feature flags
      is_paper_enabled: isPaperEnabled,
      is_printing_enabled: isPrintingEnabled,
      is_finishing_enabled: isFinishingEnabled,
      // Material fields
      paper_type: isPaperEnabled ? (product.paper_type || null) : null,
      paper_grammar: isPaperEnabled ? (product.paper_grammar || null) : null,
      print_type: isPrintingEnabled ? (product.print_type || null) : null,
      finishing_type: isFinishingEnabled ? (product.finishing_type || 'Tanpa Finishing') : 'Tanpa Finishing',
      custom_finishing: isFinishingEnabled && product.finishing_type === 'Lainnya' ? (product.custom_finishing || null) : null,
      // Recipe ingredients - format for API
      ingredients: recipeIngredients.map(ing => ({
        id: ing.id,
        name: ing.name,
        description: ing.description,
        quantity: parseFloat(ing.quantity).toFixed(2),
        unit: ing.unit,
        price_per_unit: ing.price_per_unit,
        notes: ing.notes || null,
        task_templates: ing.task_templates
      })) || [],
      // Timestamps - don't send these as they're managed by the server
      created_at: undefined,
      updated_at: undefined
    };

    console.log('Submitting product with data:', submissionData);
    onSubmit(submissionData);
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
    { id: 'general', label: 'General', icon: <FileText className="w-5 h-5" /> },
    { id: 'recipe', label: 'Recipe', icon: <Utensils className="w-5 h-5" /> },
    { id: 'materials', label: 'Materials', icon: <Layers className="w-5 h-5" /> },
    { id: 'pricing', label: 'Pricing', icon: <Calculator className="w-5 h-5" /> },
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
                  <ToggleRight className="w-10 h-10" />
                ) : (
                  <ToggleLeft className="w-10 h-10" />
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

            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Thumbnail
              </label>
              <div className="mt-1 flex items-center space-x-4">
                {product.thumbnail?.url ? (
                  <div className="relative w-32 h-32">
                    <img
                      src={ product.thumbnail.url}
                      alt="Product thumbnail"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updatedProduct = {
                          ...product,
                          thumbnail: undefined
                        };
                        setProduct(updatedProduct);
                        onChange?.(updatedProduct);
                      }}
                      className="absolute -top-2 -right-2 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) :
                  <label className="flex items-center justify-center w-32 h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-purple-500">
                    <div className="space-y-1 text-center">
                      <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="text-xs text-gray-600">Upload</div>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const updatedProduct = {
                              ...product,
                              thumbnail: {
                                id: crypto.randomUUID(),
                                product_id: product.id,
                                url: reader.result as string,
                                is_primary: true,
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString()
                              }
                            };
                            setProduct(updatedProduct);
                            onChange?.(updatedProduct);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                }
              </div>
            </div>

            {/* Additional Images Upload */}
            {product.id && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Images
                </label>
                <BoxFileUpload/>
                <ProductImagesUpload
                  productId={product.id}
                  existingImages={product.additional_images}
                  onImagesUploaded={() => {
                    // Refresh the product data to show newly uploaded images
                    if (onChange) {
                      onChange(product);
                    }
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
              <h3 className="text-lg font-medium text-gray-900">Pricing Information</h3>
              <p className="mt-1 text-sm text-gray-500">
                Set your product's cost and selling prices
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cost Price
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
                Markup Percentage
              </label>
              <input
                type="number"
                name="markup"
                id="markup"
                value={markup}
                onChange={handleMarkupChange}
                min="0"
                max="1000"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
              />
              <p className="mt-2 text-sm text-gray-500">
                This will automatically calculate the selling price based on the cost price
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
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;

