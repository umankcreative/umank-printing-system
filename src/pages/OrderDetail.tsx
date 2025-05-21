import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Package, User,  Clock, FileText, Truck } from 'lucide-react';
import { useOrderContext } from '../context/OrderContext';
import { formatCurrency } from '../lib/utils';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrder } = useOrderContext();
  const order = id ? getOrder(id) : undefined;

  if (!order) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Order not found</h2>
          <p className="text-gray-500 mb-6">The order you're looking for doesn't exist or has been deleted.</p>
          <button onClick={() => navigate('/admin/orders')} className="btn btn-primary">
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/admin/orders')}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Order #{order.id.slice(0, 8)}
            </h1>
            <p className="text-sm text-gray-500">
              Created on {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Package className="mr-2" size={20} />
              Order Items
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Produk</th>
                    <th className="text-center py-3 px-4">Jumlah</th>
                    <th className="text-right py-3 px-4">Harga</th>
                    <th className="text-right py-3 px-4">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          {item.product.thumbnail_id && (
                            <img
                              src={item.product.thumbnail_id}
                              alt={item.product.name}
                              className="w-12 h-12 object-cover rounded-md mr-3"
                            />
                          )}
                          <div>
                            <h3 className="font-medium">{item.product.name}</h3>
                            <p className="text-sm text-gray-500">{item.product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">{item.quantity}</td>
                      <td className="py-4 px-4 text-right">{formatCurrency(item.price)}</td>
                      <td className="py-4 px-4 text-right font-medium">
                        {formatCurrency((item.price * item.quantity).toString())}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t">
                    <td colSpan={3} className="py-4 px-4 text-right font-medium">
                      Total Amount:
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-purple-600">
                      {formatCurrency(order.total_amount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Tasks */}
          {order.tasks && order.tasks.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <FileText className="mr-2" size={20} />
                Related Tasks
              </h2>
              <div className="space-y-3">
                {order.tasks.map((task) => (
                  <Link
                    key={task.id}
                    to={`/admin/tasks/${task.id}`}
                    className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{task.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock size={14} className="mr-1" />
                      <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <User className="mr-2" size={20} />
              Customer Details
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Name</label>
                <p className="font-medium">{order.customer.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Contact</label>
                <p className="font-medium">{order.customer.contact}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Address</label>
                <p className="font-medium">{order.customer.address}</p>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Truck className="mr-2" size={20} />
              Delivery Information
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Order Date</label>
                <p className="font-medium">
                  {new Date(order.order_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Delivery Date</label>
                <p className="font-medium">
                  {new Date(order.delivery_date).toLocaleDateString()}
                </p>
              </div>
              {order.notes && (
                <div>
                  <label className="text-sm text-gray-500">Notes</label>
                  <p className="font-medium">{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;