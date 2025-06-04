import api from '../lib/axios';
import { Order } from '../types/api';
import { AxiosError } from 'axios';

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  customization: string | null; // JSON string
  product: Product;
  notes?: string;
}

interface Product {
  id: string;
  name: string;
  category: {
    id: string;
    form_template_id: string | null;
  };
}

interface CreateOrderPayload {
  customer_id: string;
  branch_id: string;
  total_amount: string | number;
  status: 'pending' | 'processing' | 'ready' | 'delivered' | 'cancelled';
  payment_status: 'unpaid' | 'partial' | 'paid';
  payment_method: 'cash' | 'transfer' | 'other';
  notes?: string | null;
  delivery_date: string | null;
  items: OrderItem[];
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

interface CustomizationData {
  form_template_id: string;
  values: Record<string, unknown>;
}

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
  updateOrderItemCustomization: async (orderItemId: string, customization: CustomizationData) => {
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

export type { CreateOrderPayload, OrderItem, OrderQueryParams };
export default orderService; 