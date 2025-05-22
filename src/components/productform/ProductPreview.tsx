import React from 'react';
import { Product } from '../../types/product';
import { formatCurrency } from '../../utils/productUtils';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ProductPreviewProps {
  product: Partial<Product>;
  dimensions: { width: number; height: number };
}

const ProductPreview: React.FC<ProductPreviewProps> = ({
  product,
  dimensions,
}) => {
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

      <div className="p-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Image */}
          <div className="w-full md:w-1/3">
            <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
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

          {/* Product Information */}
          <div className="w-full md:w-2/3">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {product.name || 'Product Name'}
            </h3>

            <div className="flex items-center mb-3">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {product.category || 'Category'}
              </span>
              <span className="ml-2 inline-flex items-center">
                {product.isActive ? (
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
              <div>
                <span className="text-xs text-gray-500">Paper:</span>
                <span className="text-xs text-gray-700 ml-1">
                  {product.paperType || '-'} {product.paperGrammar || ''}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500">Size:</span>
                <span className="text-xs text-gray-700 ml-1">
                  {dimensions.width} cm × {dimensions.height} cm
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500">Print:</span>
                <span className="text-xs text-gray-700 ml-1">
                  {product.printType || '-'}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500">Finishing:</span>
                <span className="text-xs text-gray-700 ml-1">
                  {product.finishingType === 'Lainnya'
                    ? product.customFinishing
                    : product.finishingType || '-'}
                </span>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-gray-500">Stock:</p>
                <p className="text-sm font-medium text-gray-700">
                  {product.stock || 0} units
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Price:</p>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(product.sellingPrice || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPreview;
