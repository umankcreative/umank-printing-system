import React, { useState } from 'react';
import { Search, Edit, Trash2, Plus, X } from 'lucide-react';
import { useProductContext } from '../context/ProductContext';
import IngredientForm from '../components/IngredientForm';
import { Ingredient } from '../types';
import { formatCurrency } from '../lib/utils';

const IngredientList: React.FC = () => {
  const { ingredients, addIngredient, updateIngredient, deleteIngredient } =
    useProductContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<
    Ingredient | undefined
  >();

  const filteredIngredients = ingredients.filter(
    (ingredient) =>
      ingredient.NamaBahan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingredient.Deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingIngredient(undefined);
    setShowForm(true);
  };

  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this ingredient?')) {
      deleteIngredient(id);
    }
  };

  const handleSubmit = (ingredient: Ingredient) => {
    if (editingIngredient) {
      updateIngredient(ingredient);
    } else {
      addIngredient(ingredient);
    }
    setShowForm(false);
    setEditingIngredient(undefined);
  };

  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Bahan</h1>

        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari bahan..."
              className="input pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <button
            className="btn btn-primary flex items-center justify-center"
            onClick={handleAdd}
          >
            <Plus size={20} className="mr-2" /> Tambah Bahan
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingIngredient ? 'Edit Bahan' : 'Tambah Bahan Baru'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <IngredientForm
              initialIngredient={editingIngredient}
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="table-header px-6 py-3 text-left">No</th>
                <th className="table-header px-6 py-3 text-left">Nama Bahan</th>
                <th className="table-header px-6 py-3 text-left">Deskripsi</th>
                <th className="table-header px-6 py-3 text-center">Satuan</th>
                <th className="table-header px-6 py-3 text-right">Harga</th>
                <th className="table-header px-6 py-3 text-center">Stok</th>
                <th className="table-header px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIngredients.map((ingredient, index) => (
                <tr key={ingredient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-800">
                      {ingredient.NamaBahan}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 line-clamp-2">
                      {ingredient.Deskripsi}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                    {ingredient.Satuan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                    {formatCurrency(ingredient.HargaPerSatuan)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        parseInt(ingredient.Stok) > 1000
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ingredient.Stok}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(ingredient)}
                        className="text-amber-500 hover:text-amber-700"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(ingredient.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IngredientList;
