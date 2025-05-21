import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Product, RecipeIngredient, ProductImage } from '../types';
import { useProductContext } from '../context/ProductContext';
import RecipeBuilder from './RecipeBuilder';
import { formatCurrency } from '../lib/utils';
import { ImagePlus, X, ToggleRight, ToggleLeft } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../types';
interface ProductFormProps {
  initialProduct?: Product;
  onSubmit: (product: Product) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialProduct,
  onSubmit,
}) => {
  const { ingredients } = useProductContext();

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
  });

  const [markup, setMarkup] = useState(() => {
    if (initialProduct && initialProduct.cost_price !== 0) {
      const modalPrice = initialProduct.cost_price;
      const sellingPrice = initialProduct.price;
      return Math.round(((sellingPrice - modalPrice) / modalPrice) * 100);
    }
    return 50; // Default markup percentage
  });

  const [recipeIngredients, setRecipeIngredients] = useState<
    RecipeIngredient[]
  >(initialProduct?.ingredients || []);

  const [images, setImages] = useState<ProductImage[]>(
    initialProduct?.images || []
  );

  // Update modal price when recipe ingredients change
  useEffect(() => {
    const totalModalPrice = recipeIngredients.reduce((total, item) => {
      return (
        total +
        item.ingredient.price_per_unit * item.quantity
      );
    }, 0);

    const newHargaModal = totalModalPrice.toString();
    const markupAmount = (totalModalPrice * markup) / 100;
    const newHarga = (totalModalPrice + markupAmount).toString();

    setProduct((prev) => ({
      ...prev,
      cost_price: Number(newHargaModal),
      price: Number(newHarga),
      ingredients: recipeIngredients,
    }));
  }, [recipeIngredients, markup]);

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
    } else if (['HargaModal', 'Harga', 'minOrder', 'Stok'].includes(name)) {
      setProduct({ ...product, [name]: value });
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
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

          <div>
            <label
              htmlFor="NamaProduk"
              className="block text-sm font-medium text-gray-700"
            >
              Nama Produk
            </label>
            <input
              type="text"
              id="NamaProduk"
              name="NamaProduk"
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

          <div>
            <label
              htmlFor="Deskripsi"
              className="block text-sm font-medium text-gray-700"
            >
              Deskripsi
            </label>
            <textarea
              id="Deskripsi"
              name="Deskripsi"
              value={product.description}
              onChange={handleChange}
              rows={3}
              className="input mt-1"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="HargaModal"
                className="block text-sm font-medium text-gray-700"
              >
                Harga Modal
              </label>
              <input
                type="text"
                id="HargaModal"
                name="HargaModal"
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
                htmlFor="Harga"
                className="block text-sm font-medium text-gray-700"
              >
                Harga Jual
              </label>
              <input
                type="text"
                id="Harga"
                name="Harga"
                value={formatCurrency(product.price.toString())}
                className="input mt-1 bg-purple-50 font-medium text-purple-700"
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                htmlFor="Stok"
                className="block text-sm font-medium text-gray-700"
              >
                Stok
              </label>
              <input
                type="number"
                id="Stok"
                name="Stok"
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

          <div className="pt-4">
            <button type="submit" className="btn btn-primary w-full">
              {initialProduct ? 'Update Produk' : 'Tambah Produk'}
            </button>
          </div>
        </div>

        <div>
          <RecipeBuilder
            ingredients={ingredients}
            recipeIngredients={recipeIngredients}
            onChange={handleRecipeChange}
          />
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
