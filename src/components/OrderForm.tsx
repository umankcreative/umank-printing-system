import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { Order, OrderItem, Product as LocalProduct, Customer } from '../types';
import { Product as ApiProduct } from '../types/api';
import { useCustomerContext } from '../context/CustomerContext';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/productService';
import { Plus, Trash2, Search, ToggleLeft, ToggleRight } from 'lucide-react';
import { formatCurrency, isValidUUID } from '../lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';

const mapApiProductToLocal = (apiProduct: ApiProduct): LocalProduct => ({
  id: apiProduct.id,
  name: apiProduct.name,
  description: apiProduct.description || '',
  category: apiProduct.category?.name || 'Unknown Category',
  category_id: apiProduct.category_id,
  price: parseFloat(apiProduct.price),
  cost_price: parseFloat(apiProduct.cost_price),
  stock: apiProduct.stock,
  minOrder: apiProduct.min_order,
  isActive: apiProduct.is_active,
  branch_id: apiProduct.branch_id,
  thumbnail_id: apiProduct.thumbnail_id,
  paperType: apiProduct.paper_type,
  paperGrammar: apiProduct.paper_grammar,
  printType: apiProduct.print_type,
  finishingType: apiProduct.finishing_type,
  customFinishing: apiProduct.custom_finishing,
  created_at: apiProduct.created_at || new Date().toISOString(),
  updated_at: apiProduct.updated_at || new Date().toISOString(),
});

interface OrderFormProps {
  onSubmit: (order: Order) => Promise<void>;
  onCancel: () => void;
  initialOrder?: Order;
}

