import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Edit, EyeIcon, Trash2 } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../lib/utils';

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="relative aspect-video">
        {product.thumbnail_id ? (
          <img
            src={product.thumbnail_id}
            alt={product.NamaProduk}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              product.isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {product.isActive ? 'Aktif' : 'Nonaktif'}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
          {product.NamaProduk}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.Deskripsi}
        </p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">{product.category}</span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              parseInt(product.Stok) > 100
                ? 'bg-green-100 text-green-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            Stok: {product.Stok}
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Harga Modal:</span>
            <span className="text-gray-700">
              {formatCurrency((product.HargaModal).toString())}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Harga Jual:</span>
            <span className="font-medium text-purple-600">
              {formatCurrency(parseInt(product.Harga).toString())}
            </span>
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Link
            to={`/admin/products/${product.id}`}
            className="btn btn-sm btn-outline-primary"
          >
            <EyeIcon size={16} className="mr-1" /> Detail
          </Link>
          <Link
            to={`/admin/products/edit/${product.id}`}
            className="btn btn-sm btn-outline-primary"
          >
            <Edit size={16} className="mr-1" /> Edit
          </Link>
          <button
            onClick={() => onDelete(product.id)}
            className="btn btn-sm btn-outline-danger"
          >
            <Trash2 size={16} className="mr-1" /> Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductCard);
