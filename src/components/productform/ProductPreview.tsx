import React, { useEffect, useState } from 'react';
import { Product } from '../../types/api';
import { formatCurrency } from '../../lib/utils';
import { CheckCircle2, XCircle } from 'lucide-react';
import * as categoryService from '../../services/categoryService';

interface ProductPreviewProps {
  product: Partial<Product>;
}

const ProductPreview: React.FC<ProductPreviewProps> = ({
  product,
}) => {
  const [categoryName, setCategoryName] = useState<string>('Loading...');

  useEffect(() => {
    const loadCategoryName = async () => {
      const name = await categoryService.getCategoryName(product.category_id);
      setCategoryName(name);
    };

    loadCategoryName();
  }, [product.category_id]);

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Image */}
          <div className="w-full md:w-1/3">
            <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
              {product.thumbnail_id ? (
                <img
                  src={product.thumbnail_id}
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

          {/* Product Details */}
          <div className="w-full md:w-2/3">
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-lg font-semibold">{product.name || 'Untitled Product'}</h3>
                <p className="text-gray-500">{categoryName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500">Status</span>
                  <div className="flex items-center gap-2">
                    {product.is_active ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-green-500">Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-red-500">Inactive</span>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-gray-500">Price</span>
                  <p className="font-semibold">{formatCurrency(product.price || 0)}</p>
                </div>
              </div>

              {product.description && (
                <div>
                  <span className="text-gray-500">Description</span>
                  <p className="text-sm">{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPreview;
