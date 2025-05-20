import React, { useState } from 'react';
import { Task } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface TaskFormProps {
  onSubmit: (task: Task) => void;
  onCancel: () => void;
  initialTask?: Task;
  ingredientId?: string;
  orderId?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onCancel,
  initialTask,
  ingredientId,
  orderId,
}) => {
  const [task, setTask] = useState<Task>(
    initialTask || {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      status: 'todo',
      deadline: new Date().toISOString().split('T')[0],
      estimatedTime: 2,
      ingredient_id: ingredientId,
      order_id: orderId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      subtasks: [],
    }
  );

  const [subtaskTitle, setSubtaskTitle] = useState('');

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSubtask = () => {
    if (!subtaskTitle.trim()) return;

    const newSubtask: Task = {
      id: crypto.randomUUID(),
      title: subtaskTitle,
      description: '',
      status: 'todo',
      deadline: task.deadline,
      estimatedTime: task.estimatedTime | 2,
      parent_task_id: task.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setTask((prev) => ({
      ...prev,
      subtasks: [...(prev.subtasks || []), newSubtask],
    }));
    setSubtaskTitle('');
  };

  const handleRemoveSubtask = (subtaskId: string) => {
    setTask((prev) => ({
      ...prev,
      subtasks: prev.subtasks?.filter((st) => st.id !== subtaskId),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(task);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={task.title}
          onChange={handleChange}
          required
          className="input mt-1"
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
          name="description"
          value={task.description}
          onChange={handleChange}
          rows={3}
          className="input mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={task.status}
            onChange={handleChange}
            className="input mt-1"
          >
            <option value="pending">Pending</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">In Review</option>
            <option value="done">Done</option>
            <option value="completed">Done</option>
            <option value="closed">Closed</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="deadline"
            className="block text-sm font-medium text-gray-700"
          >
            Deadline
          </label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={task.deadline}
            onChange={handleChange}
            required
            className="input mt-1"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subtasks
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={subtaskTitle}
            onChange={(e) => setSubtaskTitle(e.target.value)}
            placeholder="Add a subtask"
            className="input flex-1"
          />
          <button
            type="button"
            onClick={handleAddSubtask}
            className="btn btn-primary"
          >
            <Plus size={20} />
          </button>
        </div>
        <ul className="space-y-2">
          {task.subtasks?.map((subtask) => (
            <li
              key={subtask.id}
              className="flex items-center justify-between bg-gray-50 p-2 rounded"
            >
              <span>{subtask.title}</span>
              <button
                type="button"
                onClick={() => handleRemoveSubtask(subtask.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {initialTask ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
