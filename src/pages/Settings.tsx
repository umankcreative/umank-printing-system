// src/pages/Settings.tsx
import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { PRODUCT_CATEGORIES, PAPER_OPTIONS, PaperOption } from '../types';

const Settings: React.FC = () => {
  const [categories, setCategories] = useState<string[]>(PRODUCT_CATEGORIES);
  const [paperOptions, setPaperOptions] = useState<PaperOption[]>(PAPER_OPTIONS);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<{ index: number; value: string } | null>(null);
  const [editingPaperOption, setEditingPaperOption] = useState<{ index: number; option: PaperOption } | null>(null);

  
  const [newPaperOption, setNewPaperOption] = useState<PaperOption>({ name: '', grammars: [''] });

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleEditCategory = (index: number) => {
    setEditingCategory({ index, value: categories[index] });
  };

  const handleSaveCategory = () => {
    if (editingCategory && editingCategory.value.trim()) {
      const newCategories = [...categories];
      newCategories[editingCategory.index] = editingCategory.value;
      setCategories(newCategories);
      setEditingCategory(null);
    }
  };

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

  return (
    <div>
      <div>
          <h1 className="text-2xl font-bold text-gray-900">Setting</h1>
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
            />
            <button onClick={handleAddCategory} className="btn btn-primary">
              <Plus size={20} />
              Add
            </button>
          </div>

          {/* Categories List */}
          <div className="space-y-2">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                {editingCategory?.index === index ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editingCategory.value}
                      onChange={(e) => setEditingCategory({ ...editingCategory, value: e.target.value })}
                      className="input flex-1"
                    />
                    <button onClick={handleSaveCategory} className="btn btn-success">
                      <Save size={18} />
                    </button>
                    <button onClick={() => setEditingCategory(null)} className="btn btn-ghost">
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span>{category}</span>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditCategory(index)} className="btn btn-ghost">
                        <Pencil size={18} className="text-purple-500" />
                      </button>
                      <button onClick={() => handleDeleteCategory(index)} className="btn btn-ghost text-red-500">
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

      {/* Paper Options Section */}
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