import React, { useState } from 'react';
import { Ingredient } from '../types';
import { CreateIngredientPayload } from '../services/ingredientService';
import { useAuth } from '../context/AuthContext';

interface IngredientFormProps {
  initialIngredient?: Ingredient;
  onSubmit: (ingredient: CreateIngredientPayload) => void;
  onCancel: () => void;
}

const IngredientForm: React.FC<IngredientFormProps> = ({
  initialIngredient,
  onSubmit,
  onCancel,
}) => {
  const { user } = useAuth();
  
  const [ingredient, setIngredient] = useState<CreateIngredientPayload>({
    name: initialIngredient?.name || '',
    description: initialIngredient?.description || '',
    unit: initialIngredient?.unit || '',
    price_per_unit: initialIngredient?.price_per_unit || '',
    stock: initialIngredient?.stock || 0,
    branch_id: initialIngredient?.branch_id || user?.branch_id || ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    try {
      await onSubmit(ingredient);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" onClick={(e) => e.stopPropagation()}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nama
          </label>
          <input
            type="text"
            value={ingredient.name}
            onChange={(e) => setIngredient({ ...ingredient, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Satuan
          </label>
          <input
            type="text"
            value={ingredient.unit}
            onChange={(e) => setIngredient({ ...ingredient, unit: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Harga per Satuan
          </label>
          <input
            type="number"
            value={ingredient.price_per_unit}
            onChange={(e) => setIngredient({ ...ingredient, price_per_unit: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Stok
          </label>
          <input
            type="number"
            value={ingredient.stock}
            onChange={(e) => setIngredient({ ...ingredient, stock: parseInt(e.target.value) || 0 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
            min="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Deskripsi
        </label>
        <textarea
          value={ingredient.description}
          onChange={(e) => setIngredient({ ...ingredient, description: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default IngredientForm;
