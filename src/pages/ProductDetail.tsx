import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Clock, AlertCircle } from 'lucide-react';
import { useProductContext } from '../context/ProductContext';
// import { Task } from '../types';
import { formatCurrency } from '../lib/utils';
const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductWithIngredients } = useProductContext();

  const product = id ? getProductWithIngredients(id) : undefined;

  if (!product) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-gray-600 mb-4">Product not found.</p>
        <button
          onClick={() => navigate('/admin/products')}
          className="btn btn-primary"
        >
          Back to Products
        </button>
      </div>
    );
  }

  // const getTaskStatusColor = (status: Task['status']) => {
  //   switch (status) {
  //     case 'todo':
  //       return 'bg-gray-100 text-gray-800';
  //     case 'in-progress':
  //       return 'bg-blue-100 text-blue-800';
  //     case 'review':
  //       return 'bg-yellow-100 text-yellow-800';
  //     case 'completed':
  //       return 'bg-green-100 text-green-800';
  //     default:
  //       return 'bg-gray-100 text-gray-800';
  //   }
  // };

  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'short',
  //     day: 'numeric',
  //   });
  // };

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
            {product.images &&
              product.images.map((image) => (
                <div key={image.id} className="relative aspect-square">
                  <img
                    src={image.url}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
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
                    {formatCurrency(product.price)}
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
                  <p className="mt-1 text-gray-800">{product.minOrder}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Stok</h3>
                  <p className="mt-1">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        product.stock > 100
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {product.stock}
                    </span>
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
                    <th className="table-header px-4 py-3 text-right text-sm">
                      Harga
                    </th>
                    <th className="table-header px-4 py-3 text-right text-sm">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {product.ingredients?.map((item, index) => {
                    const totalPrice =
                      item.ingredient.price_per_unit *
                      item.quantity;
                    return (
                      <tr key={item.ingredient.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{index + 1}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-800 text-sm">
                            {item.ingredient.name}
                          </div>
                          <div className=" text-gray-500 text-xs">
                            {item.ingredient.unit}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-sm">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-right text-sm">
                          {formatCurrency(item.ingredient.price_per_unit)}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-sm">
                          {formatCurrency(totalPrice.toString())}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Tugas Produksi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.ingredients?.map((item) =>
                item.ingredient.taskTemplates?.map((task, index) => (
                  <div
                    key={index}
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
                        <span>{task.estimatedTime} Menit</span>
                      </div>
                      {task.priority && (
                        <div className="flex items-center">
                          <AlertCircle size={16} className="mr-1" />
                          <span className="capitalize">{task.priority}</span>
                        </div>
                      )}
                    </div>

                    {/* {taskTemplate.subtasks && taskTemplate.subtasks.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center text-sm text-gray-600">
                          <CheckSquare size={16} className="mr-1" />
                          <span>
                            {
                              task.subtasks.filter((st) => st.status === 'done')
                                .length
                            }{' '}
                            of {task.subtasks.length} subtasks completed
                          </span>
                        </div>
                      </div>
                    )} */}
                  </div>
                ))
              )}

              {!product.ingredients?.some(
                (item) => (item.ingredient.taskTemplates?.length ?? 0) > 0
              ) && (
                <div className="lg:col-span-3 text-center py-8 text-gray-500">
                  No tasks found for this product's ingredients
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
