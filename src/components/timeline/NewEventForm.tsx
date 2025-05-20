import React, { useState } from 'react';
import { useTaskContext } from '../../context/TaskContext';

interface NewEventFormProps {
  taskId: string;
  onEventAdded?: () => void;
}

const NewEventForm: React.FC<NewEventFormProps> = ({
  taskId,
  onEventAdded,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<
    'pending' | 'in-progress' | 'completed' | 'blocked'
  >('pending');
  const { addTaskEvent } = useTaskContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      return;
    }

    const newEvent = {
      id: crypto.randomUUID(),
      taskId,
      title: title.trim(),
      description: description.trim(),
      status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      file_url: null,
      file_type: null,
    };

    addTaskEvent(taskId, newEvent);
    setTitle('');
    setDescription('');
    setStatus('pending');
    onEventAdded?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white rounded-lg shadow p-6"
    >
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Event Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700"
        >
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary">
          Add Event
        </button>
      </div>
    </form>
  );
};

export default NewEventForm;
