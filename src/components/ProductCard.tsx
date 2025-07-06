import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MoreVertical, Edit, Trash, EyeIcon, CopyCheck } from 'lucide-react';
import { Product } from '../types/api';
import { formatCurrency } from '../lib/utils';
import { Button } from '../components/ui/button';

interface ProductCardProps {
  // key: string;
  product: Product;
  onDelete: (product: Product) => void;
  onClone: (product: Product) => void;
  // onEdit?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete, onClone }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

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
        <Button
          onClick={() => setShowDropdown(!showDropdown)}
          className="absolute top-2 right-2 p-1 hover:bg-black/5 rounded-full mouse-pointer  hover:-translate-x-1 hover:scale-150 transition-transform duration-200"
        >
          <MoreVertical className="h-5 w-5 text-gray-200  " />
        </Button>
        {showDropdown && (
          <div className="absolute top-10 right-2 bg-white rounded-lg shadow-lg border py-1 z-10">
            <button
              onClick={() => onClone(product)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <CopyCheck className="h-4 w-4 mr-2" />
              Clone
            </button>
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
        <h3 onClick={() => navigate(`/admin/products/${product.id}`)} className="font-medium text-gray-900 cursor-pointer"   >{product.name}</h3>
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
            <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              parseInt(product.stock.toString()) > 100
                ? 'bg-green-100 text-green-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >{product.stock}</span>
          </div>
        </div>
        <div className="mt-4 hidden justify-center space-x-2">
          <Button
            onClick={() => onClone?.(product)}
            className="btn btn-sm btn-outline-success flex items-center"
          >
              <CopyCheck size={18} /> Clone
            </Button>
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
