import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Save, X, Settings2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Import React Query hooks
import { PAPER_OPTIONS, PaperOption } from '../types';
import * as categoryService from '../services/categoryService';
import { Category } from '../types/api';

const Settings: React.FC = () => {
  const queryClient = useQueryClient(); // Get the query client instance
  const [paperOptions, setPaperOptions] = useState<PaperOption[]>(PAPER_OPTIONS);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | null>(null);
  const [editingPaperOption, setEditingPaperOption] = useState<{ index: number; option: PaperOption } | null>(null);
  const [newPaperOption, setNewPaperOption] = useState<PaperOption>({ name: '', grammars: [''] });

  // --- React Query for Categories ---

  // Query to fetch categories
  const { data: categories, isLoading, isError, error } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: async () => {
      const data = await categoryService.getCategories();
      // Filter for product type categories only
      return data.filter(cat => cat.type === 'product');
    },
  });

  // Mutation for adding a category
  const addCategoryMutation = useMutation<Category, Error, Omit<Category, 'id'>>({
    mutationFn: categoryService.addCategory,
    onSuccess: () => {
      // Invalidate the 'categories' query to refetch data after a successful addition
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setNewCategory(''); // Clear the input field
    },
    onError: (err) => {
      console.error('Error adding category:', err);
      // Optionally, display an error message
      alert(`Failed to add category: ${err.message}`);
    },
  });

  // Mutation for updating a category
  const updateCategoryMutation = useMutation<Category, Error, { id: string; data: Omit<Category, 'id'> }>({
    mutationFn: ({ id, data }) => categoryService.updateCategory(id, data),
    onSuccess: () => {
      // Invalidate the 'categories' query to refetch data after a successful update
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setEditingCategory(null); // Exit edit mode
    },
    onError: (err) => {
      console.error('Error updating category:', err);
      alert(`Failed to update category: ${err.message}`);
    },
  });

  // Mutation for deleting a category
  const deleteCategoryMutation = useMutation<void, Error, string>({
    mutationFn: categoryService.deleteCategory,
    onSuccess: () => {
      // Invalidate the 'categories' query to refetch data after a successful deletion
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (err) => {
      console.error('Error deleting category:', err);
      alert(`Failed to delete category: ${err.message}`);
    },
  });

  // --- Category Handlers ---

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategoryMutation.mutate({ name: newCategory.trim(), type: 'product' });
    }
  };

  const handleDeleteCategory = (id: string, name: string) => {
    // Confirmation dialog
    if (window.confirm(`Are you sure you want to delete the category "${name}"? This action cannot be undone.`)) {
      deleteCategoryMutation.mutate(id);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory({ id: category.id, name: category.name });
  };

  const handleSaveCategory = () => {
    if (editingCategory && editingCategory.name.trim()) {
      updateCategoryMutation.mutate({
        id: editingCategory.id,
        data: { name: editingCategory.name.trim(), type: 'product' },
      });
    }
  };

  // --- Paper Options Operations (unchanged) ---
  const handleAddPaperOption = () => {
    if (newPaperOption.name && newPaperOption.grammars.length > 0) {
      setPaperOptions([...paperOptions, { ...newPaperOption }]);
      setNewPaperOption({ name: '', grammars: [''] });
    }
  };

  const handleEditPaperOption = (index: number) => {
    setEditingPaperOption({ index, option: paperOptions[index] });
  };

  const handleSavePaperOption = () => {
    if (editingPaperOption && editingPaperOption.option.name) {
      const newPaperOptions = [...paperOptions];
      newPaperOptions[editingPaperOption.index] = editingPaperOption.option;
      setPaperOptions(newPaperOptions);
      setEditingPaperOption(null);
    }
  };

  const handleDeletePaperOption = (index: number) => {
    setPaperOptions(paperOptions.filter((_, i) => i !== index));
  };

  // --- Render Section ---
  if (isLoading) {
    return <div className="text-center py-8">Loading categories...</div>;
  }

  if (isError) {
    return <div className="text-center py-8 text-red-600">Error: {error?.message || 'Failed to load categories'}</div>;
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
          <Settings2 className="h-6 w-6" />
          Pengaturan
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage categories, and Paper type for Products.
        </p>
      </div>

      <div className="flex columns-2 mx-auto space-x-8 pt-2">
        {/* Product Categories Section */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Product Categories</h2>
          <div className="space-y-4">
            {/* Add New Category */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Add new category"
                className="input flex-1"
                disabled={addCategoryMutation.isPending} // Disable input while adding
              />
              <button
                onClick={handleAddCategory}
                className="btn btn-primary"
                disabled={addCategoryMutation.isPending} // Disable button while adding
              >
                <Plus size={20} />
                {addCategoryMutation.isPending ? 'Adding...' : 'Add'}
              </button>
            </div>
            {addCategoryMutation.isError && (
              <p className="text-red-500 text-sm">Error: {addCategoryMutation.error?.message}</p>
            )}

            {/* Categories List */}
            <div className="space-y-2">
              {categories?.map((category) => ( // Use optional chaining for categories
                <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  {editingCategory?.id === category.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                        className="input flex-1"
                        disabled={updateCategoryMutation.isPending}
                      />
                      <button
                        onClick={handleSaveCategory}
                        className="btn btn-success"
                        disabled={updateCategoryMutation.isPending}
                      >
                        <Save size={18} />
                      </button>
                      <button
                        onClick={() => setEditingCategory(null)}
                        className="btn btn-ghost"
                        disabled={updateCategoryMutation.isPending}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span>{category.name}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="btn btn-ghost"
                          disabled={deleteCategoryMutation.isPending || updateCategoryMutation.isPending}
                        >
                          <Pencil size={18} className="text-purple-500" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id, category.name)} // Pass category name for confirmation
                          className="btn btn-ghost text-red-500"
                          disabled={deleteCategoryMutation.isPending || updateCategoryMutation.isPending}
                        >
                          {deleteCategoryMutation.isPending && deleteCategoryMutation.variables === category.id ? (
                            'Deleting...'
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Paper Options Section (unchanged) */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Paper Options</h2>
          <div className="space-y-4">
            {/* Add New Paper Option */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  value={newPaperOption.name}
                  onChange={(e) => setNewPaperOption({ ...newPaperOption, name: e.target.value })}
                  placeholder="Paper name"
                  className="input w-full"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPaperOption.grammars.join(', ')}
                  onChange={(e) => setNewPaperOption({
                    ...newPaperOption,
                    grammars: e.target.value.split(',').map(g => g.trim()).filter(Boolean)
                  })}
                  placeholder="Grammars (comma-separated)"
                  className="input flex-1"
                />
                <button onClick={handleAddPaperOption} className="btn btn-primary">
                  <Plus size={20} />
                  Add
                </button>
              </div>
            </div>

            {/* Paper Options List */}
            <div className="space-y-2">
              {paperOptions.map((option, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  {editingPaperOption?.index === index ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={editingPaperOption.option.name}
                        onChange={(e) => setEditingPaperOption({
                          index: editingPaperOption.index,
                          option: { ...editingPaperOption.option, name: e.target.value }
                        })}
                        className="input flex-1"
                      />
                      <input
                        type="text"
                        value={editingPaperOption.option.grammars.join(', ')}
                        onChange={(e) => setEditingPaperOption({
                          index: editingPaperOption.index,
                          option: {
                            ...editingPaperOption.option,
                            grammars: e.target.value.split(',').map(g => g.trim()).filter(Boolean)
                          }
                        })}
                        placeholder="Grammars (comma-separated)"
                        className="input flex-1"
                      />
                      <button onClick={handleSavePaperOption} className="btn btn-success">
                        <Save size={18} />
                      </button>
                      <button onClick={() => setEditingPaperOption(null)} className="btn btn-ghost">
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h3 className="font-medium">{option.name}</h3>
                        <p className="text-sm text-gray-600">{option.grammars.join(', ')}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditPaperOption(index)} className="btn btn-ghost">
                          <Pencil size={18} className="text-purple-500" />
                        </button>
                        <button onClick={() => handleDeletePaperOption(index)} className="btn btn-ghost text-red-500">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Settings };