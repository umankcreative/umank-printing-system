import api from '../lib/axios';
import { PrintJob } from '../types/api';

export const printJobService = {
  async getPrintJobs(): Promise<PrintJob[]> {
    const response = await api.get('/print-jobs');
    return response.data.data || [];
  },
  async createPrintJob(payload: Partial<PrintJob>) {
    const response = await api.post('/print-jobs', payload);
    return response.data;
  },
  async updatePrintJob(id: string, payload: Partial<PrintJob>) {
    const response = await api.put(`/print-jobs/${id}`, payload);
    return response.data;
  },
  async deletePrintJob(id: string) {
    const response = await api.delete(`/print-jobs/${id}`);
    return response.data;
  },
};