import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback
} from 'react';
import { Task, TimelineEvent, TaskResponse, TaskStatus } from '../types';
import taskService, { TasksResponse } from '../services/taskService';
import orderService from '../services/orderService';
import { toast } from '../hooks/use-toast';
import { useOrderContext } from './OrderContext';

interface TaskContextProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTaskById: (id: string) => Task | undefined;
  pagination: {
    currentPage: number;
    totalPages: number;
    perPage: number;
    total: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  addTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  bulkUpdateStatus: (taskIds: string[], newStatus: TaskStatus) => Promise<void>;
  getTaskEvents: (taskId: string) => TimelineEvent[];
  addTaskEvent: (taskId: string, event: TimelineEvent) => void;
  addTaskResponse: (taskId: string, response: TaskResponse) => void;
  fetchTasks: (page?: number, status?: TaskStatus, perPage?: number) => Promise<void>;
  goToNextPage: () => Promise<void>;
  goToPrevPage: () => Promise<void>;
  goToPage: (page: number) => Promise<void>;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 15,
    total: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const { orders, updateOrder } = useOrderContext();

  const updatePaginationFromResponse = (response: TasksResponse) => {
    setPagination({
      currentPage: response.meta.current_page,
      totalPages: response.meta.last_page,
      perPage: response.meta.per_page,
      total: response.meta.total,
      hasNextPage: response.meta.current_page < response.meta.last_page,
      hasPrevPage: response.meta.current_page > 1
    });
  };

  const fetchTasks = useCallback(async (
    page: number = 1, 
    status?: TaskStatus,
    perPage: number = 15
  ) => {
    setLoading(true);
    try {
      const response = await taskService.getTasks({ 
        page, 
        status, 
        per_page: perPage 
      });
      setTasks(response.data);
      updatePaginationFromResponse(response);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const goToNextPage = async () => {
    if (pagination.hasNextPage) {
      await fetchTasks(pagination.currentPage + 1);
    }
  };

  const goToPrevPage = async () => {
    if (pagination.hasPrevPage) {
      await fetchTasks(pagination.currentPage - 1);
    }
  };

  const goToPage = async (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      await fetchTasks(page);
    }
  };

  const getTaskById = (id: string) => {
    return tasks.find(task => task.id === id);
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const updateOrderStatus = async (orderId: string) => {
    try {
      // Get fresh order data
      const orderData = await orderService.getOrder(orderId);
      console.log('TaskContext: Fetched order details:', orderData);

      // Get all tasks for this order
    const orderTasks = tasks.filter((task) => task.order_id === orderId);
    const mainTask = orderTasks.find((task) => !task.parent_task_id);

    if (!mainTask) return;

    const allSubtasks = orderTasks.filter(
      (task) => task.parent_task_id === mainTask.id
    );
    const allSubtasksCompleted = allSubtasks.every(
      (task) => task.status === 'completed'
    );

      let newStatus = orderData.status;

    if (allSubtasksCompleted && mainTask.status === 'completed') {
      newStatus = 'ready';
    } else if (
      mainTask.status === 'in-progress' ||
      allSubtasks.some((task) => task.status === 'in-progress')
    ) {
      newStatus = 'processing';
    }

      if (newStatus !== orderData.status) {
        console.log('TaskContext: Updating order status:', {
          orderId,
          oldStatus: orderData.status,
          newStatus
        });
        
        const updatedOrder = await orderService.updateOrderStatus(orderId, newStatus);
        updateOrder(updatedOrder);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newTask = await taskService.createTask(taskData);
      // Refresh the current page to ensure proper pagination
      await fetchTasks(pagination.currentPage);
      if (newTask.order_id) {
        updateOrderStatus(newTask.order_id);
    }
      toast({
        title: 'Success',
        description: 'Task created successfully',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateTask = async (updatedTask: Task) => {
    try {
      const { id, ...taskData } = updatedTask;
      const result = await taskService.updateTask(id, taskData);
      // Update the task in the current page
      setTasks(prev => prev.map(task => task.id === id ? result : task));
      if (result.order_id) {
        updateOrderStatus(result.order_id);
      }
      toast({
        title: 'Success',
        description: 'Task updated successfully',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      // Refresh the current page to ensure proper pagination
      await fetchTasks(pagination.currentPage);
      toast({
        title: 'Success',
        description: 'Task deleted successfully',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    try {
      console.log('TaskContext: Updating status for task:', taskId, 'to:', newStatus);
      const updatedTasks = await taskService.updateTaskStatus(taskId, newStatus);
      console.log('TaskContext: Received updated tasks:', updatedTasks);
      
      // Ensure updatedTasks is an array before using array methods
      if (!Array.isArray(updatedTasks)) {
        console.error('Expected array of tasks but got:', updatedTasks);
        return;
      }

      // Update tasks in state
      setTasks(prev => {
        console.log('TaskContext: Previous tasks state:', prev);
        const newTasks = prev.map(task => {
          const updatedTask = updatedTasks.find(ut => ut.id === task.id);
          console.log('TaskContext: Updating task:', task.id, 
            'Current status:', task.status, 
            'New status:', updatedTask?.status || task.status);
          return updatedTask || task;
        });
        console.log('TaskContext: New tasks state:', newTasks);
        return newTasks;
      });

      // Update order status if needed
      const updatedTask = updatedTasks.find(t => t.id === taskId);
      if (updatedTask?.order_id) {
        await updateOrderStatus(updatedTask.order_id);
          }

      // Refresh tasks from server to ensure we have latest state
      await fetchTasks(pagination.currentPage);

      toast({
        title: 'Success',
        description: 'Task status updated successfully',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task status';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const bulkUpdateStatus = async (taskIds: string[], newStatus: TaskStatus) => {
    try {
      const updatedTasks = await taskService.bulkUpdateStatus({
        task_ids: taskIds,
        status: newStatus
      });
      console.log('Updated tasks from bulk update:', updatedTasks);

      // Ensure updatedTasks is an array before using array methods
      if (!Array.isArray(updatedTasks)) {
        console.error('Expected array of tasks but got:', updatedTasks);
        return;
      }

      // Update tasks in state
      setTasks(prev => prev.map(task => {
        const updatedTask = updatedTasks.find(ut => ut.id === task.id);
        return updatedTask || task;
      }));

      // Update order statuses if needed
      const affectedOrderIds = new Set(updatedTasks
        .filter(task => task.order_id)
        .map(task => task.order_id as string));

      affectedOrderIds.forEach(orderId => {
        updateOrderStatus(orderId);
      });

      toast({
        title: 'Success',
        description: 'Task statuses updated successfully',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task statuses';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const getTaskEvents = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    return task?.timeline_events || [];
  };

  const addTaskEvent = (taskId: string, event: TimelineEvent) => {
    setTasks(prev => prev.map(task => {
        if (task.id === taskId) {
        return {
            ...task,
          timeline_events: [...(task.timeline_events || []), event]
          };
        }
        return task;
    }));
  };

  const addTaskResponse = (taskId: string, response: TaskResponse) => {
    setTasks(prev => prev.map(task => {
        if (task.id === taskId) {
        return {
            ...task,
          task_responses: [...(task.task_responses || []), response]
          };
        }
        return task;
    }));
  };

  const value = {
    tasks,
    loading,
    error,
    pagination,
    getTasksByStatus,
    getTaskById,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    bulkUpdateStatus,
    getTaskEvents,
    addTaskEvent,
    addTaskResponse,
    fetchTasks,
    goToNextPage,
    goToPrevPage,
    goToPage
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
