
import { useState } from "react";
// import AppNavbar from "../components/AppNavbar";
import { useQuery } from "@tanstack/react-query";
import  transactionServices  from "../services/transactionServices";
import { CategoryManagementCard } from "../components/categories/CategoryManagementCard";
import { CategoryManagementForm } from "../components/categories/CategoryManagementForm";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";
import type { Category } from "../types/api";

const CategoryManagement = () => {
  const [financeCategory, setFinanceCategories] =  useState<Category[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');

  const { data: categories = financeCategory, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await transactionServices.getCategories();
      setFinanceCategories(response);
      console.log('Fetched categories:', response);
      console.log('Categories is array:', Array.isArray(response));
      return response;
    },
    retry: false
  });

  if (isLoading) {
    return (
      <div>
        {/* <AppNavbar /> */}
        <div className="min-h-screen bg-teal-500">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">Manajemen Kategori</h1>
            </div>
            <p className="text-white">Memuat...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        {/* <AppNavbar /> */}
        <div className="min-h-screen bg-teal-500">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">Manajemen Kategori</h1>
            </div>
            <p className="text-red-200">Gagal memuat kategori</p>
          </div>
        </div>
      </div>
    );
  }

  const expenseCategories = categories.filter(cat => cat.type === 'expense');
  const incomeCategories = categories.filter(cat => cat.type === 'income');

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteCategory(id);
  };

  const handleSave = (categoryData: { key: string; label: string; icon: string; color: string; type: 'expense' | 'income' }) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
    } else {
      addCategory(categoryData);
    }
    setEditingCategory(undefined);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCategory(undefined);
  };

  const handleAddCategory = () => {
    setEditingCategory(undefined);
    setIsFormOpen(true);
  };

  return (
    <div>
      {/* <AppNavbar /> */}
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-purple-700">Manajemen Kategori</h1>
            <Button 
              onClick={handleAddCategory}
              className="bg-purple-600 hover:bg-purple-700 text-white border-none"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kategori
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="flex ml-6 ">
            <button
              onClick={() => setActiveTab('expense')}
              className={`px-6 py-3 rounded-t-lg font-medium transition-colors ${
                activeTab === 'expense'
                  ? 'bg-purple-100 text-prple-600 '
                  : 'bg-purple-400 text-white hover:bg-purple-300'
              }`}
            >
              Kategori Pengeluaran
            </button>
            <button
              onClick={() => setActiveTab('income')}
              className={`px-6 -ml-4 py-3 rounded-t-lg font-medium transition-colors ${
                activeTab === 'income'
                  ? 'bg-purple-100 text-purple-600 '
                  : 'bg-purple-400 text-white hover:bg-purple-300'
              }`}
            >
              Kategori Pemasukan
            </button>
          </div>

          {/* Category Grid */}
          <div className="grid p-4 rounded-2xl border-2 border-purple-600 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {(activeTab === 'expense' ? expenseCategories : incomeCategories).map((category) => (
              <CategoryManagementCard
                key={category.id}
                category={category}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <CategoryManagementForm
            category={editingCategory}
            isOpen={isFormOpen}
            onClose={handleCloseForm}
            onSave={handleSave}
            defaultType={activeTab}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;
