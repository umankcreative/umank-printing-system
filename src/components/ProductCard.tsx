import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical, Edit, Trash, EyeIcon } from 'lucide-react';
import { Product } from '../types/api';
import { formatCurrency } from '../lib/utils';

interface ProductCardProps {
  product: Product;
  onDelete: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border relative">
      <div className="relative">
        <div className="aspect-square rounded-t-lg overflow-hidden bg-gray-100">
          {product.thumbnail_id && (
            <img
              src={product.thumbnail_id}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="absolute top-2 left-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              product.is_active
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {product.is_active ? 'Aktif' : 'Nonaktif'}
          </span>
        </div>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="absolute top-2 right-2 p-1 hover:bg-black/5 rounded-full"
        >
          <MoreVertical className="h-5 w-5 text-gray-600" />
        </button>
        {showDropdown && (
          <div className="absolute top-10 right-2 bg-white rounded-lg shadow-lg border py-1 z-10">
            <Link
              to={`/admin/products/edit/${product.id}`}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
            <button
              onClick={() => onDelete(product)}
              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
            >
              <Trash className="h-4 w-4 mr-2" />
              Hapus
            </button>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900">{product.name}</h3>
        <div className="mt-1 flex items-center gap-1">
          <span className="text-sm text-gray-500">{product.category?.name || ''}</span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Harga</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(product.price)}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm text-gray-500">Stok</span>
            <span className="font-medium text-gray-900">{product.stock}</span>
          </div>
        </div>
        <div className="mt-4 flex justify-center space-x-2">
          <Link
            to={`/admin/products/${product.id}`}
            className="btn btn-sm btn-outline-secondary flex items-center"
          >
            <EyeIcon size={16} className="mr-1" />
          </Link>
          <Link
            to={`/admin/products/edit/${product.id}`}
            className="btn btn-sm btn-outline-primary flex items-center"
          >
            <Edit size={16} className="mr-1" />
          </Link>
          <button
            onClick={() => onDelete(product)}
            className="btn btn-sm btn-outline-danger flex items-center"
          >
            <Trash size={16} className="mr-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
