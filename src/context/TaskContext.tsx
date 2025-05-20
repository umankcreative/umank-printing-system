import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { Task, TimelineEvent, TaskResponse } from '../types';
import { useOrderContext } from './OrderContext';

interface TaskContextProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (taskId: string, newStatus: Task['status']) => void;
  getTaskEvents: (taskId: string) => TimelineEvent[];
  addTaskEvent: (taskId: string, event: TimelineEvent) => void;
  addTaskResponse: (taskId: string, response: TaskResponse) => void;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading] = useState<boolean>(false);
  const [error] = useState<string | null>(null);
  const { orders, updateOrder } = useOrderContext();

  // Sync tasks from orders
  useEffect(() => {
    const allTasks: Task[] = [];
    orders.forEach((order) => {
      if (order.tasks) {
        order.tasks.forEach((task) => {
          allTasks.push(task);
          if (task.subtasks) {
            allTasks.push(...task.subtasks);
          }
        });
      }
    });
    setTasks(allTasks);
  }, [orders]);

  const updateOrderStatus = (orderId: string) => {
    const orderTasks = tasks.filter((task) => task.order_id === orderId);
    const mainTask = orderTasks.find((task) => !task.parent_task_id);

    if (!mainTask) return;

    const allSubtasks = orderTasks.filter(
      (task) => task.parent_task_id === mainTask.id
    );
    const allSubtasksCompleted = allSubtasks.every(
      (task) => task.status === 'completed'
    );

    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    let newStatus = order.status;

    if (allSubtasksCompleted && mainTask.status === 'completed') {
      newStatus = 'ready';
    } else if (
      mainTask.status === 'in-progress' ||
      allSubtasks.some((task) => task.status === 'in-progress')
    ) {
      newStatus = 'processing';
    }

    if (newStatus !== order.status) {
      updateOrder({
        ...order,
        status: newStatus,
        updated_at: new Date().toISOString(),
      });
    }
  };

  const addTask = (task: Task) => {
    setTasks((prev) => [...prev, task]);
    if (task.order_id) {
      updateOrderStatus(task.order_id);
    }
  };

  const updateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    if (updatedTask.order_id) {
      updateOrderStatus(updatedTask.order_id);
    }
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find((task) => task.id === id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
    if (taskToDelete?.order_id) {
      updateOrderStatus(taskToDelete.order_id);
    }
  };

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const updatedTask = {
            ...task,
            status: newStatus,
            updated_at: new Date().toISOString(),
          };
          if (task.order_id) {
            updateOrderStatus(task.order_id);
          }
          return updatedTask;
        }
        return task;
      })
    );
  };

  const getTaskEvents = (taskId: string): TimelineEvent[] => {
    if (taskId === 'all') {
      return tasks.flatMap((task) => task.timeline || []);
    }
    const task = tasks.find((task) => task.id === taskId);
    return task?.timeline || [];
  };

  const addTaskEvent = (taskId: string, event: TimelineEvent) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const updatedTask = {
            ...task,
            timeline: [...(task.timeline || []), event],
            updated_at: new Date().toISOString(),
          };
          return updatedTask;
        }
        return task;
      })
    );
  };

  const addTaskResponse = (taskId: string, response: TaskResponse) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const updatedTask = {
            ...task,
            responses: [...(task.responses || []), response],
            updated_at: new Date().toISOString(),
          };
          return updatedTask;
        }
        return task;
      })
    );
  };

  const value = {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    getTaskEvents,
    addTaskEvent,
    addTaskResponse,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
