// services/orderService.ts
import api from '../lib/axios';
import { Order, Product as ApiProduct, OrderItem as ApiOrderItem } from '../types/api'; // Pastikan import yang benar dari api.ts
import { AxiosError } from 'axios';

// Gunakan ApiOrderItem langsung dari api.ts
interface CreateOrderItemPayload {
  product_id: string;
  quantity: number; // Pastikan ini number, bukan string
  price: number;     // Pastikan ini number, bukan string
  notes?: string | null; // Tambahkan jika Notes bisa dikirim saat create/update item
  // `id`, `order_id`, `customization`, dan `product` (objek lengkap) biasanya
  // TIDAK DIKIRIM saat membuat item baru melalui API. Backend yang akan mengaturnya.
  // Jadi, hilangkan dari payload jika tidak diperlukan.
  // Jika API Anda mengharapkan `customization`, Anda perlu menambahkannya kembali dan mengelolanya sebagai JSON string
  // customization?: string | null; // Contoh jika diperlukan
}


interface CreateOrderPayload {
  customer_id: string;
  branch_id: string;
  total_amount: number; // Ubah ke number
  status: 'pending' | 'processing' | 'ready' | 'delivered' | 'cancelled';
  payment_status: 'unpaid' | 'partial' | 'paid';
  payment_method: 'cash' | 'transfer' | 'debit' | 'credit'; // Sesuaikan
  notes?: string | null;
  delivery_date: string | null;
  items: CreateOrderItemPayload[]; // Gunakan payload item yang disederhanakan
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

interface OrderQueryParams {
  page?: number;
  search?: string;
  status?: string;
  payment_status?: string;
  with_branch?: boolean;
  with_customer?: boolean;
  with_items?: boolean;
  with_tasks?: boolean;
}

// Hapus interface ini jika tidak digunakan lagi
// interface CustomizationData {
//   form_template_id: string;
//   values: Record<string, unknown>;
// }

interface OrdersResponse {
  data: Order[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

const orderService = {
  // Get paginated orders
  getOrders: async (params: OrderQueryParams = {}) => {
    const response = await api.get<PaginatedResponse<Order>>('/orders', {
      params: {
        page: params.page || 1,
        search: params.search,
        status: params.status,
        payment_status: params.payment_status,
        with_branch: true,
        with_customer: true,
        with_items: true,
        with_tasks: true,
      },
    });
    return response.data;
  },

  // Get a single order by ID
  getOrder: async (id: string): Promise<Order> => {
    const response = await api.get<{ data: Order }>(`/orders/${id}`, {
      params: {
        with_branch: true,
        with_customer: true,
        with_items: true,
        with_tasks: true,
      },
    });
    return response.data.data;
  },

  // Create a new order
  createOrder: async (data: CreateOrderPayload) => {
    try {
      const response = await api.post<{ data: Order }>('/orders', data);
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error('API Error Response:', error.response.data);
        throw new Error(error.response.data.message || 'Failed to create order');
      }
      throw error;
    }
  },

  // Update an existing order
  updateOrder: async (id: string, data: Partial<CreateOrderPayload>) => {
    try {
      const response = await api.put<{ data: Order }>(`/orders/${id}`, data);
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error('API Error Response:', error.response.data);
        throw new Error(error.response.data.message || 'Failed to update order');
      }
      throw error;
    }
  },

  // Delete an order
  deleteOrder: async (id: string) => {
    try {
      await api.delete(`/orders/${id}`);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error('API Error Response:', error.response.data);
        throw new Error(error.response.data.message || 'Failed to delete order');
      }
      throw error;
    }
  },

  // Update customization for an order item
  // Sesuaikan tipe CustomizationData jika Anda masih menggunakannya
  updateOrderItemCustomization: async (orderItemId: string, customization: any) => {
    const response = await api.put(`/order-items/${orderItemId}/customization`, customization);
    return response.data;
  },

  // Get customization for an order item
  getOrderItemCustomization: async (orderItemId: string) => {
    const response = await api.get(`/order-items/${orderItemId}/customization`);
    return response.data;
  },

  // Get all orders with pagination
  getAllOrders: async (page: number = 1): Promise<OrdersResponse> => {
    const response = await api.get('/orders', {
      params: { page }
    });
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (id: string, status: string): Promise<Order> => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  }
};

export type { CreateOrderPayload, CreateOrderItemPayload, OrderQueryParams };
export default orderService;