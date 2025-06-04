import api from '../lib/axios';
import { Task, TaskStatus } from '../types';
import { AxiosError } from 'axios';

interface TaskPayload {
  title: string;
  description: string;
  status: TaskStatus;
  priority: Task['priority'];
  category: Task['category'];
  deadline: string | null;
  assignee: string | null;
  ingredient_id: string | null;
  order_id: string | null;
  parent_task_id: string | null;
  estimated_time: number | null;
}

interface TasksResponse {
  data: Task[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    path: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

interface GetTasksParams {
  page?: number;
  status?: TaskStatus;
  per_page?: number;
}

interface BulkUpdateStatusPayload {
  task_ids: string[];
  status: TaskStatus;
}

const taskService = {
  // Get all tasks with optional pagination and filters
  getTasks: async (params?: GetTasksParams): Promise<TasksResponse> => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  // Get a single task by ID
  getTask: async (id: string): Promise<Task> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // Create a new task
  createTask: async (payload: TaskPayload): Promise<Task> => {
    const response = await api.post('/tasks', payload);
    return response.data;
  },

  // Update an existing task
  updateTask: async (id: string, payload: Partial<TaskPayload>): Promise<Task> => {
    const response = await api.put(`/tasks/${id}`, payload);
    return response.data;
  },

  // Update task status (using bulk endpoint)
  updateTaskStatus: async (id: string, status: TaskStatus): Promise<Task[]> => {
    try {
      const payload = {
        task_ids: [id],
        status
      };
      console.log('Single task status update payload:', payload);
      const response = await api.put('/tasks/bulk/status', payload);
      console.log('Single task status update response:', response.data);
      
      // Ensure we return an array
      const tasks = Array.isArray(response.data) ? response.data : 
                   response.data.data ? response.data.data : 
                   [response.data];
      return tasks;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error updating task status:', {
          status: error.response?.status,
          data: error.response?.data,
          payload: { task_ids: [id], status }
        });
      }
      throw error;
    }
  },

  // Bulk update task statuses
  bulkUpdateStatus: async (payload: BulkUpdateStatusPayload): Promise<Task[]> => {
    try {
      console.log('Bulk status update payload:', payload);
      const response = await api.put('/tasks/bulk/status', payload);
      console.log('Bulk status update response:', response.data);
      
      // Ensure we return an array
      const tasks = Array.isArray(response.data) ? response.data : 
                   response.data.data ? response.data.data : 
                   [response.data];
      return tasks;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error in bulk status update:', {
          status: error.response?.status,
          data: error.response?.data,
          payload
        });
      }
      throw error;
    }
  },

  // Delete a task
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  }
};

export type { TaskPayload, TasksResponse, BulkUpdateStatusPayload };
export default taskService; 