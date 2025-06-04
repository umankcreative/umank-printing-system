import React, { useEffect, useState } from 'react';
import { Product } from '../types/api';
import { formatCurrency } from '../lib/utils';
import { CheckCircle2, XCircle } from 'lucide-react';
import * as categoryService from '../services/categoryService';

interface ProductPreviewProps {
  product: Product;
  dimensions?: { width: number; height: number };
  materialEnabled?: {
    paper?: boolean;
    printing?: boolean;
    finishing?: boolean;
  };
}

export const ProductPreview = ({
  product,
  materialEnabled = {
    paper: false,
    printing: false,
    finishing: false,
  },
}: ProductPreviewProps) => {
  const [categoryName, setCategoryName] = useState<string>('Loading...');

  useEffect(() => {
    const fetchCategoryName = async () => {
      const name = await categoryService.getCategoryName(product.category_id);
      setCategoryName(name);
    };

    fetchCategoryName();
  }, [product.category_id]);

  const calculateTotalCost = () => {
    if (!product.ingredients) return 0;
    
    return product.ingredients.reduce((total, ingredient) => {
      const quantity = parseFloat(ingredient.quantity) || 0;
      const pricePerUnit = parseFloat(ingredient.price_per_unit) || 0;
      return total + (quantity * pricePerUnit);
    }, 0);
  };

  const totalCost = calculateTotalCost();
  const price = parseFloat(product.price || '0');
  const margin = price - totalCost;
  const marginPercentage = totalCost > 0 ? ((margin / totalCost) * 100).toFixed(1) : '0';

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 className="text-md font-semibold text-gray-800">
          Pratinjau Produk
        </h3>
        <p className="text-xs text-gray-500">
          Tampilan produk seperti yang akan terlihat di toko
        </p>
      </div>

      <div className="p-0">
          <div className="w-full items-center justify-center">
            <div className="bg-gray-100  w-full">
              {/* Product Image */}
              <div className="w-full">
                <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
                  {product.thumbnail?.url ? (
                    <img
                      src={product.thumbnail.url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No image</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        <div className="flex flex-col md:flex-row gap-6 m-4 w-full">
          {/* Product Information */}
          <div className="w-full m-2 pr-4 md:m-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {product.name || 'Product Name'}
            </h3>

            <div className="flex items-center mb-3">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {categoryName || 'Kategori'}
              </span>
              <span className="ml-2 inline-flex items-center">
                {product.is_active ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">Active</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-3.5 w-3.5 text-red-500 mr-1" />
                    <span className="text-xs text-red-600">Inactive</span>
                  </>
                )}
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {product.description || 'Product description will appear here.'}
            </p>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
              <div className="col-span-2">
                <span className="text-sm font-medium text-gray-500">
                  Specifications:
                </span>
              </div>
              {materialEnabled.paper &&  (
                <div>
                  <span className="text-xs text-gray-500">Paper:</span>
                  <span className="text-xs text-gray-700 ml-1">
                    {product.paper_type} {product.paper_grammar || ''}
                  </span>
                </div>
              )}
              {/* {dimensions.width > 0 && dimensions.height > 0 && (
                <div>
                  <span className="text-xs text-gray-500">Size:</span>
                  <span className="text-xs text-gray-700 ml-1">
                    {dimensions.width} cm × {dimensions.height} cm
                  </span>
                </div>
              )} */}
              {materialEnabled.printing && (
                <div>
                  <span className="text-xs text-gray-500">Print:</span>
                  <span className="text-xs text-gray-700 ml-1">
                    {product.print_type}
                  </span>
                </div>
              )}
              {materialEnabled.finishing && (
                <div>
                  <span className="text-xs text-gray-500">Finishing:</span>
                  <span className="text-xs text-gray-700 ml-1">
                    {product.finishing_type === 'Lainnya'
                      ? product.custom_finishing
                      : product.finishing_type}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-gray-500">Stock:</p>
                <p className="text-sm font-medium text-gray-700">
                  {product.stock || 0} units
                </p>
              </div>
              <div className="text-right space-y-1">
                <div>
                  <p className="text-xs text-gray-500">Cost:</p>
                  <p className="text-sm font-medium text-gray-600">
                    {formatCurrency(totalCost)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Price:</p>
                  <p className="text-xl font-bold text-blue-600">
                    {formatCurrency(price)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Margin:</p>
                  <p className={`text-sm font-medium ${margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(margin)} ({marginPercentage}%)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPreview;
