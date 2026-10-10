import React, { useState, useMemo } from 'react';
import { Search, X, SlidersHorizontal, Sparkles, AlertCircle } from 'lucide-react';
import { Category, Sticker, StickerStyle, PackSelectionState } from '../types';
import { StickerCard } from './StickerCard';
import { StickerModal } from './StickerModal';

interface CatalogueProps {
  stickers: Sticker[];
  categories: Category[];
  selection: PackSelectionState;
  isBaseFull: boolean;
  isBonusFull: boolean;
  bonusUnlocked: boolean;
  onSelectBase: (sticker: Sticker) => void;
  onSelectBonus: (sticker: Sticker) => void;
  onRemove: (stickerId: string) => void;
}

export const Catalogue: React.FC<CatalogueProps> = ({
  stickers,
  categories,
  selection,
  isBaseFull,
  isBonusFull,
  bonusUnlocked,
  onSelectBase,
  onSelectBonus,
  onRemove,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'name-asc'>('featured');
  const [inspectingSticker, setInspectingSticker] = useState<Sticker | null>(null);

  // Filter & Sort logic
  const filteredStickers = useMemo(() => {
    return stickers
      .filter((sticker) => {
        // Only active stickers in storefront
        if (sticker.status !== 'active') return false;

        // Category filter
        if (selectedCategorySlug !== 'all') {
          const inCat = sticker.categories?.some((c) => c.slug === selectedCategorySlug);
          if (!inCat) return false;
        }

        // Style filter
        if (selectedStyle !== 'all') {
          if (sticker.style !== selectedStyle) return false;
        }

        // In-stock only
        if (inStockOnly) {
          if (sticker.track_inventory && (sticker.stock_on_hand ?? 0) < 1) {
            return false;
          }
        }

        // Search query
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase().trim();
          const matchName = sticker.name.toLowerCase().includes(q);
          const matchDesc = sticker.description.toLowerCase().includes(q);
          const matchStyle = sticker.style.toLowerCase().includes(q);
          const matchCat = sticker.categories?.some((c) => c.name.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchStyle && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        // default featured first
        return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
      });
  }, [stickers, searchQuery, selectedCategorySlug, selectedStyle, inStockOnly, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategorySlug('all');
    setSelectedStyle('all');
    setInStockOnly(false);
    setSortBy('featured');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategorySlug !== 'all' ||
    selectedStyle !== 'all' ||
    inStockOnly;

  return (
    <section id="catalogue-section" className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Title & Subheading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 badge-neo bg-brand-pink text-white mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DISCOVERY ARENA</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-brand-dark tracking-tight">
            Explore All Stickers
          </h2>
          <p className="font-body text-gray-700 font-medium text-sm sm:text-base mt-1">
            Tap designs to inspect or quickly add them to your 10 + 2 pack builder.
          </p>
        </div>

        {/* Search bar */}
        <div className="w-full md:w-80 relative">
          <input
            id="catalogue-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, category, style..."
            className="input-neo pl-10 pr-9 text-sm"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-gray-400 hover:text-brand-dark"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Slider / Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        <button
          onClick={() => setSelectedCategorySlug('all')}
          className={`px-4 py-2 rounded-xl font-display font-bold text-xs sm:text-sm border-2 border-brand-dark transition-all whitespace-nowrap ${
            selectedCategorySlug === 'all'
              ? 'bg-brand-dark text-white shadow-neo-sm translate-y-[-1px]'
              : 'bg-white text-brand-dark hover:bg-gray-100'
          }`}
        >
          All Designs ({stickers.filter((s) => s.status === 'active').length})
        </button>

        {categories.map((cat) => {
          const count = stickers.filter(
            (s) => s.status === 'active' && s.categories?.some((c) => c.slug === cat.slug)
          ).length;
          const isActive = selectedCategorySlug === cat.slug;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategorySlug(cat.slug)}
              className={`px-4 py-2 rounded-xl font-display font-bold text-xs sm:text-sm border-2 border-brand-dark transition-all whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'bg-brand-yellow text-brand-dark shadow-neo-sm translate-y-[-1px]'
                  : 'bg-white text-brand-dark hover:bg-gray-100'
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-brand-dark/10">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Secondary Controls Bar: Style, In Stock, Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border-3 border-brand-dark shadow-neo-sm mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-gray-500">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Style Selector */}
          <select
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
            className="px-3 py-1.5 rounded-xl border-2 border-brand-dark bg-gray-50 text-xs font-bold text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-cyan"
          >
            <option value="all">All Styles</option>
            <option value="Kawaii">Kawaii</option>
            <option value="Neo-Brutal">Neo-Brutal</option>
            <option value="Pixel Art">Pixel Art</option>
            <option value="Holographic">Holographic</option>
            <option value="Retro">Retro</option>
          </select>

          {/* In-stock Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-brand-dark">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4 rounded border-2 border-brand-dark text-brand-pink focus:ring-0"
            />
            <span>In-Stock Only</span>
          </label>
        </div>

        {/* Sort & Count */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-gray-500 hidden sm:inline">
            Showing <strong>{filteredStickers.length}</strong> items
          </span>

          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-xl border-2 border-brand-dark bg-gray-50 text-xs font-bold text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-cyan"
          >
            <option value="featured">Featured First</option>
            <option value="newest">Newest First</option>
            <option value="name-asc">Name (A–Z)</option>
          </select>
        </div>
      </div>

      {/* Grid of Sticker Cards */}
      {filteredStickers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredStickers.map((sticker) => {
            const isSelectedBase = selection.baseStickerIds.includes(sticker.id);
            const isSelectedBonus = selection.bonusStickerIds.includes(sticker.id);

            return (
              <StickerCard
                key={sticker.id}
                sticker={sticker}
                isSelectedBase={isSelectedBase}
                isSelectedBonus={isSelectedBonus}
                isBaseFull={isBaseFull}
                isBonusFull={isBonusFull}
                bonusUnlocked={bonusUnlocked}
                onSelectBase={onSelectBase}
                onSelectBonus={onSelectBonus}
                onRemove={onRemove}
                onInspect={setInspectingSticker}
              />
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="card-neo p-12 text-center bg-white my-8 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 border-3 border-brand-dark shadow-neo-sm flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="font-display font-black text-2xl text-brand-dark mb-2">
            No Stickers Found
          </h3>
          <p className="font-body text-sm text-gray-600 mb-6 font-medium">
            We couldn't find any stickers matching your current search and filter criteria.
          </p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="btn-neo-yellow text-sm">
              Clear All Filters
            </button>
          )}
        </div>
      )}

      {/* Detail Modal */}
      <StickerModal
        sticker={inspectingSticker}
        onClose={() => setInspectingSticker(null)}
        isSelectedBase={inspectingSticker ? selection.baseStickerIds.includes(inspectingSticker.id) : false}
        isSelectedBonus={inspectingSticker ? selection.bonusStickerIds.includes(inspectingSticker.id) : false}
        isBaseFull={isBaseFull}
        isBonusFull={isBonusFull}
        bonusUnlocked={bonusUnlocked}
        onSelectBase={onSelectBase}
        onSelectBonus={onSelectBonus}
        onRemove={onRemove}
      />
    </section>
  );
};
