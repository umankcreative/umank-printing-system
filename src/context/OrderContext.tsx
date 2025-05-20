import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Order, Task, Product, Customer } from '../types';
import { useProductContext } from './ProductContext';

interface OrderContextProps {
  orders: Order[];
  loading: boolean;
  error: string | null;
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  deleteOrder: (id: string) => void;
  getOrder: (id: string) => Order | undefined;
  generateOrderTasks: (order: Order) => Task[];
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('use OrderContext must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { products } = useProductContext();
  const now = new Date().toISOString();

  

  const generateOrderTasks = (order: Order): Task[] => {
    const now = new Date().toISOString();
    const tasks: Task[] = [];

    const mainTask: Task = {
      id: crypto.randomUUID(),
      title: `Order #${order.id.slice(0, 8)} - ${order.customer.name}`,
      description: `Proses order milik ${order.customer.name}. Harus selesai sebelum Tanggal : ${order.delivery_date}`,
      status: 'todo',
      deadline: order.delivery_date,
      estimatedTime: 2,
      priority: 'high',
      order_id: order.id,
      created_at: now,
      updated_at: now,
      subtasks: [],
    };

    order.items.forEach((item) => {
      const productTask = generateTaskForProduct(
        item.product_id,
        item.quantity,
        order.delivery_date,
        order.id,
        mainTask.id
      );

      if (productTask) {
        mainTask.subtasks?.push(productTask);
      }
    });

    // Jika tidak ada subtasks dari produk, buat default task
    if (!mainTask.subtasks?.length) {
      mainTask.subtasks?.push({
        id: crypto.randomUUID(),
        title: `Produksi - Order #${order.id.slice(0, 8)}`,
        description: `Siapkan barang untuk Order #${order.id.slice(
          0,
          8
        )}:\n${order.items
          .map((item) => `- ${item.product.NamaProduk} (${item.quantity} buah)`)
          .join('\n')}`,
        status: 'todo',
        deadline: order.delivery_date,
        estimatedTime: 2,
        priority: 'high',
        order_id: order.id,
        parent_task_id: mainTask.id,
        created_at: now,
        updated_at: now,
      });
    }

    tasks.push(mainTask);
    return tasks;
  };

  const generateTaskForProduct = (
    productId: string,
    quantity: string,
    deadline: string,
    orderId?: string,
    parentTaskId?: string
  ): Task | undefined => {
    const product = products.find((p) => p.id === productId);
    if (!product || !product.ingredients) return undefined;

    const now = new Date().toISOString();

    const subtasks: Task[] = product.ingredients.flatMap((recipeIngredient) => {
      const ingredient = recipeIngredient.ingredient;
      if (!ingredient || !ingredient.tasks) return [];

      return ingredient.tasks.map((ingredientTask) => ({
        id: crypto.randomUUID(),
        title: `${ingredientTask.title} - untuk ${
          product.NamaProduk
        } dari Order #${orderId?.slice(
          0,
          8
        )} sebanyak ${quantity} pcs \n `,
        description: `${ingredientTask.description} untuk Order #${orderId?.slice(
          0,
          8
        )} sebanyak ${quantity} pcs \n Harus selesai sebelum tanggal : ${deadline} `,
        status: 'todo',
        deadline,
        estimatedTime: ingredientTask.estimatedTime || 2,
        priority: ingredientTask.priority || 'medium',
        order_id: orderId,
        ingredient_id: ingredient.id,
        parent_task_id: parentTaskId,
        created_at: now,
        updated_at: now,
      }));
    });

    return {
      id: crypto.randomUUID(),
      title: `Produksi ${product.NamaProduk}`,
      description: `Kerjakan tugas-tugas untuk produk: ${
        product.NamaProduk
      } dari Order# ${orderId?.slice(0, 8)} sebanyak ${quantity} pcs  `,
      status: 'todo',
      deadline,
      estimatedTime: 2,
      priority: 'medium',
      order_id: orderId,
      created_at: now,
      updated_at: now,
      subtasks,
    };
  };

  const addOrder = (order: Order) => {
    // Generate tasks for the order
    const orderTasks = generateOrderTasks(order);

    // Add tasks to the order
    const orderWithTasks = {
      ...order,
      tasks: orderTasks,
    };

    setOrders((prev) => [...prev, orderWithTasks]);
  };

  const updateOrder = (updatedOrder: Order) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
    );
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
  };

  const getOrder = (id: string): Order | undefined => {
    return orders.find((order) => order.id === id);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        error,
        addOrder,
        updateOrder,
        deleteOrder,
        getOrder,
        generateOrderTasks,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
