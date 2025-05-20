import React, { useState } from 'react';
import { Ingredient, Task } from '../types';
import { Plus, Trash2, X } from 'lucide-react';

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
    tasks: initialIngredient?.tasks || [],
  });

  const [taskTitle, setTaskTitle] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setIngredient((prev) => ({
      ...prev,
      [name]: value,
    }));
   
  };

  const handleAddTask = () => {
    if (!taskTitle.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: taskTitle,
      description: '',
      status: 'todo',
      deadline: new Date().toISOString().split('T')[0],
      estimatedTime: 2,
      ingredient_id: ingredient.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setIngredient((prev) => ({
      ...prev,
      tasks: [...(prev.tasks || []), newTask],
    }
                            ));
     console.log(ingredient);
    setTaskTitle('');
    
  };

  const handleRemoveTask = (taskId: string) => {
    setIngredient((prev) => ({
      ...prev,
      tasks: prev.tasks?.filter((t) => t.id !== taskId),
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

      <div className="grid grid-cols-2 gap-4">
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Associated Tasks
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Add a task"
            className="input flex-1"
          />
          <button
            type="button"
            onClick={handleAddTask}
            className="btn btn-primary"
          >
            <Plus size={20} />
          </button>
        </div>
        <ul className="space-y-2">
          {ingredient.tasks?.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between bg-gray-50 p-2 rounded"
            >
              <span>{task.title}</span>
              <button
                type="button"
                onClick={() => handleRemoveTask(task.id)}
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
          Batal
        </button>
        <button type="submit" className="btn btn-primary">
          {initialIngredient ? 'Update Bahan' : 'Tambah Bahan'}
        </button>
      </div>
    </form>
  );
};

export default IngredientForm;
