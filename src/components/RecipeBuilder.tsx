import React, { useState } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import { Ingredient, RecipeIngredient } from '../types';
import { formatCurrency } from '../lib/utils';
interface RecipeBuilderProps {
  ingredients: Ingredient[];
  recipeIngredients: RecipeIngredient[];
  onChange: (ingredients: RecipeIngredient[]) => void;
}

const RecipeBuilder: React.FC<RecipeBuilderProps> = ({
  ingredients,
  recipeIngredients,
  onChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showIngredientList, setShowIngredientList] = useState(false);

  const handleAddIngredient = (ingredient: Ingredient) => {
    // Check if ingredient already exists in the recipe
    const existingIndex = recipeIngredients.findIndex(
      (item) => item.ingredient.id === ingredient.id
    );

    if (existingIndex !== -1) {
      // If it exists, update the quantity
      const updatedIngredients = [...recipeIngredients];
      updatedIngredients[existingIndex] = {
        ...updatedIngredients[existingIndex],
        quantity: (
          updatedIngredients[existingIndex].quantity + 1
        ),
      };
      onChange(updatedIngredients);
    } else {
      // If it doesn't exist, add it with quantity 1
      onChange([...recipeIngredients, { ingredient, quantity: 1 }]);
    }

    setShowIngredientList(false);
    setSearchTerm('');
  };

  const handleRemoveIngredient = (ingredientId: string) => {
    onChange(
      recipeIngredients.filter((item) => item.ingredient.id !== ingredientId)
    );
  };

  const handleQuantityChange = (ingredientId: string, quantity: number) => {
    const updatedIngredients = recipeIngredients.map((item) => {
      if (item.ingredient.id === ingredientId) {
        return { ...item, quantity };
      }
      return item;
    });
    onChange(updatedIngredients);
  };

  const calculateTotal = (): number => {
    return recipeIngredients.reduce((total, item) => {
      return (
        total +
        item.ingredient.price_per_unit * item.quantity
      );
    }, 0);
  };

  const filteredIngredients = ingredients.filter(
    (ingredient) =>
      ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingredient.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Bahan Produk (Resep)
      </h2>

      {/* Search and add ingredients */}
      <div className="relative mb-6">
        <div className="flex">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Cari bahan..."
              className="input pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowIngredientList(true)}
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            className="btn btn-primary ml-2"
            onClick={() => setShowIngredientList(!showIngredientList)}
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Ingredient selection dropdown */}
        {showIngredientList && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredIngredients.length > 0 ? (
              filteredIngredients.map((ingredient) => (
                <div
                  key={ingredient.id}
                  className="p-2 hover:bg-purple-50 cursor-pointer border-b border-gray-100 flex justify-between items-center"
                  onClick={() => handleAddIngredient(ingredient)}
                >
                  <div>
                    <div className="font-medium text-md">{ingredient.name}</div>
                    <div className="text-sm text-gray-500">
                      {ingredient.description}
                    </div>
                  </div>
                  <div className="text-purple-700 text-md">
                    {formatCurrency(ingredient.price_per_unit.toString())}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No ingredients found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recipe ingredients table */}
      {recipeIngredients.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="table-header px-4 py-3 text-left text-sm">No</th>
                <th className="table-header px-4 py-3 text-left text-sm">
                  Nama Bahan
                </th>
                <th className="table-header px-4 py-3 text-center text-sm">
                  Jumlah
                </th>
                <th className="table-header px-4 py-3 text-right text-sm">
                  Harga
                </th>
                <th className="table-header px-4 py-3 text-right  text-sm">
                  Total
                </th>
                <th className="table-header px-4 py-3 text-center text-sm">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recipeIngredients.map((item, index) => {
                const totalPrice =
                  item.ingredient.price_per_unit *
                  item.quantity;
                return (
                  <tr key={item.ingredient.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-800">
                        {item.ingredient.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.ingredient.unit}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.ingredient.id,
                            parseInt(e.target.value)
                          )
                        }
                        className="w-16 text-center text-sm border border-gray-300 rounded p-1"
                      />
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      {formatCurrency(item.ingredient.price_per_unit.toString())}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-sm">
                      {formatCurrency(totalPrice.toString())}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() =>
                          handleRemoveIngredient(item.ingredient.id)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-purple-50">
                <td colSpan={4} className="px-4 py-3 text-right font-semibold">
                  Total:
                </td>
                <td className="px-4 py-3 text-right font-bold text-purple-700">
                  {formatCurrency(calculateTotal().toString())}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
          Belum ada bahan yang ditambahkan
        </div>
      )}
    </div>
  );
};

export default RecipeBuilder;
