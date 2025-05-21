import React, { useState } from 'react';
import { toast } from 'sonner';
import { Order, Customer, Product, OrderItem } from '../types';
import { useProductContext } from '../context/ProductContext';
import { X, Plus, Trash2, Search } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
interface OrderFormProps {
  onSubmit: (order: Order) => void;
  onCancel: () => void;
  initialOrder?: Order;
}

const OrderForm: React.FC<OrderFormProps> = ({
  onSubmit,
  onCancel,
  initialOrder,
}) => {
  const { products } = useProductContext();
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [customer, setCustomer] = useState<Customer>(
    initialOrder?.customer || {
      id: crypto.randomUUID(),
      name: '',
      contact: '',
      address: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  );

  const [orderItems, setOrderItems] = useState<OrderItem[]>(
    initialOrder?.items || []
  );

  const [orderDetails, setOrderDetails] = useState({
    delivery_date: initialOrder?.delivery_date || '',
    notes: initialOrder?.notes || '',
  });

  const handleCustomerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({
      ...prev,
      [name]: value,
      updated_at: new Date().toISOString(),
    }));
  };

  const handleAddProduct = (product: Product) => {
    const existingItem = orderItems.find(
      (item) => item.product_id === product.id
    );

    if (existingItem) {
      setOrderItems((prev) =>
        prev.map((item) =>
          item.product_id === product.id
            ? {
                ...item,
                quantity: (item.quantity + 1),
                updated_at: new Date().toISOString(),
              }
            : item
        )
      );
    } else {
      const newItem: OrderItem = {
        id: crypto.randomUUID(),
        order_id: initialOrder?.id || crypto.randomUUID(),
        product_id: product.id,
        quantity: product.minOrder,
        price: product.price,
        product: product,
      };
      setOrderItems((prev) => [...prev, newItem]);
    }
    setShowProductSelector(false);
    setSearchTerm('');
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity, updated_at: new Date().toISOString() }
          : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const calculateTotal = (): string => {
    return orderItems
      .reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0)
      .toString();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const order: Order = {
      id: initialOrder?.id || crypto.randomUUID(),
      customer,
      items: orderItems,
      total_amount: parseFloat(calculateTotal()),
      status: initialOrder?.status || 'pending',
      order_date: initialOrder?.order_date || new Date().toISOString(),
      delivery_date: orderDetails.delivery_date,
      notes: orderDetails.notes,
      created_at: initialOrder?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onSubmit(order);
    toast.success('Order berhasil');
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Customer Information
          </h2>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nama
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={customer.name}
              onChange={handleCustomerChange}
              required
              className="input mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="contact"
              className="block text-sm font-medium text-gray-700"
            >
              Contact
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={customer.contact}
              onChange={handleCustomerChange}
              required
              className="input mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Alamat
            </label>
            <textarea
              id="address"
              name="address"
              value={customer.address}
              onChange={handleCustomerChange}
              rows={3}
              required
              className="input mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="delivery_date"
              className="block text-sm font-medium text-gray-700"
            >
              Tanggal Pengiriman
            </label>
            <input
              type="date"
              id="delivery_date"
              name="delivery_date"
              value={orderDetails.delivery_date}
              onChange={(e) =>
                setOrderDetails((prev) => ({
                  ...prev,
                  delivery_date: e.target.value,
                }))
              }
              required
              className="input mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700"
            >
              Catatan
            </label>
            <textarea
              id="notes"
              name="notes"
              value={orderDetails.notes}
              onChange={(e) =>
                setOrderDetails((prev) => ({ ...prev, notes: e.target.value }))
              }
              rows={3}
              className="input mt-1"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Item </h2>
            <button
              type="button"
              onClick={() => setShowProductSelector(true)}
              className="btn btn-primary"
            >
              <Plus size={20} className="mr-2" /> Add Product
            </button>
          </div>

          {showProductSelector && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Pilih Produk</h2>
                  <button
                    type="button"
                    onClick={() => setShowProductSelector(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pr-10"
                  />
                  <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>

                <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() => handleAddProduct(product)}
                    >
                      <div className="flex items-center">
                          {product.thumbnail_id && (
                            <img
                              src={product.thumbnail_id}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-md mr-3"
                            />
                          )}
                      </div>
                      <div className="mr-auto pl-2">
                        <h3 className="text-left font-medium text-purple-600">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {product.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-purple-600">
                          {formatCurrency(product.price.toString())}
                        </p>
                        <p className="text-sm text-gray-500">
                          Stock: {product.stock}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-4">
            {orderItems.length > 0 ? (
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(item.price)} x
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item.id, parseInt(e.target.value))
                          }
                          min="1"
                          className="w-16 mx-2 text-center border rounded"
                        />
                        ={' '}
                        {formatCurrency(
                          (
                            item.price * item.quantity
                          ).toString()
                        )}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total:</span>
                    <span className="text-purple-600">
                      {formatCurrency(calculateTotal())}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Belum ada produk
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Batal
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={orderItems.length === 0}
        >
          {initialOrder ? 'Update Order' : 'Create Order'}
        </button>
      </div>
    </form>
  );
};

export default OrderForm;
