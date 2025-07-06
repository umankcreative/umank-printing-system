import React, { useState } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import type { TaskResponse } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface ResponseFormProps {
  taskId: string;
  onResponseAdded?: () => void;
}

const ResponseForm: React.FC<ResponseFormProps> = ({ taskId, onResponseAdded }) => {
  const [content, setContent] = useState('');
  const { addTaskResponse } = useTaskContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      return;
    }

    const newResponse: TaskResponse = {
      id: uuidv4(),
      author: 'Current User', // This would come from auth context in a real app
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    addTaskResponse(taskId, newResponse);
    setContent('');
    onResponseAdded?.();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="flex flex-col space-y-2">
        <label htmlFor="response" className="text-sm font-medium text-gray-700">
          Add Response
        </label>
        <textarea
          id="response"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
          placeholder="Type your response..."
          required
        />
      </div>
      <div className="mt-2 flex justify-end">
        <button
          type="submit"
          className="btn btn-primary"
        >
          Submit Response
        </button>
      </div>
    </form>
  );
};

export default ResponseForm;