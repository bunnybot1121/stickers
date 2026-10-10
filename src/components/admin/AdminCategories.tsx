import React, { useState } from 'react';
import { Plus, Edit2, CheckCircle, X } from 'lucide-react';
import { Category } from '../../types';
import { storeService } from '../../services/storeService';

interface AdminCategoriesProps {
  categories: Category[];
  onCategoryUpdated: () => void;
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({
  categories,
  onCategoryUpdated,
}) => {
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenAdd = () => {
    setEditingCategory({
      name: '',
      slug: '',
      description: '',
      icon_name: 'Sparkles',
      sort_order: categories.length + 1,
      is_active: true,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name) return;

    setIsSaving(true);
    try {
      const slug =
        editingCategory.slug ||
        editingCategory.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

      await storeService.saveCategory({ ...editingCategory, slug });
      setEditingCategory(null);
      onCategoryUpdated();
    } catch (err: any) {
      alert(`Error saving category: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-brand-dark">
            Category &amp; Tag Manager
          </h1>
          <p className="font-body text-xs text-gray-600 font-medium mt-0.5">
            Categories are dynamic and data-driven—add or edit genres without code changes.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-neo-yellow py-2 px-4 text-xs sm:text-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="card-neo p-5 bg-white border-3 border-brand-dark flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="badge-neo bg-brand-cyan text-brand-dark text-[10px]">
                  Order #{cat.sort_order}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    cat.is_active ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {cat.is_active ? 'Active' : 'Hidden'}
                </span>
              </div>
              <h3 className="font-display font-bold text-lg text-brand-dark mb-1">
                {cat.name}
              </h3>
              <p className="font-mono text-xs text-gray-400 mb-2">
                slug: {cat.slug}
              </p>
              <p className="font-body text-xs text-gray-600">
                {cat.description || 'No description provided.'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setEditingCategory({ ...cat })}
                className="btn-neo-white text-xs py-1 px-3 flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingCategory && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/70 backdrop-blur-sm animate-in fade-in"
          onClick={() => setEditingCategory(null)}
        >
          <div
            className="card-neo w-full max-w-md bg-white overflow-hidden relative shadow-neo-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b-3 border-brand-dark bg-brand-yellow">
              <h2 className="font-display font-black text-xl text-brand-dark">
                {editingCategory.id ? 'Edit Category' : 'New Category'}
              </h2>
              <button onClick={() => setEditingCategory(null)} className="p-1.5 rounded-xl border-2 border-brand-dark bg-white">
                <X className="w-5 h-5 text-brand-dark" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs font-body">
              <div>
                <label className="block font-display font-bold uppercase tracking-wider text-brand-dark mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  placeholder="e.g. Pixel Nostalgia"
                  className="input-neo py-2"
                />
              </div>

              <div>
                <label className="block font-display font-bold uppercase tracking-wider text-brand-dark mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="input-neo py-2 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-display font-bold uppercase tracking-wider text-brand-dark mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={editingCategory.sort_order ?? 1}
                    onChange={(e) => setEditingCategory({ ...editingCategory, sort_order: parseInt(e.target.value) || 1 })}
                    className="input-neo py-2"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-brand-dark">
                    <input
                      type="checkbox"
                      checked={editingCategory.is_active ?? true}
                      onChange={(e) => setEditingCategory({ ...editingCategory, is_active: e.target.checked })}
                      className="w-4 h-4 rounded border-2 border-brand-dark text-brand-pink"
                    />
                    <span>Active in Storefront</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
                <button type="button" onClick={() => setEditingCategory(null)} className="btn-neo-white text-xs py-2 px-3">
                  Cancel
                </button>
                <button type="submit" disabled={isSaving} className="btn-neo-yellow text-xs py-2 px-4 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
