import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Product, RecipeIngredient, ProductImage } from '../types';
import { useProductContext } from '../context/ProductContext';
import RecipeBuilder from './RecipeBuilder';
import MaterialForm from './productform/MaterialForm';
import { formatCurrency } from '../lib/utils';
import { ImagePlus, X, ToggleRight, ToggleLeft, FileText, Printer, Calculator, Box } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../types';

interface ProductFormProps {
  initialProduct?: Product;
  onSubmit: (product: Product) => void;
}

type TabType = 'basic' | 'material' | 'recipe' | 'pricing';

const ProductForm: React.FC<ProductFormProps> = ({
  initialProduct,
  onSubmit,
}) => {
  const { ingredients } = useProductContext();
  const [activeTab, setActiveTab] = useState<TabType>('basic');

  const [product, setProduct] = useState<Product>({
    id: initialProduct?.id || crypto.randomUUID(),
    name: initialProduct?.name || '',
    description: initialProduct?.description || '',
    category: initialProduct?.category || '',
    thumbnail_id: initialProduct?.thumbnail_id || '',
    cost_price: initialProduct?.cost_price || 0,
    price: initialProduct?.price || 0,
    minOrder: initialProduct?.minOrder || 1,
    stock: initialProduct?.stock || 0,
    branch_id: initialProduct?.branch_id || '1',
    created_at: initialProduct?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ingredients: initialProduct?.ingredients || [],
    images: initialProduct?.images || [],
    isActive: initialProduct?.isActive ?? true,
    paperType: initialProduct?.paperType || '',
    paperGrammar: initialProduct?.paperGrammar || '',
    printType: initialProduct?.printType || 'Black & White',
    finishingType: initialProduct?.finishingType || 'Tanpa Finishing',
    customFinishing: initialProduct?.customFinishing || '',
  });

  // Material form state
  const [paperType, setPaperType] = useState(initialProduct?.paperType || '');
  const [paperGrammar, setPaperGrammar] = useState(initialProduct?.paperGrammar || '');
  const [materialCostPerCm2, setMaterialCostPerCm2] = useState(0);
  const [isPaperEnabled, setIsPaperEnabled] = useState(!!initialProduct?.paperType);

  const [printType, setPrintType] = useState<'Black & White' | 'Full Color'>(
    initialProduct?.printType || 'Black & White'
  );
  const [printCostPerCm2, setPrintCostPerCm2] = useState(0);
  const [isPrintingEnabled, setIsPrintingEnabled] = useState(!!initialProduct?.printType);

  const [finishingType, setFinishingType] = useState<'Tanpa Finishing' | 'Doff' | 'Glossy' | 'Lainnya'>(
    initialProduct?.finishingType || 'Tanpa Finishing'
  );
  const [customFinishing, setCustomFinishing] = useState(
    initialProduct?.customFinishing || ''
  );
  const [finishingCostPerCm2, setFinishingCostPerCm2] = useState(0);
  const [isFinishingEnabled, setIsFinishingEnabled] = useState(!!initialProduct?.finishingType && initialProduct.finishingType !== 'Tanpa Finishing');

  const [markup, setMarkup] = useState(() => {
    if (initialProduct && initialProduct.cost_price !== 0) {
      const modalPrice = initialProduct.cost_price;
      const sellingPrice = initialProduct.price;
      return Math.round(((sellingPrice - modalPrice) / modalPrice) * 100);
    }
    return 50; // Default markup percentage
  });

  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>(
    initialProduct?.ingredients || []
  );

  const [images, setImages] = useState<ProductImage[]>(
    initialProduct?.images || []
  );

  // Update cost price when material costs change
  useEffect(() => {
    const materialCost = isPaperEnabled ? materialCostPerCm2 * 100 : 0; // Assuming 100 cm² as base size
    const printCost = isPrintingEnabled ? printCostPerCm2 * 100 : 0;
    const finishingCost = isFinishingEnabled ? finishingCostPerCm2 * 100 : 0;
    
    const ingredientsCost = recipeIngredients.reduce((total, item) => {
      return total + item.ingredient.price_per_unit * item.quantity;
    }, 0);

    const totalCostPrice = materialCost + printCost + finishingCost + ingredientsCost;
    const markupAmount = (totalCostPrice * markup) / 100;
    const sellingPrice = totalCostPrice + markupAmount;

    setProduct((prev) => ({
      ...prev,
      cost_price: totalCostPrice,
      price: sellingPrice,
      ingredients: recipeIngredients,
      paperType: isPaperEnabled ? paperType : undefined,
      paperGrammar: isPaperEnabled ? paperGrammar : undefined,
      printType: isPrintingEnabled ? printType : undefined,
      finishingType: isFinishingEnabled ? finishingType : undefined,
      customFinishing: isFinishingEnabled && finishingType === 'Lainnya' ? customFinishing : undefined,
    }));
  }, [
    isPaperEnabled,
    materialCostPerCm2,
    isPrintingEnabled,
    printCostPerCm2,
    isFinishingEnabled,
    finishingCostPerCm2,
    recipeIngredients,
    markup,
    paperType,
    paperGrammar,
    printType,
    finishingType,
    customFinishing,
  ]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
    if (name === 'isActive') {
      setProduct({
        ...product,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleMarkupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMarkup = parseInt(e.target.value);
    setMarkup(newMarkup);
  };

  const handleRecipeChange = (updatedIngredients: RecipeIngredient[]) => {
    setRecipeIngredients(updatedIngredients);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const imageUrl = URL.createObjectURL(file);

      const newImage: ProductImage = {
        id: crypto.randomUUID(),
        url: imageUrl,
        product_id: product.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setImages((prev) => [...prev, newImage]);
      setProduct((prev) => ({
        ...prev,
        images: [...(prev.images || []), newImage],
      }));
    });
  };

  const removeImage = (imageId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
    setProduct((prev) => ({
      ...prev,
      images: prev.images?.filter((img) => img.id !== imageId),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...product,
      ingredients: recipeIngredients,
      images: images,
    });
    toast.success('Produk berhasil');
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'basic', label: 'Basic Info', icon: <FileText className="w-5 h-5" /> },
    { id: 'material', label: 'Material & Printing', icon: <Printer className="w-5 h-5" /> },
    { id: 'recipe', label: 'Recipe', icon: <Box className="w-5 h-5" /> },
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
              onClick={() => setActiveTab(tab.id)}
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

      <form onSubmit={handleSubmit}>
        {/* Basic Info Tab */}
        <div className={activeTab === 'basic' ? '' : 'hidden'}>
          <div className="space-y-6">
            {/* Image Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div className="flex flex-wrap gap-4 mb-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt="Product"
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <label className="flex flex-col items-center justify-center cursor-pointer">
                <div className="flex flex-col items-center justify-center">
                  <ImagePlus className="w-8 h-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">
                    Upload Product Images
                  </span>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nama Produk
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  required
                  className="input mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Kategori Produk <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  required
                >
                  <option value="">Pilih kategori</option>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="Deskripsi"
                className="block text-sm font-medium text-gray-700"
              >
                Deskripsi
              </label>
              <textarea
                id="Deskripsi"
                name="description"
                value={product.description}
                onChange={handleChange}
                rows={3}
                className="input mt-1"
              />
            </div>
          </div>
        </div>

        {/* Material & Printing Tab */}
        <div className={activeTab === 'material' ? '' : 'hidden'}>
          <div className="bg-white rounded-lg">
            <MaterialForm
              paperGroup={{
                isEnabled: isPaperEnabled,
                setIsEnabled: setIsPaperEnabled,
                paperType,
                setPaperType,
                paperGrammar,
                setPaperGrammar,
                materialCostPerCm2,
                setMaterialCostPerCm2,
              }}
              printingGroup={{
                isEnabled: isPrintingEnabled,
                setIsEnabled: setIsPrintingEnabled,
                printType,
                setPrintType,
                printCostPerCm2,
                setPrintCostPerCm2,
              }}
              finishingGroup={{
                isEnabled: isFinishingEnabled,
                setIsEnabled: setIsFinishingEnabled,
                finishingType,
                setFinishingType,
                customFinishing,
                setCustomFinishing,
                finishingCostPerCm2,
                setFinishingCostPerCm2,
              }}
            />
          </div>
        </div>

        {/* Recipe Tab */}
        <div className={activeTab === 'recipe' ? '' : 'hidden'}>
          <RecipeBuilder
            ingredients={ingredients}
            selectedIngredients={recipeIngredients}
            onChange={handleRecipeChange}
          />
        </div>

        {/* Pricing Tab */}
        <div className={activeTab === 'pricing' ? '' : 'hidden'}>
          <div className="bg-white rounded-lg p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="cost_price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Harga Modal
                  </label>
                  <input
                    type="text"
                    id="cost_price"
                    name="cost_price"
                    value={formatCurrency(product.cost_price.toString())}
                    className="input mt-1 bg-gray-100"
                    readOnly
                  />
                </div>

                <div>
                  <label
                    htmlFor="markup"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Markup ({markup}%)
                  </label>
                  <input
                    type="range"
                    id="markup"
                    min="0"
                    max="200"
                    value={markup}
                    onChange={handleMarkupChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Harga Jual
                  </label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formatCurrency(product.price.toString())}
                    className="input mt-1 bg-purple-50 font-medium text-purple-700"
                    readOnly
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="minOrder"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Minimum Order
                  </label>
                  <input
                    type="number"
                    id="minOrder"
                    name="minOrder"
                    value={product.minOrder}
                    onChange={handleChange}
                    min="1"
                    className="input mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="stock"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Stok
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={product.stock}
                    onChange={handleChange}
                    min="0"
                    className="input mt-1"
                  />
                </div>

                <div>
                  <label className="flex justify-between items-center cursor-pointer">
                    <span className="text-sm font-medium text-gray-700">
                      Status Produk
                    </span>
                    <div
                      onClick={() =>
                        setProduct((prev) => ({
                          ...prev,
                          isActive: !prev.isActive,
                        }))
                      }
                    >
                      {product.isActive ? (
                        <div className="flex items-center">
                          <span className="mr-2 text-sm text-green-600">
                            Active
                          </span>
                          <ToggleRight className="h-8 w-8 text-green-500" />
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className="mr-2 text-sm text-red-500">
                            Inactive
                          </span>
                          <ToggleLeft className="h-8 w-8 text-red-400" />
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Step {tabs.findIndex(t => t.id === activeTab) + 1} of {tabs.length}:</span>
              <span className="font-medium">{tabs.find(t => t.id === activeTab)?.label}</span>
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => {
                  const currentIndex = tabs.findIndex(t => t.id === activeTab);
                  if (currentIndex > 0) {
                    setActiveTab(tabs[currentIndex - 1].id);
                  }
                }}
                className="btn btn-outline-secondary"
                disabled={activeTab === tabs[0].id}
              >
                Previous
              </button>
              {activeTab === tabs[tabs.length - 1].id ? (
                <button type="submit" className="btn btn-primary">
                  {initialProduct ? 'Update Product' : 'Create Product'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = tabs.findIndex(t => t.id === activeTab);
                    if (currentIndex < tabs.length - 1) {
                      setActiveTab(tabs[currentIndex + 1].id);
                    }
                  }}
                  className="btn btn-primary mr-[100px]"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
