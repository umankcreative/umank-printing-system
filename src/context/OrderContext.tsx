// context/OrderContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// Import Order, Task, Product dari definisi lokal Anda, yang sekarang harus konsisten dengan api.ts
import { Order as LocalOrder, Task, Product as LocalProduct } from '../types'; // Menggunakan LocalOrder, Task, LocalProduct
// Import tipe dari api.ts yang spesifik untuk mapping atau payload API
import { Order as ApiOrder, Product as ApiProduct, OrderItem as ApiOrderItem } from '../types/api';
import { useProductContext } from './ProductContext';
import { generateOrderTasks as generateTasks, generateTaskForProduct as generateProductTask, isValidUUID } from '../lib/utils';
// Import CreateOrderPayload dan CreateOrderItemPayload dari orderService.ts yang baru disesuaikan
import orderService, { OrderQueryParams, CreateOrderPayload, CreateOrderItemPayload } from '../services/orderService';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

interface OrderContextProps {
  children: React.ReactNode;
}

interface OrderContextType {
  orders: LocalOrder[];
  tasks: Task[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  addOrder: (order: LocalOrder) => Promise<void>;
  updateOrder: (order: LocalOrder) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  generateOrderTasks: (order: LocalOrder) => Task[];
  generateTaskForProduct: (
    productId: string,
    quantity: string,
    deadline: string,
    orderId?: string,
    parentTaskId?: string
  ) => Task | undefined;
  getOrder: (id: string) => Promise<LocalOrder | undefined>;
  addTaskToOrder: (orderId: string, task: Task) => Promise<void>;
  updateTaskInOrder: (orderId: string, taskId: string, updatedTask: Task) => Promise<void>;
  deleteTaskFromOrder: (orderId: string, taskId: string) => Promise<void>;
  fetchOrders: (params?: OrderQueryParams) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface OrderWithTasks extends LocalOrder {
  tasks?: Task[];
}

const mapApiProductToLocal = (apiProduct: ApiProduct): LocalProduct => ({
  id: apiProduct.id,
  name: apiProduct.name,
  description: apiProduct.description || '',
  category: apiProduct.category?.name || 'Tidak ada kategori', // Sesuaikan jika Category di API memiliki field `name`
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

// Mapping dari ApiOrder ke LocalOrder
const mapApiOrderToLocal = (apiOrder: ApiOrder): LocalOrder => ({
  id: apiOrder.id,
  // Menggunakan properti customer dan branch secara langsung dari apiOrder yang sudah di-eager load
  customer: apiOrder.customer,
  branch: { // Pastikan properti branch diisi dengan benar, api.ts punya `is_active: boolean | number`
    id: apiOrder.branch?.id || apiOrder.branch_id,
    name: apiOrder.branch?.name || '',
    location: apiOrder.branch?.location || '',
    is_active: typeof apiOrder.branch?.is_active === 'number'
      ? Boolean(apiOrder.branch.is_active)
      : (apiOrder.branch?.is_active ?? true),
    created_at: apiOrder.branch?.created_at || apiOrder.created_at, // Gunakan order created_at jika branch tidak ada
    updated_at: apiOrder.branch?.updated_at || apiOrder.updated_at, // Gunakan order updated_at jika branch tidak ada
  },
  items: apiOrder.items?.map(item => ({
    id: item.id,
    order_id: item.order_id,
    product_id: item.product_id,
    product: mapApiProductToLocal(item.product), // Map product di dalam item
    quantity: item.quantity,
    price: item.price,
    notes: item.notes, // Tambahkan notes jika ada
    created_at: item.created_at,
    updated_at: item.updated_at,
  })) || [],
  tasks: apiOrder.tasks?.map(task => ({
    id: task.id,
    order_id: task.order_id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    assignee_id: task.assignee_id,
    deadline: task.deadline,
    parent_task_id: task.parent_task_id,
    created_at: task.created_at,
    updated_at: task.updated_at,
    subtasks: task.subtasks,
  })) || [],
  total_amount: parseFloat(apiOrder.total_amount), // Pastikan ini dikonversi ke number
  status: apiOrder.status,
  payment_status: apiOrder.payment_status,
  payment_method: apiOrder.payment_method,
  delivery_date: apiOrder.delivery_date,
  notes: apiOrder.notes,
  created_at: apiOrder.created_at,
  updated_at: apiOrder.updated_at,
  branch_id: apiOrder.branch_id,
  customer_id: apiOrder.customer_id, // Pastikan customer_id juga ada di sini
  order_date: apiOrder.order_date, // Tambahkan order_date
});

export const OrderProvider: React.FC<OrderContextProps> = ({ children }) => {
  const [orders, setOrders] = useState<LocalOrder[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { products } = useProductContext();
  const { user } = useAuth();

  const fetchOrders = useCallback(async (params: OrderQueryParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getOrders(params);
      const localOrders = response.data.map(mapApiOrderToLocal);
      setOrders(localOrders);
      setCurrentPage(params.page || 1);
      setTotalPages(response.meta.last_page);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch orders';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const addOrder = useCallback(async (order: LocalOrder): Promise<void> => {
    if (!user?.branch_id) {
      toast.error('Tidak ada branch ID. Silahkan hubungi administrator.');
      return;
    }

    if (!isValidUUID(user.branch_id)) {
      toast.error('Format branch ID tidak valid. Silahkan hubungi administrator.');
      return;
    }

    try {
      setLoading(true);

      console.log('Validasi Sisi Klien untuk Order Baru:');
      console.log('Customer ID (input):', order.customer.id);
      if (order.items) {
        order.items.forEach((item, index) => {
          console.log(`Product ID for item ${index}:`, item.product_id);
        });
      }

      // Validasi customer ID di sisi klien.
      if (!order.customer.id || !isValidUUID(order.customer.id)) {
        throw new Error('Format customer ID tidak valid. Customer harus memiliki UUID yang valid dari database.');
      }

      if (!order.items || !Array.isArray(order.items)) {
        throw new Error('Order items must be an array');
      }

      const invalidProducts = order.items.filter(
        item => !item.product_id || !isValidUUID(item.product_id)
      );

      if (invalidProducts.length > 0) {
        throw new Error('Satu atau lebih produk memiliki format ID tidak valid. Silahkan pastikan semua produk dipilih dari daftar.');
      }

      // Sesuaikan payload agar sesuai dengan CreateOrderPayload di orderService.ts
      const apiPayload: CreateOrderPayload = {
        customer_id: order.customer.id,
        branch_id: user.branch_id,
        total_amount: order.total_amount, // Pastikan ini number
        status: order.status,
        payment_status: order.payment_status, // Gunakan payment_status dari order, bukan default 'unpaid'
        payment_method: order.payment_method, // Gunakan payment_method dari order, bukan default 'cash'
        notes: order.notes || '',
        delivery_date: order.delivery_date,
        items: order.items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          notes: item.notes || null, // Tambahkan notes jika ada di OrderItem
        })),
      };

      const createdOrder = await orderService.createOrder(apiPayload);

      console.log('Respons API setelah Order dibuat:');
      console.log('Created Order ID from API:', createdOrder.id);
      console.log('Created Order Customer ID from API:', createdOrder.customer_id);

      // Validasi ID yang dikembalikan oleh server.
      if (!createdOrder.id || !isValidUUID(createdOrder.id)) {
        throw new Error('Server mengembalikan format ID pesanan tidak valid. Pesanan mungkin telah tersimpan, tetapi ada masalah dengan ID yang dikembalikan.');
      }

      // Customer ID dari respons API juga harus UUID valid
      // Note: Jika createdOrder.customer_id adalah UUID, ini akan lolos.
      // Jika backend tidak mengembalikan customer_id atau mengembalikan format berbeda, ini akan gagal.
      if (!createdOrder.customer_id || !isValidUUID(createdOrder.customer_id)) {
        throw new Error('Server mengembalikan format ID pelanggan tidak valid. Pesanan mungkin telah tersimpan, tetapi ada masalah dengan ID pelanggan yang dikembalikan.');
      }

      // Penting: Gunakan createdOrder dari API untuk generate task, karena ID dan data lain sudah final
      const orderTasks = generateTasks(mapApiOrderToLocal(createdOrder), products);
      const allTasks = orderTasks.reduce((acc: Task[], task) => {
        acc.push(task);
        if (task.subtasks) {
          acc.push(...task.subtasks);
        }
        return acc;
      }, []);

      setTasks(prevTasks => [...prevTasks, ...allTasks]);

      await fetchOrders({ page: currentPage });
      toast.success('Order berhasil dibuat');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal membuat pesanan';
      toast.error(message);
      console.error('Error in addOrder:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [products, currentPage, fetchOrders, user?.branch_id]);

  const updateOrder = useCallback(async (updatedOrder: LocalOrder) => {
    try {
      setLoading(true);

      if (!updatedOrder.items || !Array.isArray(updatedOrder.items)) {
        throw new Error('Item pesanan harus berupa array');
      }

      // Sesuaikan payload agar sesuai dengan Partial<CreateOrderPayload> di orderService.ts
      const apiPayload: Partial<CreateOrderPayload> = {
        customer_id: updatedOrder.customer.id,
        total_amount: updatedOrder.total_amount, // Pastikan ini number
        status: updatedOrder.status,
        payment_status: updatedOrder.payment_status,
        payment_method: updatedOrder.payment_method,
        notes: updatedOrder.notes,
        delivery_date: updatedOrder.delivery_date,
        items: updatedOrder.items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          notes: item.notes || null, // Tambahkan notes jika ada di OrderItem
          // Jika update item memerlukan `id` dari order item, Anda mungkin perlu menambahkannya di sini.
          // Tergantung bagaimana API `updateOrder` Anda menangani `items`.
          // Beberapa API mengharapkan `id` untuk mengidentifikasi item yang ada untuk diupdate/dihapus.
          // id: item.id, // Contoh: jika API memerlukan id item untuk update
        })),
      };

      await orderService.updateOrder(updatedOrder.id, apiPayload);
      await fetchOrders({ page: currentPage });
      toast.success('Order berhasil diperbarui');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal memperbarui pesanan';
      toast.error(message);
      console.error('Error in updateOrder:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [currentPage, fetchOrders]);

  const deleteOrder = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await orderService.deleteOrder(id);
      await fetchOrders({ page: currentPage });
      toast.success('Order berhasil dihapus');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal menghapus pesanan';
      toast.error(message);
      console.error('Error in deleteOrder:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [currentPage, fetchOrders]);

  const addTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prev =>
      prev.map(task => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const generateOrderTasks = (order: LocalOrder): Task[] => {
    return generateTasks(order, products);
  };

  const generateTaskForProduct = (
    productId: string,
    quantity: string, // Perhatikan ini string, mungkin perlu diubah ke number jika untuk perhitungan
    deadline: string,
    orderId?: string,
    parentTaskId?: string
  ): Task | undefined => {
    // Pastikan `generateProductTask` menerima tipe data yang benar (misalnya `quantity` sebagai number)
    return generateProductTask(products, productId, quantity, deadline, orderId, parentTaskId);
  };

  const getOrder = useCallback(async (id: string): Promise<LocalOrder | undefined> => {
    try {
      const response = await orderService.getOrder(id);
      return mapApiOrderToLocal(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal mengambil pesanan';
      toast.error(message);
      console.error('Error in getOrder:', error);
      return undefined;
    }
  }, []);

  const addTaskToOrder = async (orderId: string, task: Task) => {
    const order = await getOrder(orderId);
    if (!order) return;

    const orderWithTasks = order as OrderWithTasks;
    const updatedOrder = {
      ...orderWithTasks,
      tasks: [...(orderWithTasks.tasks || []), task],
      updated_at: new Date().toISOString(),
    };

    await updateOrder(updatedOrder);
  };

  const updateTaskInOrder = async (orderId: string, taskId: string, updatedTask: Task) => {
    const order = await getOrder(orderId);
    if (!order) return;

    const orderWithTasks = order as OrderWithTasks;
    const updatedOrder = {
      ...orderWithTasks,
      tasks: (orderWithTasks.tasks || []).map(task =>
        task.id === taskId ? updatedTask : task
      ),
      updated_at: new Date().toISOString(),
    };

    await updateOrder(updatedOrder);
  };

  const deleteTaskFromOrder = async (orderId: string, taskId: string) => {
    const order = await getOrder(orderId);
    if (!order) return;

    const orderWithTasks = order as OrderWithTasks;
    const updatedOrder = {
      ...orderWithTasks,
      tasks: (orderWithTasks.tasks || []).filter(task => task.id !== taskId),
      updated_at: new Date().toISOString(),
    };

    await updateOrder(updatedOrder);
  };

  const value = {
    orders,
    tasks,
    loading,
    error,
    currentPage,
    totalPages,
    addOrder,
    updateOrder,
    deleteOrder,
    addTask,
    updateTask,
    deleteTask,
    generateOrderTasks,
    generateTaskForProduct,
    getOrder,
    addTaskToOrder,
    updateTaskInOrder,
    deleteTaskFromOrder,
    fetchOrders,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrderContext must be used within an OrderProvider');
  }
  return context;
};

export default OrderContext;