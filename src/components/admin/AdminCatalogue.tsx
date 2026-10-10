import React, { useState } from 'react';
import { Plus, Search, Edit2, Archive, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { Sticker, Category, StickerStyle } from '../../types';
import { storeService } from '../../services/storeService';

interface AdminCatalogueProps {
  stickers: Sticker[];
  categories: Category[];
  onStickerUpdated: () => void;
}

export const AdminCatalogue: React.FC<AdminCatalogueProps> = ({
  stickers,
  categories,
  onStickerUpdated,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');
  const [editingSticker, setEditingSticker] = useState<Partial<Sticker> | null>(null);
  const [selectedCatIds, setSelectedCatIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const filteredStickers = stickers.filter((s) => {
    if (selectedCatFilter !== 'all' && !s.categories?.some((c) => c.slug === selectedCatFilter)) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      return (
        s.name.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingSticker({
      name: '',
      slug: '',
      description: '',
      image_path: '/stickers/boba-ghost.svg',
      style: 'Kawaii',
      status: 'active',
      is_featured: false,
      track_inventory: true,
      stock_on_hand: 50,
      low_stock_threshold: 10,
      price: 3.5,
    });
    setSelectedCatIds([]);
  };

  const handleOpenEdit = (s: Sticker) => {
    setEditingSticker({ ...s });
    setSelectedCatIds(s.categories?.map((c) => c.id) || []);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSticker || !editingSticker.name) return;

    setIsSaving(true);
    try {
      const slug =
        editingSticker.slug ||
        editingSticker.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

      await storeService.saveSticker({ ...editingSticker, slug }, selectedCatIds);
      setEditingSticker(null);
      onStickerUpdated();
    } catch (err: any) {
      alert(`Error saving sticker: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchive = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to archive sticker "${name}"? Existing order references will be safely preserved.`)) {
      await storeService.archiveSticker(id);
      onStickerUpdated();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-brand-dark">
            Sticker Catalogue Manager
          </h1>
          <p className="font-body text-xs text-gray-600 font-medium mt-0.5">
            Add new sticker artwork, configure categories, tags, and inventory.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-neo-yellow py-2 px-4 text-xs sm:text-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Sticker</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border-3 border-brand-dark shadow-neo-sm">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sticker name, slug..."
            className="input-neo pl-9 py-1.5 text-xs"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        <select
          value={selectedCatFilter}
          onChange={(e) => setSelectedCatFilter(e.target.value)}
          className="px-3 py-1.5 rounded-xl border-2 border-brand-dark bg-white text-xs font-bold text-brand-dark shadow-neo-sm focus:outline-none"
        >
          <option value="all">All Categories ({stickers.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card-neo bg-white border-3 border-brand-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-mono">
                <th className="p-3.5">Artwork</th>
                <th className="p-3.5">Name</th>
                <th className="p-3.5">Style</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Inventory</th>
                <th className="p-3.5">Featured</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStickers.map((sticker) => (
                <tr key={sticker.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="p-3.5">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 border border-brand-dark p-0.5 flex items-center justify-center">
                      <img src={sticker.image_path} alt={sticker.name} className="max-h-full max-w-full object-contain" />
                    </div>
                  </td>
                  <td className="p-3.5 font-bold text-gray-800">
                    <div>{sticker.name}</div>
                    <div className="text-[10px] font-mono text-gray-400 font-normal">slug: {sticker.slug}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="badge-neo bg-gray-100 text-gray-800 text-[10px] py-0">
                      {sticker.style}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                        sticker.status === 'active'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-gray-100 text-gray-500 border-gray-300'
                      }`}
                    >
                      {sticker.status}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono">
                    {sticker.track_inventory ? `${sticker.stock_on_hand ?? 0} in stock` : 'Print to order'}
                  </td>
                  <td className="p-3.5 font-mono text-gray-500">
                    {sticker.is_featured ? '★ Yes' : 'No'}
                  </td>
                  <td className="p-3.5 text-right space-x-1.5">
                    <button
                      onClick={() => handleOpenEdit(sticker)}
                      className="p-1.5 rounded-lg border border-brand-dark bg-white hover:bg-gray-100 text-brand-dark"
                      title="Edit sticker"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {sticker.status === 'active' && (
                      <button
                        onClick={() => handleArchive(sticker.id, sticker.name)}
                        className="p-1.5 rounded-lg border border-brand-dark bg-white hover:bg-red-50 text-red-600"
                        title="Archive sticker"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {editingSticker && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/70 backdrop-blur-sm animate-in fade-in"
          onClick={() => setEditingSticker(null)}
        >
          <div
            className="card-neo w-full max-w-lg bg-white overflow-hidden relative shadow-neo-xl max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b-3 border-brand-dark bg-brand-yellow">
              <h2 className="font-display font-black text-xl text-brand-dark">
                {editingSticker.id ? 'Edit Sticker Design' : 'Create New Sticker'}
              </h2>
              <button
                onClick={() => setEditingSticker(null)}
                className="p-1.5 rounded-xl border-2 border-brand-dark bg-white hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-brand-dark" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs font-body">
              <div>
                <label className="block font-display font-bold uppercase tracking-wider text-brand-dark mb-1">
                  Sticker Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingSticker.name || ''}
                  onChange={(e) => setEditingSticker({ ...editingSticker, name: e.target.value })}
                  placeholder="e.g. Lavender Matcha Bear"
                  className="input-neo py-2"
                />
              </div>

              <div>
                <label className="block font-display font-bold uppercase tracking-wider text-brand-dark mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingSticker.description || ''}
                  onChange={(e) => setEditingSticker({ ...editingSticker, description: e.target.value })}
                  placeholder="Playful backstory or art description..."
                  className="input-neo py-2 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-display font-bold uppercase tracking-wider text-brand-dark mb-1">
                    Image Path or SVG URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSticker.image_path || ''}
                    onChange={(e) => setEditingSticker({ ...editingSticker, image_path: e.target.value })}
                    placeholder="/stickers/boba-ghost.svg"
                    className="input-neo py-2"
                  />
                </div>

                <div>
                  <label className="block font-display font-bold uppercase tracking-wider text-brand-dark mb-1">
                    Style
                  </label>
                  <select
                    value={editingSticker.style || 'Kawaii'}
                    onChange={(e) => setEditingSticker({ ...editingSticker, style: e.target.value as StickerStyle })}
                    className="input-neo py-2"
                  >
                    <option value="Kawaii">Kawaii</option>
                    <option value="Neo-Brutal">Neo-Brutal</option>
                    <option value="Pixel Art">Pixel Art</option>
                    <option value="Holographic">Holographic</option>
                    <option value="Retro">Retro</option>
                  </select>
                </div>
              </div>

              {/* Categories Checklist */}
              <div>
                <label className="block font-display font-bold uppercase tracking-wider text-brand-dark mb-1.5">
                  Assign Categories
                </label>
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl border-2 border-brand-dark bg-gray-50">
                  {categories.map((c) => (
                    <label key={c.id} className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedCatIds.includes(c.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCatIds([...selectedCatIds, c.id]);
                          } else {
                            setSelectedCatIds(selectedCatIds.filter((id) => id !== c.id));
                          }
                        }}
                        className="w-4 h-4 rounded border-2 border-brand-dark text-brand-pink"
                      />
                      <span>{c.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Inventory settings */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-display font-bold uppercase tracking-wider text-brand-dark mb-1">
                    Stock on Hand
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingSticker.stock_on_hand ?? 50}
                    onChange={(e) =>
                      setEditingSticker({ ...editingSticker, stock_on_hand: parseInt(e.target.value) || 0 })
                    }
                    className="input-neo py-2"
                  />
                </div>
                <div>
                  <label className="block font-display font-bold uppercase tracking-wider text-brand-dark mb-1">
                    Status
                  </label>
                  <select
                    value={editingSticker.status || 'active'}
                    onChange={(e: any) => setEditingSticker({ ...editingSticker, status: e.target.value })}
                    className="input-neo py-2"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingSticker(null)}
                  className="btn-neo-white text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-neo-yellow text-xs py-2 px-5 flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save Sticker'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
