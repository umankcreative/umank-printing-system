import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import OrderForm from '../components/OrderForm';
import { Order } from '../types';
import { useOrderContext } from '../context/OrderContext';
import { formatCurrency } from '../lib/utils';

const Orders: React.FC = () => {
  const { orders, addOrder } = useOrderContext();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(
    (order) =>
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (order: Order) => {
    addOrder(order);
    setShowOrderForm(false);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          Orders
        </h1>

        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders..."
              className="input pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <button
            className="btn btn-primary flex items-center justify-center"
            onClick={() => setShowOrderForm(true)}
          >
            <Plus size={20} className="mr-2" /> New Order
          </button>
        </div>
      </div>

      {showOrderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">New Order</h2>
            <OrderForm
              onSubmit={handleSubmit}
              onCancel={() => setShowOrderForm(false)}
            />
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="table-header px-6 py-3 text-left">ID Order</th>
                <th className="table-header px-6 py-3 text-left">Customer</th>
                <th className="table-header px-6 py-3 text-left">Tanggal</th>
                <th className="table-header px-6 py-3 text-left">
                  Tanggal Kirim
                </th>
                <th className="table-header px-6 py-3 text-center">Status</th>
                <th className="table-header px-6 py-3 text-right">Total</th>
                <th className="table-header px-6 py-3 text-center">Tugas</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      #{order.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.customer.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.customer.contact}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.order_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.delivery_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'processing'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'ready'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'delivered'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                    {formatCurrency(order.total_amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm font-medium text-gray-600">
                      {order.tasks?.length || 0} tasks
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;