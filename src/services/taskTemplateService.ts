import axios from '../lib/axios';
import { TaskTemplate } from '../types';

interface TaskTemplatePayload {
  title: string;
  description: string;
  priority: TaskTemplate['priority'];
  estimated_time: number;
  ingredient_id: string;
}

const taskTemplateService = {
  createTaskTemplate: async (payload: TaskTemplatePayload) => {
    const response = await axios.post('/ingredient-task-templates', payload);
    return response.data;
  },

  deleteTaskTemplate: async (id: string) => {
    const response = await axios.delete(`/ingredient-task-templates/${id}`);
    return response.data;
  },
};

export type { TaskTemplatePayload };
export default taskTemplateService; 