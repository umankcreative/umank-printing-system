import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo
} from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Import react-query
import { Task, TimelineEvent, TaskResponse, TaskStatus, Order } from '../types'; // Import Order type
import taskService, { GetTasksQueryParams, TasksResponse, BulkUpdateStatusPayload } from '../services/taskService';
import orderService from '../services/orderService'; // Ini hanya untuk updateOrderStatus, bukan fetching langsung
import { toast } from '../hooks/use-toast';
import { useOrderContext } from './OrderContext'; // Menggunakan OrderContext

interface TaskContextProps {
  tasks: Task[];
  isLoading: boolean; // Menggantikan 'loading'
  isFetching: boolean; // Menunjukkan fetching di latar belakang
  isError: boolean; // Menggantikan 'error' (boolean)
  error: Error | null; // Objek error
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
  // fetchTasks tidak lagi diekspos secara langsung, tapi diganti dengan fungsi navigasi paginasi
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
  const queryClient = useQueryClient();
  const [queryParams, setQueryParams] = useState<GetTasksQueryParams>({
    page: 1,
    per_page: 15,
    status: undefined, // Default status
  });
  const { updateOrder } = useOrderContext();

  // --- useQuery for fetching tasks ---
  const {
    data: tasksResponse, // Data mentah dari API, termasuk `meta`
    isLoading,         // True saat pertama kali fetching
    isFetching,        // True saat fetching (termasuk refetch di latar belakang)
    isError,           // True jika ada error
    error,             // Objek error
  } = useQuery<TasksResponse, Error>({
    queryKey: ['tasks', queryParams], // Kunci query dinamis berdasarkan params
    queryFn: async ({ queryKey }) => {
      const [, params] = queryKey as [string, GetTasksQueryParams];
      const response = await taskService.getTasks(params);
      return response;
    },
    select: (data) => data, // Memilih seluruh response agar meta data juga tersedia
    placeholderData: (previousData) => previousData, // Mempertahankan data sebelumnya saat fetching baru
    staleTime: 1000 * 30, // Data dianggap segar selama 30 detik
    // refetchInterval: 1000 * 60, // Opsional: refetch setiap 60 detik jika ingin auto-update
    onError: (err) => {
      toast({
        title: 'Error',
        description: `Gagal memuat task: ${err.message}`,
        variant: 'destructive',
      });
    },
  });

  const tasks = tasksResponse?.data || [];
  const pagination = useMemo(() => ({
    currentPage: tasksResponse?.meta.current_page || 1,
    totalPages: tasksResponse?.meta.last_page || 1,
    perPage: tasksResponse?.meta.per_page || 15,
    total: tasksResponse?.meta.total || 0,
    hasNextPage: (tasksResponse?.meta.current_page || 1) < (tasksResponse?.meta.last_page || 1),
    hasPrevPage: (tasksResponse?.meta.current_page || 1) > 1,
  }), [tasksResponse]);

  // Fungsi navigasi paginasi, memicu perubahan queryParams dan refetch
  const goToNextPage = useCallback(async () => {
    if (pagination.hasNextPage) {
      setQueryParams(prev => ({ ...prev, page: prev.page! + 1 }));
    }
  }, [pagination.hasNextPage]);

  const goToPrevPage = useCallback(async () => {
    if (pagination.hasPrevPage) {
      setQueryParams(prev => ({ ...prev, page: prev.page! - 1 }));
    }
  }, [pagination.hasPrevPage]);

