import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, Task } from '../types';
import { useProductContext } from './ProductContext';
import { generateOrderTasks as generateTasks, generateTaskForProduct as generateProductTask } from '../lib/utils';

interface OrderContextProps {
  children: React.ReactNode;
}

interface OrderContextType {
  orders: Order[];
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  deleteOrder: (id: string) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  generateOrderTasks: (order: Order) => Task[];
  generateTaskForProduct: (
    productId: string,
    quantity: string,
    deadline: string,
    orderId?: string,
    parentTaskId?: string
  ) => Task | undefined;
  getOrder: (id: string) => Order | undefined;
  addTaskToOrder: (orderId: string, task: Task) => void;
  updateTaskInOrder: (orderId: string, taskId: string, updatedTask: Task) => void;
  deleteTaskFromOrder: (orderId: string, taskId: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<OrderContextProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { products } = useProductContext();

  useEffect(() => {
    // Load orders and tasks from localStorage
    const loadData = () => {
      try {
        const savedOrders = localStorage.getItem('orders');
        const savedTasks = localStorage.getItem('tasks');

        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
        }
        if (savedTasks) {
          setTasks(JSON.parse(savedTasks));
        }
      } catch {
        setError('Error loading data from localStorage');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    // Save orders and tasks to localStorage whenever they change
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [orders, tasks]);

  const addOrder = (order: Order) => {
    // Generate tasks for the new order
    const orderTasks = generateTasks(order, products);
    
    // Add the order
    setOrders((prevOrders) => [...prevOrders, order]);
    
    // Add all tasks (including subtasks) to the tasks state
    const allTasks = orderTasks.reduce((acc: Task[], task) => {
      acc.push(task);
      if (task.subtasks) {
        acc.push(...task.subtasks);
      }
      return acc;
    }, []);
    
    setTasks((prevTasks) => [...prevTasks, ...allTasks]);
    
    // Update the order with the generated tasks
    const updatedOrder = {
      ...order,
      tasks: orderTasks,
      updated_at: new Date().toISOString(),
    };
    
    setOrders((prevOrders) =>
      prevOrders.map((o) => (o.id === order.id ? updatedOrder : o))
    );
  };

  const updateOrder = (updatedOrder: Order) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
  };

  const deleteOrder = (id: string) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
  };

  const addTask = (task: Task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const generateOrderTasks = (order: Order): Task[] => {
    return generateTasks(order, products);
  };

  const generateTaskForProduct = (
    productId: string,
    quantity: string,
    deadline: string,
    orderId?: string,
    parentTaskId?: string
  ): Task | undefined => {
    return generateProductTask(products, productId, quantity, deadline, orderId, parentTaskId);
  };

  const getOrder = (id: string): Order | undefined => {
    return orders.find((order) => order.id === id);
  };

  const addTaskToOrder = (orderId: string, task: Task) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            tasks: [...(order.tasks || []), task],
            updated_at: new Date().toISOString(),
          };
        }
        return order;
      })
    );
  };

  const updateTaskInOrder = (orderId: string, taskId: string, updatedTask: Task) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            tasks: (order.tasks || []).map((task) =>
              task.id === taskId ? updatedTask : task
            ),
            updated_at: new Date().toISOString(),
          };
        }
        return order;
      })
    );
  };

  const deleteTaskFromOrder = (orderId: string, taskId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            tasks: (order.tasks || []).filter((task) => task.id !== taskId),
            updated_at: new Date().toISOString(),
          };
        }
        return order;
      })
    );
  };

  const value = {
    orders,
    tasks,
    loading,
    error,
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
