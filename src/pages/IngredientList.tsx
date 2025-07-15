import React, { useState, useEffect } from 'react';
import { Plus, X, Edit, Trash2, ListChecks, Flag, Clock, Utensils } from 'lucide-react';
import IngredientForm from '../components/IngredientForm';
import Pagination from '../components/Pagination';
import { Ingredient, TaskTemplate } from '../types';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import ingredientService, { CreateIngredientPayload } from '../services/ingredientService';
import taskTemplateService from '../services/taskTemplateService';
import { formatCurrency } from '../lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';

const IngredientList: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | undefined>();
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [showTaskTemplates, setShowTaskTemplates] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [ingredientToDelete, setIngredientToDelete] = useState<Ingredient | null>(null);
  
  // New state for task template form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskTemplate['priority']>('medium');
  const [taskEstimatedTime, setTaskEstimatedTime] = useState<number>(2);

  // Fetch ingredients from API
  const fetchIngredients = async (page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await ingredientService.getIngredients({
        page,
        search: searchTerm || ''
      });
      
      console.log('API Response:', response);
      
      // Transform API response to match local Ingredient type
      const transformedIngredients: Ingredient[] = response.data.map(apiIngredient => {
        console.log('Task Templates for', apiIngredient.name, ':', apiIngredient.task_templates);
        return {
          id: apiIngredient.id,
          name: apiIngredient.name,
          description: apiIngredient.description || '',
          unit: apiIngredient.unit,
          price_per_unit: apiIngredient.price_per_unit,
          quantity: apiIngredient.quantity || '0',
          notes: apiIngredient.notes || '',
          task_templates: Array.isArray(apiIngredient.task_templates) ? apiIngredient.task_templates : [],
          stock: apiIngredient.stock || 0,
          branch_id: apiIngredient.branch_id || ''
        };
      });

      
      setIngredients(transformedIngredients);
      console.log('Transformed Ingredients:', ingredients);
      setTotalItems(response.meta.total);
      setItemsPerPage(response.meta.per_page);
      setCurrentPage(response.meta.current_page);
    } catch (err) {
      console.error('Error fetching ingredients:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching ingredients');
      toast.error('Failed to fetch ingredients');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients(currentPage);
  }, [currentPage, searchTerm]);

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

  const handleDeleteClick = (ingredient: Ingredient) => {
    setIngredientToDelete(ingredient);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!ingredientToDelete) return;

    try {
      await ingredientService.deleteIngredient(ingredientToDelete.id);
      // toast.success('Ingredient deleted successfully');
      await fetchIngredients(currentPage);
    } catch (err) {
      console.error('Error deleting ingredient:', err);
      let errorMessage = 'Failed to delete ingredient';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage, {
        duration: 5000
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setIngredientToDelete(null);
    }
  };

  const handleSubmit = async (ingredientData: CreateIngredientPayload) => {
    try {
      if (editingIngredient) {
        await ingredientService.updateIngredient(editingIngredient.id, ingredientData);
        // toast.success('Ingredient updated successfully');
      } else {
        await ingredientService.createIngredient(ingredientData);
        // toast.success('Ingredient created successfully');
      }
      
      await fetchIngredients(currentPage);
      setShowForm(false);
      setEditingIngredient(undefined);
    } catch (err) {
      console.error('Error submitting ingredient:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to save ingredient');
    }
  };

  const handleManageTaskTemplates = (ingredient: Ingredient) => {
    console.log('Selected Ingredient Task Templates:', ingredient.task_templates);
    setSelectedIngredient(ingredient);
    setShowTaskTemplates(true);
  };

  const handleDeleteTemplate = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task template?')) {
      try {
        await taskTemplateService.deleteTaskTemplate(taskId);
        // Refresh ingredients to get updated task templates
        await fetchIngredients(currentPage);
        // toast.success('Task template deleted successfully');
      } catch (err) {
        console.error('Error deleting template:', err);
        // toast.error('Failed to delete template');
      }
    }
  };

  const handleAddTaskTemplate = async () => {
    if (!taskTitle || !taskDescription || !taskEstimatedTime || !selectedIngredient) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await taskTemplateService.createTaskTemplate({
        title: taskTitle,
        description: taskDescription,
        priority: taskPriority,
        estimated_time: taskEstimatedTime,
        ingredient_id: selectedIngredient.id
      });

      // Refresh ingredients to get updated task templates
      await fetchIngredients(currentPage);
      toast.success('Task template added successfully');
      setIsFormOpen(false);
      resetTaskForm();
    } catch (err) {
      console.error('Error adding task template:', err);
      toast.error('Failed to add task template');
    }
  };

  const resetTaskForm = () => {
    setTaskTitle('');
    setTaskDescription('');
    setTaskPriority('medium');
    setTaskEstimatedTime(2);
  };

  if (isLoading && !ingredients.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error}</p>
          <button 
            onClick={() => fetchIngredients(currentPage)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
          <Utensils className="h-6 w-6" /> Bahan Baku</h1>
          <p className="mt-1 text-sm text-gray-500">
            Kelola Bahan Baku dan Propertinya
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="btn btn-outline-primary text-sm font-medium"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Tambah Bahan
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg pr-10"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
        <>
  {/* Table for medium and larger screens */}
  <div className="hidden md:block overflow-auto rounded-lg shadow"> {/* Hide on small, show on medium+ */}
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-200">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
            Nama
          </th>
          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
            Satuan
          </th>
          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
            Harga Per Satuan
          </th>
          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
            Stok
          </th>
          <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {ingredients.map((ingredient) => (
          <tr key={ingredient.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-indigo-600">
                <div className="flex-row items-center gap-y-2">
                  <span className='text-sm text-gray-900'>{ingredient.name}</span>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{ingredient.unit}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{formatCurrency(ingredient.price_per_unit)}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{ingredient.stock}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => handleManageTaskTemplates(ingredient)}
                  className="text-emerald-600 hover:text-emerald-900 hover:-translate-x-1 hover:scale-150"
                  title="Manage Task Templates"
                >
                  <ListChecks className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleEdit(ingredient)}
                  className="text-indigo-600 hover:text-indigo-900 hover:-translate-x-1 hover:scale-150"
                  title="Edit Ingredient"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteClick(ingredient)}
                  className="text-red-600 hover:text-red-900 hover:-translate-x-1 hover:scale-150"
                  title="Delete Ingredient"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Grid for small screens */}
  <div className="grid grid-cols-1 m-2 gap-4 md:hidden"> {/* Show on small, hide on medium+ */}
    {ingredients.map((ingredient) => (
      <div key={ingredient.id} className="bg-white p-4 rounded-lg shadow space-y-3">
        {/* Nama */}
        <div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</div>
          <div className="text-sm font-medium text-gray-900">{ingredient.name}</div>
        </div>

        {/* Satuan */}
        <div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Satuan</div>
          <div className="text-sm text-gray-900">{ingredient.unit}</div>
        </div>

        {/* Harga Per Satuan */}
        <div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Harga Per Satuan</div>
          <div className="text-sm text-gray-900">{formatCurrency(ingredient.price_per_unit)}</div>
        </div>

        {/* Stok */}
        <div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</div>
          <div className="text-sm text-gray-900">{ingredient.stock}</div>
        </div>

        {/* Aksi */}
        <div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</div>
          <div className="flex justify-start space-x-3 mt-2"> {/* Changed justify-end to justify-start for mobile */}
            <button
              onClick={() => handleManageTaskTemplates(ingredient)}
              className="text-emerald-600 hover:text-emerald-900"
              title="Manage Task Templates"
            >
              <ListChecks className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleEdit(ingredient)}
              className="text-indigo-600 hover:text-indigo-900"
              title="Edit Ingredient"
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleDeleteClick(ingredient)}
              className="text-red-600 hover:text-red-900"
              title="Delete Ingredient"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</>
        </div>
      </div>

      {totalItems > itemsPerPage && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {editingIngredient ? 'Edit Ingredient' : 'Add New Ingredient'}
            </h2>
            <IngredientForm
              initialIngredient={editingIngredient}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingIngredient(undefined);
              }}
            />
          </div>
        </div>
      )}

      {showTaskTemplates && selectedIngredient && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Task Templates - {selectedIngredient.name}
              </h2>
              <button
                onClick={() => {
                  setShowTaskTemplates(false);
                  setSelectedIngredient(undefined);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {selectedIngredient.task_templates?.map((task, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between bg-gray-50 p-3 rounded"
                >
                  <div className="flex w-full">
                    <div className="w-8/12 items-center gap-2">
                      <div className="font-semibold">{task.title}</div>
                      <div className="text-xs text-gray-500">{task.description}</div>
                    </div>
                    <div className="flex w-3/12 justify-between text-xs">
                     <div> <div><Flag size={16} /> Prioritas:</div> {task.priority}</div> 
                     <div> <div><Clock size={16} /> Estimasi:</div> {task.estimated_time} menit</div>  
                    </div>
                    <div className="w-1/12 items-center m-auto">
                          <button
                        onClick={() => handleDeleteTemplate(task.id)}
                        className="pl-6 text-red-500 hover:text-red-700 mouse-pointer hover:-translate-x-1 hover:scale-150"
                      >
                        <Trash2 className="h-5 w-5" />
                          </button>
                    </div>
                  </div>
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
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus bahan "{ingredientToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setIngredientToDelete(null);
              }}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IngredientList;
