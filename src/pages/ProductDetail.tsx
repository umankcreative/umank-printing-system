import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Clock, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { productService } from '../services/productService';
import { Product } from '../types/api';
import { TaskTemplate } from '../types/api';

const ProductDetail: React.FC = () => {
  const backendBaseURL = 'http://127.0.0.1:8000';
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // console.log('backendBaseURL', import.meta.env);
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await productService.getProduct(id);
        console.log('Product response:', response);
        setProduct(response);
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-gray-600 mb-4">
          {error || 'Product not found.'}
        </p>
        <button
          onClick={() => navigate('/admin/products')}
          className="btn btn-primary"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {product.name}
          </h1>
        </div>
        <Link
          to={`/admin/products/edit/${product.id}`}
          className="btn btn-secondary flex items-center"
        >
          <Edit size={18} className="mr-2" /> Edit Produk
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Images */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Gambar Produk
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Thumbnail */}
            {product.thumbnail_id && (
              <div className="relative col-span-2 aspect-square">
                <img
                  src={product.thumbnail_id}
                  alt={`${product.name} thumbnail`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  Thumbnail
                </div>
              </div>
            )}
            
            {/* Additional Images */}
            {product.additional_images?.map((image) => (
                <div key={image.id} className="relative aspect-square z-0">
                <img
                  src={`${backendBaseURL}${image.url}`}
                  alt={`${product.name} additional`}
                  className="w-full h-full object-cover rounded-lg"
                />
                </div>
            ))}

            {/* Show message if no images */}
            {(!product.thumbnail_id && (!product.additional_images || product.additional_images.length === 0)) && (
              <div className="col-span-2 h-48 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">No images available</p>
              </div>
            )}
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Informasi Produk
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Deskripsi</h3>
                <p className="mt-1 text-gray-800">{product.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Harga Modal
                  </h3>
                  <p className="mt-1 text-lg font-semibold text-gray-800">
                    {formatCurrency(product.cost_price)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Harga Jual
                  </h3>
                  <p className="mt-1 text-lg font-semibold text-purple-600">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Minimum Order
                  </h3>
                  <p className="mt-1 text-gray-800">{product.min_order}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Stok</h3>
                  <p className="mt-1">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        (product.stock ?? 0) > 100
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {product.stock}
                    </span>
                  </p>
                </div>
              </div>

              {/* Additional Product Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Jenis Kertas
                  </h3>
                  <p className="mt-1 text-gray-800">{product.paper_type || '-'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Gramasi Kertas
                  </h3>
                  <p className="mt-1 text-gray-800">{product.paper_grammar || '-'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Jenis Print
                  </h3>
                  <p className="mt-1 text-gray-800">{product.print_type || '-'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Finishing
                  </h3>
                  <p className="mt-1 text-gray-800">
                    {product.finishing_type === 'Lainnya'
                      ? product.custom_finishing
                      : product.finishing_type || '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recipe/Ingredients */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-md font-semibold text-gray-800 mb-4">
              Bahan Produk (Resep)
            </h2>
            {!product.ingredients || product.ingredients.length === 0 ? (
              <p className="text-gray-500 text-sm">No ingredients added to this product.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="table-header px-4 py-3 text-left text-sm">
                        No
                      </th>
                      <th className="table-header px-4 py-3 text-left text-sm">
                        Nama Bahan
                      </th>
                      <th className="table-header px-4 py-3 text-center text-sm">
                        Jumlah
                      </th>
                      <th className="table-header px-4 py-3 text-left text-sm">
                        Unit
                      </th>
                      <th className="table-header px-4 py-3 text-left text-sm">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {product.ingredients?.map((item, index) => {
                      console.log('Rendering ingredient:', item);
                      return (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{index + 1}</td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-800 text-sm">
                              {item.name}
                            </div>
                            <div className="text-gray-500 text-xs">
                              {item.description}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center text-sm">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {item.unit}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {item.notes}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Tasks Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Tugas Produksi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.ingredients?.map((ingredient) =>
                ingredient.task_templates?.map((task: TaskTemplate) => (
                  <div
                    key={task.id}
                    className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {task.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {task.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        <span>{task.estimated_time} Menit</span>
                      </div>
                      {task.priority && (
                        <div className="flex items-center">
                          <AlertCircle size={16} className="mr-1" />
                          <span className="capitalize">{task.priority}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
