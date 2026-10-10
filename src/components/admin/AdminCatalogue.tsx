import React, { useState } from 'react';
import { Plus, Search, Edit2, Archive, CheckCircle, AlertTriangle, X, Sparkles, Trash2, ArrowRight } from 'lucide-react';
import { Sticker, Category, StickerStyle } from '../../types';
import { storeService } from '../../services/storeService';
import { groqService } from '../../services/groqService';

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

  // AI Bulk Dump Modal State
  const [isAiBulkDumpOpen, setIsAiBulkDumpOpen] = useState(false);
  const [rawBulkText, setRawBulkText] = useState('');
  const [isAiParsing, setIsAiParsing] = useState(false);
  const [parsedStickers, setParsedStickers] = useState<any[]>([]);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isBatchSaving, setIsBatchSaving] = useState(false);

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

  // AI Bulk Dump handler using Groq
  const handleRunAiBulkDump = async () => {
    if (!rawBulkText.trim()) return;
    setIsAiParsing(true);
    setAiError(null);

    try {
      const results = await groqService.parseAndDumpStickers(rawBulkText, categories);
      setParsedStickers(results);
    } catch (err: any) {
      setAiError(err.message || 'Groq AI failed to parse stickers. Please check your API key.');
    } finally {
      setIsAiParsing(false);
    }
  };

  // Commit all parsed stickers to database
  const handleSaveAllParsedStickers = async () => {
    if (parsedStickers.length === 0) return;
    setIsBatchSaving(true);

    try {
      // SVGs pool for assigning graphics
      const svgPool = [
        '/stickers/cat-coder.svg',
        '/stickers/anime-coder.svg',
        '/stickers/matcha-frog.svg',
        '/stickers/code-mode.svg',
        '/stickers/boba-ghost.svg',
        '/stickers/cyber-deck.svg',
        '/stickers/coffee-first.svg',
        '/stickers/chill-guy.svg',
      ];

      for (let i = 0; i < parsedStickers.length; i++) {
        const item = parsedStickers[i];
        const assignedImage = svgPool[i % svgPool.length];

        // Find matching category ID or default to first category
        const matchedCategory = categories.find(
          (c) => c.slug.toLowerCase() === (item.suggestedCategory || '').toLowerCase()
        ) || categories[0];

        await storeService.saveSticker(
          {
            name: item.name,
            slug: item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: item.description,
            image_path: assignedImage,
            style: item.style || 'Kawaii',
            status: 'active',
            is_featured: false,
            track_inventory: true,
            stock_on_hand: 50,
            low_stock_threshold: 10,
            price: 3.5,
          },
          matchedCategory ? [matchedCategory.id] : []
        );
      }

      onStickerUpdated();
      setIsAiBulkDumpOpen(false);
      setParsedStickers([]);
      setRawBulkText('');
      alert(`Success! Successfully added ${parsedStickers.length} stickers to the catalogue.`);
    } catch (err: any) {
      alert(`Error saving batch: ${err.message}`);
    } finally {
      setIsBatchSaving(false);
    }
  };

  const handleRemoveParsedItem = (idx: number) => {
    setParsedStickers((prev) => prev.filter((_, i) => i !== idx));
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

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsAiBulkDumpOpen(true)}
            className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl border-2 border-brand-dark bg-[#EBD4FF] hover:bg-purple-200 text-purple-950 font-display font-bold text-xs sm:text-sm shadow-neo-sm transition-all"
            title="Dump raw text/ideas of stickers and let Groq AI categorize and structure them automatically"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>AI Bulk Dump (Groq)</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="btn-neo-yellow py-2 px-4 text-xs sm:text-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Sticker</span>
          </button>
        </div>
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

      {/* AI Bulk Dump Modal */}
      {isAiBulkDumpOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/75 backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsAiBulkDumpOpen(false)}
        >
          <div
            className="card-neo w-full max-w-2xl bg-white overflow-hidden relative shadow-neo-xl max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b-3 border-brand-dark bg-[#EBD4FF]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-display font-black text-xl text-brand-dark">
                    AI Bulk Sticker Dump
                  </h2>
                  <p className="font-mono text-[11px] text-purple-900 font-bold">
                    Powered by Groq Llama 3.3 — Instant auto-categorization &amp; formatting
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAiBulkDumpOpen(false)}
                className="p-1.5 rounded-xl border-2 border-brand-dark bg-white hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-brand-dark" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              {aiError && (
                <div className="p-3.5 rounded-xl bg-red-50 border-2 border-red-500 text-red-800 text-xs font-bold flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>{aiError}</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-display font-bold text-xs uppercase tracking-wider text-brand-dark">
                    Paste Raw Sticker Ideas / Dump Text
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setRawBulkText(
                        'Cyberpunk Neon Cat with goggles, Boba Ghost drinking matcha boba, 80s Synthwave Sunset cassette tape, Git Commit Coffee Mug with funny terminal quote, Pixel Sword 16-bit RPG retro'
                      )
                    }
                    className="text-[11px] font-mono font-bold text-purple-700 hover:underline"
                  >
                    Insert Example
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={rawBulkText}
                  onChange={(e) => setRawBulkText(e.target.value)}
                  placeholder="Paste any raw notes, comma-separated sticker ideas, or brainstorming dump here..."
                  className="w-full p-3 rounded-2xl border-2 border-brand-dark bg-[#FAF7F2] font-body text-xs resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
                  disabled={isAiParsing}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleRunAiBulkDump}
                  disabled={isAiParsing || !rawBulkText.trim()}
                  className="btn-neo-pink text-xs py-2 px-5 flex items-center gap-2"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isAiParsing ? 'animate-spin' : ''}`} />
                  <span>{isAiParsing ? 'Analyzing with Groq AI...' : 'Sort & Categorize with Groq AI'}</span>
                </button>
              </div>

              {/* Parsed Results Preview */}
              {parsedStickers.length > 0 && (
                <div className="pt-3 border-t-2 border-gray-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-sm text-brand-dark">
                      AI Generated Stickers ({parsedStickers.length})
                    </span>
                    <span className="text-[11px] font-mono text-gray-500">
                      Review before committing to catalogue
                    </span>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {parsedStickers.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border-2 border-brand-dark bg-yellow-50/50 flex items-start justify-between gap-3 shadow-neo-sm"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-display font-bold text-xs text-brand-dark">
                              {item.name}
                            </span>
                            <span className="badge-neo bg-purple-100 text-purple-800 text-[10px] py-0">
                              {item.style}
                            </span>
                            <span className="badge-neo bg-white text-gray-700 text-[10px] py-0">
                              Category: {item.suggestedCategory}
                            </span>
                          </div>
                          <p className="text-[11px] font-body text-gray-600">
                            {item.description}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveParsedItem(idx)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Remove from batch"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setParsedStickers([])}
                      className="text-xs font-mono text-gray-500 hover:text-black"
                    >
                      Clear Results
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveAllParsedStickers}
                      disabled={isBatchSaving}
                      className="btn-neo-yellow text-xs py-2 px-6 flex items-center gap-2 font-bold"
                    >
                      {isBatchSaving ? (
                        <span>Adding Stickers to Database...</span>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Add All ({parsedStickers.length}) to Catalogue</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
