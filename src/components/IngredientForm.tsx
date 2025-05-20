import React, { useState } from 'react';
import { Ingredient, TaskTemplate } from '../types';
import { Plus, Trash2 } from 'lucide-react';

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
    NamaBahan: initialIngredient?.NamaBahan || '',
    Deskripsi: initialIngredient?.Deskripsi || '',
    Satuan: initialIngredient?.Satuan || '',
    HargaPerSatuan: initialIngredient?.HargaPerSatuan || '0',
    Stok: initialIngredient?.Stok || '0',
    id_cabang: initialIngredient?.id_cabang || '1',
    created_at: initialIngredient?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    taskTemplates: initialIngredient?.taskTemplates || [],
  });

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskTemplate['priority']>('medium');
  const [taskEstimatedTime, setTaskEstimatedTime] = useState<number>(30);

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
    setTaskEstimatedTime(30);
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="NamaBahan"
          className="block text-sm font-medium text-gray-700"
        >
          Nama Bahan
        </label>
        <input
          type="text"
          id="NamaBahan"
          name="NamaBahan"
          value={ingredient.NamaBahan}
          onChange={handleChange}
          required
          className="input mt-1"
        />
      </div>

      <div>
        <label
          htmlFor="Deskripsi"
          className="block text-sm font-medium text-gray-700"
        >
          Deskripsi
        </label>
        <textarea
          id="Deskripsi"
          name="Deskripsi"
          value={ingredient.Deskripsi}
          onChange={handleChange}
          rows={3}
          className="input mt-1"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="Satuan"
            className="block text-sm font-medium text-gray-700"
          >
            Satuan
          </label>
          <input
            type="text"
            id="Satuan"
            name="Satuan"
            value={ingredient.Satuan}
            onChange={handleChange}
            required
            className="input mt-1"
          />
        </div>

        <div>
          <label
            htmlFor="HargaPerSatuan"
            className="block text-sm font-medium text-gray-700"
          >
            Harga Per Satuan
          </label>
          <input
            type="number"
            id="HargaPerSatuan"
            name="HargaPerSatuan"
            value={ingredient.HargaPerSatuan}
            onChange={handleChange}
            required
            min="0"
            className="input mt-1"
          />
        </div>

        <div>
          <label
            htmlFor="Stok"
            className="block text-sm font-medium text-gray-700"
          >
            Stok
          </label>
          <input
            type="number"
            id="Stok"
            name="Stok"
            value={ingredient.Stok}
            onChange={handleChange}
            required
            min="0"
            className="input mt-1"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tugas bawaan
        </label>
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <Plus size={16} className={`transform transition-transform ${isFormOpen ? 'rotate-45' : ''}`} />
            {isFormOpen ? 'Tutup' : 'Tambah Tugas'}
          </button>
          
          {isFormOpen && (
            <div className="space-y-4 mt-4 p-4 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Nama Tugas"
                    className="input"
                  />
                </div>
                <div>
                  <textarea
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Deskripsi Tugas"
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

        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {ingredient.taskTemplates?.map((task, index) => (
            <div
              key={index}
              className="flex items-start justify-between bg-gray-50 p-3 rounded"
            >
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{task.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                <div className="flex gap-2 mt-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {task.priority}
                  </span>
                  <span className="text-sm text-gray-500">
                    Est. {task.estimatedTime} min
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveTaskTemplate(index)}
                className="text-red-500 hover:text-red-700 ml-4"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-2 m-auto">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-danger bg-gray-100 text-gray-700 hover:bg-gray-200 h-10 m-2"
        >
          Batal
        </button>
        <button type="submit" className="btn btn-primary h-10 w-full m-2">
          {initialIngredient ? 'Update Bahan' : 'Tambah Bahan'}
        </button>
      </div>
    </form>
  );
};

export default IngredientForm;
