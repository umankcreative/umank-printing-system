import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../lib/utils';

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete }) => {
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0].image
      : 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg';

  return (
    <div className="card card-hover transform transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        <img
          src={imageUrl}
          alt={product.NamaProduk}
          className="w-full text-sm h-48 object-cover"
        />
        <div className="absolute top-0 right-0 p-2">
          <span className="tag bg-purple-500 text-white">
            Stock: {product.Stok}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {product.NamaProduk}
        </h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {product.Deskripsi}
        </p>
        <div className="flex justify-between items-center mt-3">
          <div>
            <p className="text-xs text-gray-500">Harga Modal</p>
            <p className="font-semibold text-gray-700">
              {formatCurrency(product.HargaModal)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Harga Jual</p>
            <p className="font-semibold text-purple-700">
              {formatCurrency(product.Harga)}
            </p>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <Link
            to={`/admin/products/${product.id}`}
            className="btn btn-secondary flex items-center text-sm px-3 py-1"
          >
            <Eye size={16} className="mr-1" /> View
          </Link>
          <Link
            to={`/admin/products/edit/${product.id}`}
            className="btn bg-amber-500 text-white hover:bg-amber-600 flex items-center text-sm px-3 py-1"
          >
            <Edit size={16} className="mr-1" /> Edit
          </Link>
          <button
            onClick={() => onDelete(product.id)}
            className="btn btn-danger flex items-center text-sm px-3 py-1"
          >
            <Trash2 size={16} className="mr-1" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