const OrderForm: React.FC<OrderFormProps> = ({
  onSubmit,
  onCancel,
  initialOrder,
}) => {
  const { customers, addCustomer } = useCustomerContext();
  const { user } = useAuth();
  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [isNewCustomer, setIsNewCustomer] = useState(!initialOrder?.customer.id);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');

  // Initialize customer state with initialOrder data if available
  const [customer, setCustomer] = useState<Customer>(
    initialOrder?.customer || {
      id: '',
      name: '',
      email: '',
      phone: '',
      company: '',
      contact: '',
      address: '',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  );

  // Initialize order items with initialOrder data if available
  const [orderItems, setOrderItems] = useState<OrderItem[]>(
    initialOrder?.items || []
  );

  // Initialize order details with initialOrder data if available
  const [orderDetails, setOrderDetails] = useState({
    delivery_date: initialOrder?.delivery_date ? new Date(initialOrder.delivery_date).toISOString().split('T')[0] : '',
    notes: initialOrder?.notes || '',
    payment_method: initialOrder?.payment_method || 'cash',
    payment_status: initialOrder?.payment_status || 'unpaid',
  });

  // Update form data when initialOrder changes
  useEffect(() => {
    if (initialOrder) {
      setCustomer(initialOrder.customer);
      setOrderItems(initialOrder.items);
      setOrderDetails({
        delivery_date: initialOrder.delivery_date ? new Date(initialOrder.delivery_date).toISOString().split('T')[0] : '',
        notes: initialOrder.notes || '',
        payment_method: initialOrder.payment_method || 'cash',
        payment_status: initialOrder.payment_status || 'unpaid',
      });
      setIsNewCustomer(false);
    }
  }, [initialOrder]);

  // Debounce search term for products
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Memoize filtered customers
  const filteredCustomers = useMemo(() => 
    customers.filter((c) =>
      c.name.toLowerCase().includes(customerSearchTerm.toLowerCase())
    ),
    [customers, customerSearchTerm]
  );

  const handleCustomerChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'name') {
      setCustomerSearchTerm(value);
      const matchingCustomers = customers.filter(c => 
        c.name.toLowerCase().includes(value.toLowerCase())
      );
      
      if (matchingCustomers.length > 0) {
        setShowCustomerSearch(true);
        setIsNewCustomer(false);
      } else {
        setShowCustomerSearch(false);
        setIsNewCustomer(true);
        // Clear other fields if it's a new customer
        setCustomer({
          name: value,
          email: '',
          phone: '',
          company: '',
          contact: '',
          address: '',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          id: '' // This will be set by the backend
        });
        return;
      }
    }
    
    setCustomer((prev) => ({
      ...prev,
      [name]: value,
      updated_at: new Date().toISOString(),
    }));
  }, [customers]);

  const selectCustomer = useCallback((selectedCustomer: Customer) => {
    // Validate customer ID
    if (!selectedCustomer.id || !isValidUUID(selectedCustomer.id)) {
      toast.error('Invalid customer ID format. Please select a valid customer from the list.');
      return;
    }

    setCustomer(selectedCustomer);
    setShowCustomerSearch(false);
    setIsNewCustomer(false);
    setCustomerSearchTerm('');
  }, []);

  // Fetch products only when debounced search term changes
  useEffect(() => {
    const fetchProducts = async () => {
      if (!showProductSelector) return; // Only fetch when product selector is open
      
      try {
        setLoading(true);
        const response = await productService.getProducts({
          search: debouncedSearchTerm || undefined,
          is_active: true,
        });
        setApiProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedSearchTerm, showProductSelector]);

  const handleAddProduct = (apiProduct: ApiProduct) => {
    // Validate product ID from API
    if (!apiProduct.id || !isValidUUID(apiProduct.id)) {
      toast.error('Invalid product ID format from server');
      return;
    }

    const product = mapApiProductToLocal(apiProduct);
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
        id: crypto.randomUUID(), // This is temporary and will be replaced by server
        order_id: '', // Will be set by server
        product_id: product.id, // This is the valid UUID from server
        quantity: product.minOrder,
        price: product.price,
        product,
      };
      setOrderItems((prev) => [...prev, newItem]);
    }
    setShowProductSelector(false);
    setSearchTerm('');
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setOrderItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity: newQuantity, updated_at: new Date().toISOString() }
          : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.branch_id) {
      toast.error('No branch ID found. Please contact your administrator.');
      return;
    }

    try {
      let finalCustomer = customer;

      if (isNewCustomer) {
        // Handle new customer creation
        if (!customer.email || !customer.phone) {
          toast.error('Email and phone are required for new customers');
          return;
        }

        try {
          const newCustomerPayload = {
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            company: customer.company,
            contact: customer.contact,
            address: customer.address,
            is_active: customer.is_active,
          };

          const createdCustomer = await addCustomer(newCustomerPayload);
          finalCustomer = {
            id: createdCustomer.id,
            name: createdCustomer.name,
            email: createdCustomer.email,
            phone: createdCustomer.phone,
            company: createdCustomer.company,
            contact: createdCustomer.contact,
            address: createdCustomer.address,
            is_active: createdCustomer.is_active,
            created_at: createdCustomer.created_at,
            updated_at: createdCustomer.updated_at,
          };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to create customer';
          toast.error(message);
          return;
        }
      } else {
        // For existing customer, verify we have a valid UUID
        if (!customer.id || !isValidUUID(customer.id)) {
          toast.error('Invalid customer ID format. Please select a valid customer from the list.');
          return;
        }
      }

      // Validate all product IDs
      const invalidProducts = orderItems.filter(
        item => !item.product_id || !isValidUUID(item.product_id)
      );

      if (invalidProducts.length > 0) {
        toast.error('One or more products have invalid ID format. Please ensure all products are selected from the list.');
        return;
      }

      const order: Order = {
        id: initialOrder?.id || '', // Will be set by server for new orders
        customer: finalCustomer,
        branch: initialOrder?.branch || {
          id: user.branch_id,
          name: '',
          location: '',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        items: orderItems.map(item => ({
          ...item,
          id: item.id || '', // Will be set by server for new items
          order_id: initialOrder?.id || '', // Will be set by server for new orders
        })),
        total_amount: orderItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ).toString(),
        status: initialOrder?.status || 'pending',
        payment_status: orderDetails.payment_status || 'unpaid',
        payment_method: orderDetails.payment_method || 'cash',
        delivery_date: orderDetails.delivery_date ? new Date(orderDetails.delivery_date).toISOString() : new Date().toISOString(),
        notes: orderDetails.notes || null,
        created_at: initialOrder?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        branch_id: user.branch_id,
      };

      await onSubmit(order);
    } catch (error) {
      console.error('Error creating order:', error);
      const message = error instanceof Error ? error.message : 'Failed to create order';
      toast.error(message);
    }
  };

  const filteredProducts = apiProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log('Filtered customers:', filteredCustomers); // Debug log

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Informasi Pelanggan</h2>
          <div className="flex items-center gap-4">
            {isNewCustomer && customer.name && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Pelanggan Baru
              </span>
            )}
            <div
              onClick={() =>
                setCustomer((prev) => ({
                  ...prev,
                  is_active: !prev.is_active,
                }))
              }
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setCustomer((prev) => ({
                    ...prev,
                    is_active: !prev.is_active,
                  }));
                }
              }}
            >
              {customer.is_active ? (
                <div className="flex items-center">
                  <span className="mr-2 text-sm text-green-600">
                    Active
                  </span>
                  <ToggleRight className="h-8 w-8 text-green-500" />
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="mr-2 text-sm text-red-500">
                    Inactive
                  </span>
                  <ToggleLeft className="h-8 w-8 text-red-400" />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <Label htmlFor="name">Nama</Label>
            <div className="relative">
              <Input
                id="name"
                name="name"
                value={customer.name}
                onChange={handleCustomerChange}
                required
                className="w-full"
                placeholder="Ketik nama untuk mencari pelanggan..."
                autoComplete="off"
              />
              {showCustomerSearch && filteredCustomers.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border">
                  <div className="max-h-60 overflow-auto py-1">
                    {filteredCustomers.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                        onClick={() => selectCustomer(c)}
                      >
                        <div className="font-medium">{c.name}</div>
                        <div className="text-sm text-gray-500">
                          {c.company ? `${c.company} - ` : ''}{c.email}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="company">Perusahaan</Label>
            <Input
              id="company"
              name="company"
              value={customer.company}
              onChange={handleCustomerChange}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={customer.email}
              onChange={handleCustomerChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Telepon</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={customer.phone}
              onChange={handleCustomerChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="contact">Kontak Alternatif</Label>
            <Input
              id="contact"
              name="contact"
              value={customer.contact}
              onChange={handleCustomerChange}
            />
          </div>
          <div>
            <Label htmlFor="address">Alamat</Label>
            <Input
              id="address"
              name="address"
              value={customer.address}
              onChange={handleCustomerChange}
              required
            />
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Produk</h2>
          <Button
            type="button"
            onClick={() => setShowProductSelector(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tambah Produk
          </Button>
        </div>

        {orderItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Belum ada produk ditambahkan
          </div>
        ) : (
          <div className="space-y-4">
            {orderItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">
                    {formatCurrency(item.price)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                      className="p-1 rounded-md hover:bg-gray-100"
                    >
                      -
                    </button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, parseInt(e.target.value))
                      }
                      className="w-16 text-center"
                      min="1"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                      className="p-1 rounded-md hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-4 border-t">
              <div className="text-right">
                <span className="text-gray-500">Total:</span>{' '}
                <span className="font-semibold">
                  {formatCurrency(
                    orderItems.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0
                    )
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Details */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">Detail Pesanan</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="delivery_date">Tanggal Pengiriman</Label>
            <Input
              id="delivery_date"
              type="date"
              value={orderDetails.delivery_date}
              onChange={(e) =>
                setOrderDetails((prev) => ({
                  ...prev,
                  delivery_date: e.target.value,
                }))
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="payment_method">Metode Pembayaran</Label>
            <select
              id="payment_method"
              value={orderDetails.payment_method || 'cash'}
              onChange={(e) =>
                setOrderDetails((prev) => ({
                  ...prev,
                  payment_method: e.target.value as 'cash' | 'transfer' | 'other',
                }))
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="cash">Cash</option>
              <option value="transfer">Transfer</option>
              <option value="other">Lainnya</option>
            </select>
          </div>
          <div>
            <Label htmlFor="payment_status">Status Pembayaran</Label>
            <select
              id="payment_status"
              value={orderDetails.payment_status || 'unpaid'}
              onChange={(e) =>
                setOrderDetails((prev) => ({
                  ...prev,
                  payment_status: e.target.value as 'unpaid' | 'partial' | 'paid',
                }))
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="unpaid">Belum Dibayar</option>
              <option value="partial">Sebagian</option>
              <option value="paid">Lunas</option>
            </select>
          </div>
          <div>
            <Label htmlFor="notes">Catatan</Label>
            <Input
              id="notes"
              value={orderDetails.notes}
              onChange={(e) =>
                setOrderDetails((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
              placeholder="Tambahkan catatan pesanan (opsional)"
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <button className='btn btn-outline-danger btn-sm' onClick={onCancel}>
          Batal
        </button>
        <button className='btn btn-outline-primary btn-sm' type="submit">Simpan Pesanan</button>
      </div>

      {/* Product Selector Dialog */}
      <Dialog open={showProductSelector} onOpenChange={setShowProductSelector}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pilih Produk</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="grid grid-cols-1 gap-2 mt-4 max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="text-center py-4 text-gray-500">Loading...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No products found</div>
            ) : (
              filteredProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleAddProduct(product)}
                  className="flex justify-between items-left p-3 my-auto hover:bg-gray-50 rounded-lg border text-left"
                >
                  <div className='rounded-full overflow-hidden aspect-auto h-full'>
                    {product.thumbnail_id && (
                      <img
                        src={product.thumbnail_id}
                        alt={product.name}
                        className="w-10 h-10 object-cover"
                      />
                    )}
                  </div>
                  <div className='px-2 w-full'>
                    <h3 className="font-medium text-left">{product.name}</h3>
                    <p className="text-sm text-gray-500 text-left">
                      {formatCurrency(parseFloat(product.price))}
                    </p>
                  </div>
                  <Plus className="w-4 h-4 my-auto" />
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default OrderForm;
