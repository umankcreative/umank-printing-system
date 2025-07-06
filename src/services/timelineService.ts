import axios from '../lib/axios';

export interface TimelineEventPayload {
  task_id: string;
  title: string;
  description?: string;
  status: 'todo' | 'pending' | 'in-progress' | 'completed' | 'blocked';
  timestamp: string;
  file_url?: string | null;
  file_type?: string | null;
}

export interface TimelineEventResponse {
  id: string;
  task_id: string;
  title: string;
  description?: string;
  status: string;
  timestamp: string;
  file_url?: string | null;
  file_type?: string | null;
  [key: string]: unknown;
}

const TIMELINE_ENDPOINT = '/timeline';

export const createTimelineEvent = async (
  payload: TimelineEventPayload
): Promise<TimelineEventResponse> => {
  const { data } = await axios.post(TIMELINE_ENDPOINT, payload);
  return data;
};

export const getTimelineEvents = async (
  taskId: string
): Promise<TimelineEventResponse[]> => {
  const { data } = await axios.get(`${TIMELINE_ENDPOINT}?task_id=${taskId}`);
  return data;
};

export default {
  createTimelineEvent,
  getTimelineEvents,
};
