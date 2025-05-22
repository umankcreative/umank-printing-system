import React, { useState } from 'react';
import { Ingredient, TaskTemplate } from '../types';
import { Clock, Flag, Plus, Trash2 } from 'lucide-react';

interface IngredientFormProps {
  initialIngredient?: Ingredient;
  onSubmit: (ingredient: Ingredient) => void;
  onCancel: () => void;
}

const IngredientForm: React.FC<IngredientFormProps> = ({
  initialIngredient,
  onSubmit,
  onCancel,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [ingredient, setIngredient] = useState<Ingredient>({
    id: initialIngredient?.id || crypto.randomUUID(),
    name: initialIngredient?.name || '',
    description: initialIngredient?.description || '',
    unit: initialIngredient?.unit || '',
    price_per_unit: initialIngredient?.price_per_unit || 0,
    stock: initialIngredient?.stock || 0,
    branch_id: initialIngredient?.branch_id || '1',
    created_at: initialIngredient?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    taskTemplates: initialIngredient?.taskTemplates || [],
  });

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskTemplate['priority']>('medium');
  const [taskEstimatedTime, setTaskEstimatedTime] = useState<number>(2);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setIngredient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTaskTemplate = () => {
    if (!taskTitle.trim()) return;

    const newTaskTemplate: TaskTemplate = {
      title: taskTitle,
      description: taskDescription,
      priority: taskPriority,
      estimatedTime: taskEstimatedTime,
    };

    setIngredient((prev) => ({
      ...prev,
      taskTemplates: [...(prev.taskTemplates || []), newTaskTemplate],
    }));

    // Reset form
    setTaskTitle('');
    setTaskDescription('');
    setTaskPriority('medium');
    setTaskEstimatedTime(2);
  };

  const handleRemoveTaskTemplate = (index: number) => {
    setIngredient((prev) => ({
      ...prev,
      taskTemplates: prev.taskTemplates?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(ingredient);
  };

  return (
    <div className="space-y-4 overflow-scroll h-[calc(100vh-200px)]">
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={ingredient.name}
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
          value={ingredient.description}
          onChange={handleChange}
          rows={3}
          className="input mt-1"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="unit"
            className="block text-sm font-medium text-gray-700"
          >
            Unit
          </label>
          <input
            type="text"
            id="unit"
            name="unit"
            value={ingredient.unit}
            onChange={handleChange}
            required
            className="input mt-1"
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={ingredient.price_per_unit}
            onChange={handleChange}
            required
            min="0"
            className="input mt-1"
          />
        </div>

        <div>
          <label
            htmlFor="stock"
            className="block text-sm font-medium text-gray-700"
          >
            Stock
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={ingredient.stock}
            onChange={handleChange}
            required
            min="0"
            className="input mt-1"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Default Tasks
        </label>
          <div className="mb-4">
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {ingredient.taskTemplates?.map((task, index) => (
            <div
              key={index}
              className="flex items-start justify-between bg-gray-50 p-3 rounded"
            >
              <div className="flex columns-2 gap-2">
                <div className="flex-1 items-center gap-2">
                  <div className="font-semibold">{task.title}</div>
                  <div className="text-xs text-gray-500">{task.description}</div>
                </div>
                <div className="flex flex-1 items-center gap-2 text-xs text-gray-400">
                 <Flag size={16} /> Prioritas: {task.priority}, <Clock size={16} /> Estimasi: {task.estimatedTime} menit
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveTaskTemplate(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
          <button
            type="button"
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <Plus size={16} className={`transform transition-transform ${isFormOpen ? 'rotate-45' : ''}`} />
            {isFormOpen ? 'Close' : 'Add Task'}
          </button>
          {isFormOpen && (
            <div className="space-y-4 mt-4 p-4 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Task Name"
                    className="input"
                  />
                </div>
                <div>
                  <textarea
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Task Description"
                    className="input"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <select
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value as TaskTemplate['priority'])}
                      className="input"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={taskEstimatedTime}
                      onChange={(e) => setTaskEstimatedTime(parseInt(e.target.value))}
                      min="2"
                      placeholder="Estimated Time (minutes)"
                      className="input"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTaskTemplate}
                    className="btn m-auto btn-primary w-full"
                  >
                    Add Task
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </div>
      </form>
      </div>
  );
};

export default IngredientForm;