  const goToPage = useCallback(async (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setQueryParams(prev => ({ ...prev, page }));
    }
  }, [pagination.totalPages]);

  const getTaskById = useCallback((id: string) => {
    return tasks.find(task => task.id === id);
  }, [tasks]);

  const getTasksByStatus = useCallback((status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  // --- Mutasi untuk operasi CRUD tasks ---

  const updateOrderStatus = useCallback(async (orderId: string) => {
    try {
      // Dapatkan data order terbaru dari cache react-query atau fetch jika tidak ada/stale
      const orderData = await queryClient.fetchQuery<Order, Error>({
        queryKey: ['order', orderId],
        queryFn: () => orderService.getOrder(orderId), // Panggil service asli untuk fetch
        staleTime: 0, // Selalu ambil yang terbaru atau dari cache jika ada
      });

      // Filter tasks yang terkait dengan order ini dari data cache tasks
      const orderTasks = queryClient.getQueryData<TasksResponse>(['tasks', queryParams])
        ?.data.filter((task) => task.order_id === orderId) || [];

      const mainTask = orderTasks.find((task) => !task.parent_task_id);

      if (!mainTask) {
        console.warn(`No main task found for order ID: ${orderId}`);
        return;
      }

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
        
        // Panggil updateOrder dari OrderContext
        // Pastikan updateOrder di OrderContext menerima LocalOrder dan menangani mutasi ke backend
        const updatedOrder = await orderService.updateOrderStatus(orderId, newStatus);
        updateOrder(updatedOrder); // Memanggil mutasi updateOrder dari OrderContext
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: 'Error',
        description: 'Gagal memperbarui status pesanan terkait.',
        variant: 'destructive',
      });
    }
  }, [queryClient, queryParams, updateOrder]); // updateOrder dari useOrderContext sebagai dependensi

  // Mutasi Add Task
  const addTaskMutation = useMutation<Task, Error, Omit<Task, 'id' | 'created_at' | 'updated_at'>>({
    mutationFn: taskService.createTask,
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] }); // Invalidasi semua query tasks
      if (newTask.order_id) {
        updateOrderStatus(newTask.order_id);
      }
      toast({
        title: 'Sukses',
        description: 'Task berhasil dibuat',
      });
    },
    onError: (err) => {
      toast({
        title: 'Error',
        description: `Gagal membuat task: ${err.message}`,
        variant: 'destructive',
      });
    },
  });

  const addTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    await addTaskMutation.mutateAsync(taskData);
  };

  // Mutasi Update Task
  const updateTaskMutation = useMutation<Task, Error, Task>({
    mutationFn: async (updatedTask) => {
      const { id, ...taskData } = updatedTask;
      return taskService.updateTask(id, taskData);
    },
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] }); // Invalidasi semua query tasks
      if (updatedTask.order_id) {
        updateOrderStatus(updatedTask.order_id);
      }
      toast({
        title: 'Sukses',
        description: 'Task berhasil diperbarui',
      });
    },
    onError: (err) => {
      toast({
        title: 'Error',
        description: `Gagal memperbarui task: ${err.message}`,
        variant: 'destructive',
      });
    },
  });

  const updateTask = async (updatedTask: Task) => {
    await updateTaskMutation.mutateAsync(updatedTask);
  };

  // Mutasi Delete Task
  const deleteTaskMutation = useMutation<void, Error, string>({
    mutationFn: taskService.deleteTask,
    onSuccess: (_, taskId) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] }); // Invalidasi semua query tasks
      // Perlu menemukan order_id dari task yang dihapus jika ingin update status order
      // Ini bisa rumit tanpa cache yang lebih spesifik atau data yang dikembalikan dari mutasi delete
      // Untuk amannya, refetch semua order atau pertimbangkan struktur API yang mengembalikan order_id
      // Sebagai alternatif, Anda bisa passing order_id ke deleteTask jika selalu tersedia
      // Misal: const orderId = tasks.find(t => t.id === taskId)?.order_id; updateOrderStatus(orderId);
      toast({
        title: 'Sukses',
        description: 'Task berhasil dihapus',
      });
    },
    onError: (err) => {
      toast({
        title: 'Error',
        description: `Gagal menghapus task: ${err.message}`,
        variant: 'destructive',
      });
    },
  });

  const deleteTask = async (id: string) => {
    await deleteTaskMutation.mutateAsync(id);
  };

  // Mutasi Update Task Status (single)
  const updateTaskStatusMutation = useMutation<Task[], Error, { taskId: string, newStatus: TaskStatus }>({
    mutationFn: ({ taskId, newStatus }) => taskService.updateTaskStatus(taskId, newStatus),
    onSuccess: (updatedTasks) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] }); // Invalidasi semua query tasks
      // Trigger update order status for affected orders
      const affectedOrderIds = new Set(updatedTasks
        .filter(task => task.order_id)
        .map(task => task.order_id as string));
      affectedOrderIds.forEach(orderId => updateOrderStatus(orderId));
      toast({
        title: 'Sukses',
        description: 'Status task berhasil diperbarui',
      });
    },
    onError: (err) => {
      toast({
        title: 'Error',
        description: `Gagal memperbarui status task: ${err.message}`,
        variant: 'destructive',
      });
    },
  });

  const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    await updateTaskStatusMutation.mutateAsync({ taskId, newStatus });
  };

  // Mutasi Bulk Update Status
  const bulkUpdateStatusMutation = useMutation<Task[], Error, BulkUpdateStatusPayload>({
    mutationFn: taskService.bulkUpdateStatus,
    onSuccess: (updatedTasks) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] }); // Invalidasi semua query tasks
      // Trigger update order status for affected orders
      const affectedOrderIds = new Set(updatedTasks
        .filter(task => task.order_id)
        .map(task => task.order_id as string));
      affectedOrderIds.forEach(orderId => updateOrderStatus(orderId));
      toast({
        title: 'Sukses',
        description: 'Status task berhasil diperbarui secara massal',
      });
    },
    onError: (err) => {
      toast({
        title: 'Error',
        description: `Gagal memperbarui status task secara massal: ${err.message}`,
        variant: 'destructive',
      });
    },
  });

  const bulkUpdateStatus = async (taskIds: string[], newStatus: TaskStatus) => {
    await bulkUpdateStatusMutation.mutateAsync({ task_ids: taskIds, status: newStatus });
  };


  // --- Client-side only Task Event/Response Management ---
  // Assuming these are not directly synced with backend via dedicated APIs
  const addTaskEvent = useCallback((taskId: string, event: TimelineEvent) => {
    queryClient.setQueryData<TasksResponse>(['tasks', queryParams], (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        data: oldData.data.map(task => {
          if (task.id === taskId) {
            return {
              ...task,
              timeline_events: [...(task.timeline_events || []), event]
            };
          }
          return task;
        })
      };
    });
    // Jika perlu disinkronkan ke backend, panggil mutasi updateTask di sini
  }, [queryClient, queryParams]);

  const addTaskResponse = useCallback((taskId: string, response: TaskResponse) => {
    queryClient.setQueryData<TasksResponse>(['tasks', queryParams], (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        data: oldData.data.map(task => {
          if (task.id === taskId) {
            return {
              ...task,
              task_responses: [...(task.task_responses || []), response]
            };
          }
          return task;
        })
      };
    });
    // Jika perlu disinkronkan ke backend, panggil mutasi updateTask di sini
  }, [queryClient, queryParams]);

  const getTaskEvents = useCallback((taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    return task?.timeline_events || [];
  }, [tasks]);

  const value = useMemo(() => ({
    tasks,
    isLoading,
    isFetching,
    isError,
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
    goToNextPage,
    goToPrevPage,
    goToPage,
  }), [
    tasks,
    isLoading,
    isFetching,
    isError,
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
    goToNextPage,
    goToPrevPage,
    goToPage,
  ]);

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};