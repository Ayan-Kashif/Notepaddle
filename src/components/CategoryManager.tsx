




import React, { useState, useEffect } from 'react';
import { X, Plus, Edit3, Trash2, Check, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  color: string;
  isDefault?: boolean;
  createdAt?: Date;
}

const CategoryManager = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [user, setUser] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#6366F1');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const predefinedColors = [
    '#6366F1', '#8B5CF6', '#10B981', '#F59E0B',
    '#EF4444', '#06B6D4', '#84CC16', '#F97316',
    '#EC4899', '#6B7280', '#8B5A2B', '#059669'
  ];

  const DEFAULT_CATEGORIES = [
    { id: 'personal', name: 'Personal', color: '#6366F1', isDefault: true },
    { id: 'work', name: 'Work', color: '#8B5CF6', isDefault: true },
    { id: 'ideas', name: 'Ideas', color: '#10B981', isDefault: true },
    { id: 'todo', name: 'To-Do', color: '#F59E0B', isDefault: true },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setUser(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const loadCategories = async () => {
      setIsLoading(true);
      try {
        if (user) {
          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/users/categories`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          const data = await response.json();
          setCategories(data.categories);
        } else {
          const saved = localStorage.getItem('guest_categories');
          const customCategories = saved ? JSON.parse(saved) : [];
          setCategories([...DEFAULT_CATEGORIES, ...customCategories]);
        }
        toast.success('Categories loaded');
      } catch (err) {
        toast.error('Failed to load categories');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, [isOpen, user]);

  const saveCategories = async (updatedCategories: Category[]) => {
    try {
      // Filter out default categories before saving
      const customCategories = updatedCategories.filter(cat => !cat.isDefault);

      if (user) {
        await fetch(`${import.meta.env.VITE_BASE_URL}/api/users/categories`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ categories: customCategories })
        });
      } else {
        localStorage.setItem('guest_categories', JSON.stringify(customCategories));
      }
      
      // Always include defaults when setting state
      setCategories([...DEFAULT_CATEGORIES, ...customCategories]);
      toast.success('Categories saved');
      return true;
    } catch (err) {
      toast.error(user ? 'Failed to save to server' : 'Failed to save locally');
      console.error(err);
      return false;
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }

    setIsLoading(true);

    const newCategory = {
      id: `custom_${Date.now()}`,
      name: newCategoryName.trim(),
      color: newCategoryColor,
      createdAt: new Date()
    };

    const updatedCategories = [...categories, newCategory];
    const success = await saveCategories(updatedCategories);

    if (success) {
      setNewCategoryName('');
      setNewCategoryColor('#6366F1');
      toast.success('Category added');
    }

    setIsLoading(false);
  };

  const handleUpdateCategory = async (id: string) => {
    if (!editingName.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }

    setIsLoading(true);

    const updatedCategories = categories.map(cat =>
      cat.id === id ? { ...cat, name: editingName.trim() } : cat
    );

    await saveCategories(updatedCategories);
    setEditingId(null);
    toast.success('Category updated');
    setIsLoading(false);
  };

  const handleDeleteCategory = async (id: string) => {
    const category = categories.find(c => c.id === id);
    if (category?.isDefault) {
      toast.error('Default categories cannot be deleted');
      return;
    }

    setIsLoading(true);

    const updatedCategories = categories.filter(cat => cat.id !== id);
    await saveCategories(updatedCategories);
    toast.success('Category deleted');
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manage Categories
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Add New Category */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Add New Category
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Category name..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                disabled={isLoading}
              />
              <div className="space-y-3">
                <label className="text-md font-medium text-gray-700 dark:text-gray-300">
                  Choose Color
                </label>
                <div className="grid grid-cols-6 gap-3">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewCategoryColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                        newCategoryColor === color
                          ? 'border-gray-900 dark:border-white scale-110'
                          : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                      disabled={isLoading}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim() || isLoading}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 mx-auto animate-spin" />
                ) : (
                  'Add Category'
                )}
              </button>
            </div>
          </div>

          {/* Existing Categories */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Your Categories
            </h3>
            {isLoading && categories.length === 0 ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : categories.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4 text-lg">
                No categories yet
              </p>
            ) : (
              <div className="space-y-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      category.isDefault 
                        ? 'bg-gray-100 dark:bg-gray-800' 
                        : 'bg-white dark:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className={`text-lg ${
                        category.isDefault 
                          ? 'font-bold text-gray-900 dark:text-white' 
                          : 'text-gray-800 dark:text-gray-200'
                      }`}>
                        {category.name}
                      </span>
                      {category.isDefault && (
                        <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    {!category.isDefault && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingId(category.id);
                            setEditingName(category.name);
                          }}
                          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors duration-200"
                          disabled={isLoading}
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                          disabled={isLoading}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;