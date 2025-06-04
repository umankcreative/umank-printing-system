
import React from 'react';
// import { useOrders } from '../../types/api';
import { useOrderContext } from '../../context/OrderContext';

interface Customer {
  name?: string;
}

interface Order {
  id: string;
  customers?: Customer;
  order_date: string;
  total_amount?: number;
}

interface OrderSelectionProps {
  onOrderSelect?: (order: Order) => void;
  selectedOrderId?: string | null;
}

const OrderSelection: React.FC<OrderSelectionProps> = ({ onOrderSelect, selectedOrderId }) => {
  const { orders, loading } = useOrderContext();

  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const orderId = e.target.value;
    const selectedOrder = orders.find((o: Order) => o.id === orderId);
    
    if (selectedOrder && onOrderSelect) {
      onOrderSelect(selectedOrder);
    }
  };

  const formatOrderDisplay = (order: Order): string => {
    const customerName = order.customers?.name || 'Pelanggan Tidak Diketahui';
    const orderDate = new Date(order.order_date).toLocaleDateString();
    return `${customerName} - ${orderDate} (Rp ${order.total_amount?.toLocaleString() || '0'})`;
  };

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold mb-4">Pilih Pesanan</h2>
      <div className="mb-4">
        <label htmlFor="orderSelect" className="block text-sm font-medium text-gray-700 mb-2">
          Pilih pesanan yang ada untuk membuat faktur
        </label>
        <select
          id="orderSelect"
          value={selectedOrderId || ''}
          onChange={handleOrderChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        >
          <option value="">Pilih pesanan...</option>
          {orders.map((order: Order) => (
            <option key={order.id} value={order.id}>
              {formatOrderDisplay(order)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default OrderSelection;
