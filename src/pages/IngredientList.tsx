import React, { useState, useEffect } from 'react';
import { Plus, Search, X, Edit, Trash2 } from 'lucide-react';
import IngredientForm from '../components/IngredientForm';
import Pagination from '../components/Pagination';
import { useProductContext } from '../context/ProductContext';
import { Ingredient } from '../types';

const IngredientList: React.FC = () => {
  const { ingredients, addIngredient, updateIngredient, deleteIngredient } = useProductContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | undefined>();
  const itemsPerPage = 10;

  // Filter ingredients based on search term
  const filteredIngredients = ingredients.filter(
    (ingredient) =>
      ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingredient.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingredient.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentIngredients = filteredIngredients.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleAdd = () => {
    setEditingIngredient(undefined);
    setShowForm(true);
  };

  

  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setShowForm(true);
  };
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this ingredient?')) {
      await deleteIngredient(id);
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Bahan</h1>
        
        <button
            className="btn btn-primary flex items-center justify-center"
            onClick={handleAdd}
          >
            <Plus size={20} className="mr-2" /> Tambah Bahan
          </button>
      </div>

      <div className="mb-6">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Cari bahan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header px-6 py-3 text-left">Nama</th>
              {/* <th className="table-header px-6 py-3 text-left">Deskripsi</th> */}
              <th className="table-header px-6 py-3 text-left">Satuan</th>
              <th className="table-header px-6 py-3 text-right">Harga</th>
              <th className="table-header px-6 py-3 text-center">Stok</th>
              <th className="table-header px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentIngredients.map((ingredient) => (
              <tr key={ingredient.id}>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {ingredient.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {ingredient.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                  {ingredient.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  {ingredient.price_per_unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {ingredient.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
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

      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalItems={filteredIngredients.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default IngredientList;
