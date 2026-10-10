import React, { useState, useRef } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Archive,
  CheckCircle,
  AlertTriangle,
  X,
  Sparkles,
  Trash2,
  UploadCloud,
  FileImage,
  FolderPlus,
  SlidersHorizontal,
  Check,
} from 'lucide-react';
import { Sticker, Category, StickerStyle } from '../../types';
import { storeService } from '../../services/storeService';
import { groqService } from '../../services/groqService';

interface AdminCatalogueProps {
  stickers: Sticker[];
  categories: Category[];
  onStickerUpdated: () => void;
}

interface UploadedFilePreview {
  file: File;
  previewUrl: string;
  name: string;
  size: number;
}

interface SortedStickerDraft {
  originalFileName: string;
  previewUrl: string;
  name: string;
  slug: string;
  description: string;
  categorySlug: string;
  style: StickerStyle;
  tags: string[];
  price: number;
  stockOnHand: number;
  displayOrder: number;
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

  // Bulk Upload Modal State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkMode, setBulkMode] = useState<'files' | 'text'>('files');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFilePreview[]>([]);
  const [isAiSorting, setIsAiSorting] = useState(false);
  const [sortedBatch, setSortedBatch] = useState<SortedStickerDraft[]>([]);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isCommittingBatch, setIsCommittingBatch] = useState(false);

  // Raw text dump state
  const [rawBulkText, setRawBulkText] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

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
      image_path: '/stickers/cat-programmer.jpg',
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

  // Handle Multi-file selection / drop
  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setAiError(null);

    const newPreviews: UploadedFilePreview[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push({
          file,
          previewUrl: (e.target?.result as string) || URL.createObjectURL(file),
          name: file.name,
          size: file.size,
        });
        if (newPreviews.length === files.length) {
          setUploadedFiles((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Run Groq AI Auto-Sort & Labeling on bulk uploaded files
  const handleRunGroqAutoSort = async () => {
    if (uploadedFiles.length === 0) return;
    setIsAiSorting(true);
    setAiError(null);

    try {
      const res = await groqService.sortAndLabelUploadedFiles(
        uploadedFiles.map((u) => ({ name: u.name, size: u.size })),
        categories
      );

      setAiSummary(res.summary);

      // Map Groq's output to preview items with live images
      const drafts: SortedStickerDraft[] = res.sortedStickers.map((item, idx) => {
        const matchingFile = uploadedFiles.find((f) => f.name === item.originalFileName) || uploadedFiles[idx];
        return {
          originalFileName: item.originalFileName,
          previewUrl: matchingFile ? matchingFile.previewUrl : '/stickers/cat-programmer.jpg',
          name: item.name,
          slug: item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: item.description,
          categorySlug: item.categorySlug,
          style: (item.style as StickerStyle) || 'Kawaii',
          tags: item.tags || [],
          price: 3.5,
          stockOnHand: 50,
          displayOrder: item.displayOrder || idx + 1,
        };
      });

      setSortedBatch(drafts);
    } catch (err: any) {
      setAiError(err.message || 'Failed to sort stickers with Groq AI.');
    } finally {
      setIsAiSorting(false);
    }
  };

  // Save all sorted stickers to store catalogue
  const handleCommitBatchToCatalogue = async () => {
    if (sortedBatch.length === 0) return;
    setIsCommittingBatch(true);

    try {
      for (const draft of sortedBatch) {
        const matchedCategory =
          categories.find((c) => c.slug.toLowerCase() === draft.categorySlug.toLowerCase()) ||
          categories[0];

        await storeService.saveSticker(
          {
            name: draft.name,
            slug: draft.slug,
            description: draft.description,
            image_path: draft.previewUrl,
            style: draft.style,
            status: 'active',
            is_featured: false,
            track_inventory: true,
            stock_on_hand: draft.stockOnHand,
            low_stock_threshold: 10,
            price: draft.price,
          },
          matchedCategory ? [matchedCategory.id] : []
        );
      }

      onStickerUpdated();
      setIsBulkModalOpen(false);
      setUploadedFiles([]);
      setSortedBatch([]);
      setAiSummary(null);
      alert(`🎉 Successfully published ${sortedBatch.length} stickers to the store catalogue!`);
    } catch (err: any) {
      alert(`Error publishing batch: ${err.message}`);
    } finally {
      setIsCommittingBatch(false);
    }
  };

  const handleUpdateDraft = (index: number, field: keyof SortedStickerDraft, value: any) => {
    setSortedBatch((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveDraftItem = (index: number) => {
    setSortedBatch((prev) => prev.filter((_, i) => i !== index));
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
      alert(`Failed to save sticker: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2B2E42]">
        <div>
          <h1 className="font-display font-black text-2xl text-white tracking-tight flex items-center gap-2">
            <span>Sticker Catalogue</span>
            <span className="badge-neo bg-[#FF6EB4] text-white text-xs px-2.5 py-0.5">
              {stickers.length} Designs
            </span>
          </h1>
          <p className="font-mono text-xs text-gray-400 mt-1">
            Manage store designs, pricing, styles, and bulk auto-sorting with Groq AI
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Groq AI Bulk Uploader & Auto-Sorter Button */}
          <button
            onClick={() => {
              setIsBulkModalOpen(true);
              setUploadedFiles([]);
              setSortedBatch([]);
              setAiSummary(null);
              setAiError(null);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-brand-dark bg-gradient-to-r from-[#A855F7] to-[#EC4899] hover:from-purple-600 hover:to-pink-600 active:translate-y-0.5 text-white font-display font-bold text-xs shadow-neo transition-all"
          >
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>⚡ Bulk Upload &amp; Groq AI Sort</span>
          </button>

          {/* Add Single Sticker */}
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-brand-dark bg-[#FACC15] hover:bg-yellow-400 active:translate-y-0.5 text-brand-dark font-display font-bold text-xs shadow-neo transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Sticker</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stickers by title, slug, or style..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#181A26] border border-[#2B2E42] text-white placeholder-gray-500 font-body text-xs focus:outline-none focus:border-[#FF6EB4]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCatFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-colors border ${
              selectedCatFilter === 'all'
                ? 'bg-[#FF6EB4] text-white border-[#FF6EB4]'
                : 'bg-[#181A26] text-gray-400 border-[#2B2E42] hover:text-white'
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCatFilter(c.slug)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-colors border ${
                selectedCatFilter === c.slug
                  ? 'bg-[#FF6EB4] text-white border-[#FF6EB4]'
                  : 'bg-[#181A26] text-gray-400 border-[#2B2E42] hover:text-white'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Stickers Table */}
      <div className="rounded-2xl border border-[#2B2E42] bg-[#181A26] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-body">
            <thead className="bg-[#12131A] text-gray-400 uppercase font-mono text-[10px] tracking-wider border-b border-[#2B2E42]">
              <tr>
                <th className="py-3 px-4">Sticker</th>
                <th className="py-3 px-4">Style</th>
                <th className="py-3 px-4">Categories</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2B2E42] text-gray-300">
              {filteredStickers.map((s) => (
                <tr key={s.id} className="hover:bg-[#1f2233] transition-colors">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 p-1 flex items-center justify-center flex-shrink-0 border border-white/20">
                      <img
                        src={s.image_path}
                        alt={s.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div>
                      <span className="font-display font-bold text-white text-xs block">
                        {s.name}
                      </span>
                      <span className="font-mono text-[10px] text-gray-400">
                        /{s.slug}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md font-mono text-[10px] bg-purple-900/60 text-purple-300 border border-purple-700">
                      {s.style}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {s.categories?.map((c) => (
                        <span
                          key={c.id}
                          className="px-2 py-0.5 rounded-md font-mono text-[10px] bg-gray-800 text-gray-300 border border-gray-700"
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono">
                    <span
                      className={
                        (s.stock_on_hand ?? 0) <= (s.low_stock_threshold ?? 10)
                          ? 'text-amber-400 font-bold'
                          : 'text-gray-300'
                      }
                    >
                      {s.stock_on_hand} in stock
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-white">
                    ₹{(s.price * 14).toFixed(0)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleOpenEdit(s)}
                      className="p-1.5 rounded-lg border border-[#2B2E42] bg-[#12131A] text-gray-300 hover:text-white hover:border-[#FF6EB4] transition-colors"
                      title="Edit sticker"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          GROQ AI BULK UPLOADER & AUTO-SORTER MODAL
          ========================================================================= */}
      {isBulkModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setIsBulkModalOpen(false)}
        >
          <div
            className="w-full max-w-4xl bg-[#181A26] rounded-3xl border-3 border-[#2B2E42] overflow-hidden shadow-2xl max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#2B2E42] bg-gradient-to-r from-[#211832] to-[#181A26]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#A855F7] to-[#EC4899] text-white flex items-center justify-center shadow-md">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h2 className="font-display font-black text-lg text-white">
                    Bulk Sticker Uploader &amp; Groq AI Auto-Sorter
                  </h2>
                  <p className="font-mono text-xs text-purple-300">
                    Upload batches of sticker artwork — Groq AI categorizes, labels, and sorts them into store order
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="p-2 rounded-xl border border-[#2B2E42] bg-[#12131A] text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
              {aiError && (
                <div className="p-3.5 rounded-2xl bg-red-950/70 border border-red-500 text-red-200 text-xs font-semibold flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>{aiError}</span>
                </div>
              )}

              {/* Upload Dropzone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFilesSelected(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#A855F7]/50 hover:border-[#FF6EB4] bg-[#12131A]/70 hover:bg-[#1e1b2e] rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={(e) => handleFilesSelected(e.target.files)}
                  className="hidden"
                />
                <div className="w-14 h-14 rounded-2xl bg-[#A855F7]/20 border border-[#A855F7]/40 text-[#EC4899] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <h3 className="font-display font-bold text-sm text-white mb-1">
                  Drag and drop multiple sticker artwork files here
                </h3>
                <p className="font-mono text-xs text-gray-400 mb-3">
                  Select 5, 10, 20+ images at once (PNG, JPG, SVG, WebP)
                </p>
                <span className="inline-block px-3 py-1.5 rounded-xl bg-[#2B2E42] text-gray-200 font-mono text-[11px] font-bold">
                  Browse Files
                </span>
              </div>

              {/* Uploaded Files Strip */}
              {uploadedFiles.length > 0 && sortedBatch.length === 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-xs text-gray-200">
                      {uploadedFiles.length} Artwork Files Selected
                    </span>
                    <button
                      onClick={() => setUploadedFiles([])}
                      className="text-xs font-mono text-gray-400 hover:text-red-400"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Thumbnail Row */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5 max-h-48 overflow-y-auto p-2 bg-[#12131A] rounded-2xl border border-[#2B2E42]">
                    {uploadedFiles.map((u, i) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded-xl bg-white/5 border border-white/10 p-1.5 flex flex-col items-center justify-center group"
                        title={u.name}
                      >
                        <img
                          src={u.previewUrl}
                          alt={u.name}
                          className="max-h-full max-w-full object-contain"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadedFiles((prev) => prev.filter((_, idx) => idx !== i));
                          }}
                          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Groq AI Trigger Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleRunGroqAutoSort}
                      disabled={isAiSorting}
                      className="w-full sm:w-auto px-6 py-3 rounded-2xl border-2 border-brand-dark bg-gradient-to-r from-[#A855F7] to-[#EC4899] hover:from-purple-600 hover:to-pink-600 text-white font-display font-extrabold text-sm shadow-neo flex items-center justify-center gap-2.5 transition-all"
                    >
                      <Sparkles className={`w-4 h-4 ${isAiSorting ? 'animate-spin' : ''}`} />
                      <span>
                        {isAiSorting
                          ? 'Groq AI is Sorting & Labeling Batch...'
                          : `⚡ Auto-Sort & Label (${uploadedFiles.length}) Stickers with Groq AI`}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Sorted Batch Review Board */}
              {sortedBatch.length > 0 && (
                <div className="space-y-4 pt-2 border-t border-[#2B2E42]">
                  {aiSummary && (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/80 to-[#181A26] border border-purple-500/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#FF6EB4]" />
                        <span className="font-mono text-xs text-purple-200 font-bold">
                          {aiSummary}
                        </span>
                      </div>
                      <span className="badge-neo bg-[#FF6EB4] text-white text-[10px]">
                        Groq AI Sorted
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-sm text-white">
                      Review &amp; Edit Sorted Batch ({sortedBatch.length})
                    </span>
                    <button
                      onClick={() => setSortedBatch([])}
                      className="text-xs font-mono text-gray-400 hover:text-white"
                    >
                      Re-run AI Sorting
                    </button>
                  </div>

                  {/* Review Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-80 overflow-y-auto pr-1">
                    {sortedBatch.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl border border-[#2B2E42] bg-[#12131A] flex items-start gap-3 relative group"
                      >
                        {/* Live Image Thumbnail */}
                        <div className="w-16 h-16 rounded-xl bg-white/10 p-1 flex-shrink-0 flex items-center justify-center border border-white/20">
                          <img
                            src={item.previewUrl}
                            alt={item.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        {/* Editable Info */}
                        <div className="flex-1 space-y-2 text-xs">
                          <div>
                            <label className="font-mono text-[9px] text-gray-400 block uppercase">
                              Title
                            </label>
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => handleUpdateDraft(idx, 'name', e.target.value)}
                              className="w-full px-2 py-1 rounded-lg bg-[#181A26] border border-[#2B2E42] text-white font-bold text-xs focus:outline-none focus:border-[#FF6EB4]"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="font-mono text-[9px] text-gray-400 block uppercase">
                                Category
                              </label>
                              <select
                                value={item.categorySlug}
                                onChange={(e) =>
                                  handleUpdateDraft(idx, 'categorySlug', e.target.value)
                                }
                                className="w-full px-1.5 py-1 rounded-lg bg-[#181A26] border border-[#2B2E42] text-gray-300 font-mono text-[10px] focus:outline-none focus:border-[#FF6EB4]"
                              >
                                {categories.map((c) => (
                                  <option key={c.id} value={c.slug}>
                                    {c.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="font-mono text-[9px] text-gray-400 block uppercase">
                                Style
                              </label>
                              <select
                                value={item.style}
                                onChange={(e) =>
                                  handleUpdateDraft(idx, 'style', e.target.value as StickerStyle)
                                }
                                className="w-full px-1.5 py-1 rounded-lg bg-[#181A26] border border-[#2B2E42] text-gray-300 font-mono text-[10px] focus:outline-none focus:border-[#FF6EB4]"
                              >
                                <option value="Kawaii">Kawaii</option>
                                <option value="Neo-Brutal">Neo-Brutal</option>
                                <option value="Pixel Art">Pixel Art</option>
                                <option value="Holographic">Holographic</option>
                                <option value="Retro">Retro</option>
                              </select>
                            </div>
                          </div>

                          <p className="font-body text-[11px] text-gray-400 line-clamp-1">
                            {item.description}
                          </p>
                        </div>

                        {/* Remove item button */}
                        <button
                          onClick={() => handleRemoveDraftItem(idx)}
                          className="text-gray-500 hover:text-red-400 p-1"
                          title="Remove from batch"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Publish All CTA */}
                  <div className="pt-3 flex items-center justify-between border-t border-[#2B2E42]">
                    <span className="font-mono text-xs text-gray-400">
                      All {sortedBatch.length} stickers configured &amp; ready to sell
                    </span>

                    <button
                      onClick={handleCommitBatchToCatalogue}
                      disabled={isCommittingBatch}
                      className="px-6 py-3 rounded-2xl border-2 border-brand-dark bg-[#FACC15] hover:bg-yellow-400 text-brand-dark font-display font-extrabold text-sm shadow-neo flex items-center gap-2 transition-all active:translate-y-0.5"
                    >
                      {isCommittingBatch ? (
                        <span>Publishing to Store...</span>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 text-brand-dark" />
                          <span>Publish All ({sortedBatch.length}) to Store</span>
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

      {/* Single Sticker Edit/Add Modal */}
      {editingSticker && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setEditingSticker(null)}
        >
          <div
            className="w-full max-w-lg bg-[#181A26] rounded-3xl border-2 border-[#2B2E42] overflow-hidden relative shadow-2xl max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-[#2B2E42] bg-[#12131A]">
              <h2 className="font-display font-black text-lg text-white">
                {editingSticker.id ? 'Edit Sticker Design' : 'Create New Sticker'}
              </h2>
              <button
                onClick={() => setEditingSticker(null)}
                className="p-1.5 rounded-xl border border-[#2B2E42] text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs font-body">
              <div>
                <label className="block font-display font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Sticker Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingSticker.name || ''}
                  onChange={(e) => setEditingSticker({ ...editingSticker, name: e.target.value })}
                  placeholder="e.g. Lavender Matcha Bear"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#12131A] border border-[#2B2E42] text-white focus:outline-none focus:border-[#FF6EB4]"
                />
              </div>

              <div>
                <label className="block font-display font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingSticker.description || ''}
                  onChange={(e) => setEditingSticker({ ...editingSticker, description: e.target.value })}
                  placeholder="Playful backstory or art description..."
                  className="w-full px-4 py-2 rounded-xl bg-[#12131A] border border-[#2B2E42] text-white focus:outline-none focus:border-[#FF6EB4] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-display font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Image Path or URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSticker.image_path || ''}
                    onChange={(e) => setEditingSticker({ ...editingSticker, image_path: e.target.value })}
                    placeholder="/stickers/cat-programmer.jpg"
                    className="w-full px-4 py-2 rounded-xl bg-[#12131A] border border-[#2B2E42] text-white focus:outline-none focus:border-[#FF6EB4]"
                  />
                </div>

                <div>
                  <label className="block font-display font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Style
                  </label>
                  <select
                    value={editingSticker.style || 'Kawaii'}
                    onChange={(e) => setEditingSticker({ ...editingSticker, style: e.target.value as StickerStyle })}
                    className="w-full px-4 py-2 rounded-xl bg-[#12131A] border border-[#2B2E42] text-white focus:outline-none focus:border-[#FF6EB4]"
                  >
                    <option value="Kawaii">Kawaii</option>
                    <option value="Neo-Brutal">Neo-Brutal</option>
                    <option value="Pixel Art">Pixel Art</option>
                    <option value="Holographic">Holographic</option>
                    <option value="Retro">Retro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-display font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                  Assign Categories
                </label>
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl border border-[#2B2E42] bg-[#12131A]">
                  {categories.map((c) => (
                    <label key={c.id} className="flex items-center gap-2 cursor-pointer font-bold text-gray-300">
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
                        className="w-4 h-4 rounded border-[#2B2E42] text-[#FF6EB4]"
                      />
                      <span>{c.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-display font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Stock on Hand
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingSticker.stock_on_hand ?? 50}
                    onChange={(e) =>
                      setEditingSticker({ ...editingSticker, stock_on_hand: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-[#12131A] border border-[#2B2E42] text-white focus:outline-none focus:border-[#FF6EB4]"
                  />
                </div>
                <div>
                  <label className="block font-display font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={editingSticker.status || 'active'}
                    onChange={(e: any) => setEditingSticker({ ...editingSticker, status: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#12131A] border border-[#2B2E42] text-white focus:outline-none focus:border-[#FF6EB4]"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#2B2E42]">
                <button
                  type="button"
                  onClick={() => setEditingSticker(null)}
                  className="px-4 py-2 rounded-xl border border-[#2B2E42] text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-[#FACC15] hover:bg-yellow-400 text-brand-dark font-display font-bold shadow-neo flex items-center gap-1.5"
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
