import React, { useState, useMemo } from 'react';
import { Search, X, Sparkles, AlertCircle, Heart, Flame, Code, Coffee, Gamepad2, Cat } from 'lucide-react';
import { Category, Sticker, PackSelectionState } from '../types';
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
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'name-asc'>('featured');
  const [inspectingSticker, setInspectingSticker] = useState<Sticker | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const handleToggleFavorite = (id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter & Sort logic
  const filteredStickers = useMemo(() => {
    return stickers
      .filter((sticker) => {
        if (sticker.status !== 'active') return false;

        // Category filter
        if (selectedCategorySlug !== 'all') {
          const inCat = sticker.categories?.some((c) => c.slug === selectedCategorySlug);
          if (!inCat) return false;
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
        return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
      });
  }, [stickers, searchQuery, selectedCategorySlug, sortBy]);

  // Category Icon helper
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'coding-tech':
        return Code;
      case 'anime-chibi':
        return Sparkles;
      case 'aesthetic-chill':
        return Coffee;
      case 'retro-gaming':
        return Gamepad2;
      case 'cute-animals':
        return Cat;
      default:
        return Flame;
    }
  };

  return (
    <section id="catalogue-section" className="py-10 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Top Search & Filter Bar matching reference */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        {/* Search input with rounded pill style */}
        <div className="w-full md:w-96 relative">
          <input
            id="catalogue-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stickers (e.g. python, cat, anime...)"
            className="w-full rounded-2xl border-2 border-black/80 bg-white px-4 py-2.5 pl-10 text-xs sm:text-sm font-medium shadow-neo-sm focus:outline-none focus:ring-2 focus:ring-[#FF6EB4]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-gray-400 hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort by dropdown */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <span className="text-xs font-mono font-bold text-gray-500 hidden sm:inline">
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl border-2 border-black/80 bg-white text-xs font-bold text-brand-dark shadow-neo-sm focus:outline-none"
          >
            <option value="featured">Popular / Featured</option>
            <option value="newest">Newest Arrivals</option>
            <option value="name-asc">Name (A–Z)</option>
          </select>
        </div>
      </div>

      {/* Horizontal Category Chips Bar matching reference */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
        <button
          onClick={() => setSelectedCategorySlug('all')}
          className={`px-4 py-2 rounded-xl font-display font-bold text-xs transition-all whitespace-nowrap border-2 border-black/80 ${
            selectedCategorySlug === 'all'
              ? 'bg-black text-white shadow-neo-sm'
              : 'bg-white text-black hover:bg-gray-100'
          }`}
        >
          All
        </button>

        {categories.map((cat) => {
          const isActive = selectedCategorySlug === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategorySlug(cat.slug)}
              className={`px-4 py-2 rounded-xl font-display font-bold text-xs transition-all whitespace-nowrap border-2 border-black/80 ${
                isActive
                  ? 'bg-[#FACC15] text-black shadow-neo-sm'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Desktop Category Sidebar (Left) + Stickers Grid (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Desktop Category Sidebar matching reference */}
        <div className="hidden lg:block lg:col-span-3 space-y-4 sticky top-24">
          <div className="card-neo p-4 bg-white border-2 border-black/80">
            <h3 className="font-display font-black text-sm uppercase tracking-wider text-black mb-3 px-2">
              Categories
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategorySlug('all')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-display font-bold transition-all ${
                  selectedCategorySlug === 'all'
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>★</span>
                  <span>All Stickers</span>
                </div>
                <span className="text-[10px] font-mono opacity-60">
                  {stickers.filter((s) => s.status === 'active').length}
                </span>
              </button>

              {categories.map((cat) => {
                const Icon = getCategoryIcon(cat.slug);
                const count = stickers.filter(
                  (s) => s.status === 'active' && s.categories?.some((c) => c.slug === cat.slug)
                ).length;
                const isActive = selectedCategorySlug === cat.slug;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategorySlug(cat.slug)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-display font-bold transition-all ${
                      isActive
                        ? 'bg-[#FFE4EF] text-[#D81B60] border border-[#FF6EB4]'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cat.name}</span>
                    </div>
                    <span className="text-[10px] font-mono opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sticky 10+2 Promotional Promo Box */}
          <div className="card-neo p-4 bg-gradient-to-br from-[#FEF9C3] to-[#FFE4EF] border-2 border-black/80 text-center">
            <span className="text-2xl block mb-1">🎁</span>
            <span className="font-display font-black text-sm text-black block">
              10 + 2 On Every Pack!
            </span>
            <p className="text-[11px] font-medium text-gray-700 mt-1">
              Select any 10 stickers and get 2 bonus designs automatically unlocked.
            </p>
          </div>
        </div>

        {/* Right Area: Sticker Grid (9 cols) */}
        <div className="lg:col-span-9">
          {filteredStickers.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredStickers.map((sticker) => (
                <StickerCard
                  key={sticker.id}
                  sticker={sticker}
                  isSelectedBase={selection.baseStickerIds.includes(sticker.id)}
                  isSelectedBonus={selection.bonusStickerIds.includes(sticker.id)}
                  isBaseFull={isBaseFull}
                  isBonusFull={isBonusFull}
                  bonusUnlocked={bonusUnlocked}
                  isFavorited={favoriteIds.includes(sticker.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onSelectBase={onSelectBase}
                  onSelectBonus={onSelectBonus}
                  onRemove={onRemove}
                  onInspect={setInspectingSticker}
                />
              ))}
            </div>
          ) : (
            <div className="card-neo p-12 text-center bg-white border-2 border-black/80 max-w-md mx-auto">
              <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <h3 className="font-display font-black text-xl text-brand-dark mb-1">
                No stickers found
              </h3>
              <p className="font-body text-xs text-gray-500 mb-4">
                Try searching for another keyword or clear your category filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategorySlug('all');
                }}
                className="btn-neo-yellow text-xs py-2 px-4"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sticker Detail Modal matching reference */}
      <StickerModal
        sticker={inspectingSticker}
        allStickers={stickers}
        onClose={() => setInspectingSticker(null)}
        isSelectedBase={inspectingSticker ? selection.baseStickerIds.includes(inspectingSticker.id) : false}
        isSelectedBonus={inspectingSticker ? selection.bonusStickerIds.includes(inspectingSticker.id) : false}
        isBaseFull={isBaseFull}
        isBonusFull={isBonusFull}
        bonusUnlocked={bonusUnlocked}
        onSelectBase={onSelectBase}
        onSelectBonus={onSelectBonus}
        onRemove={onRemove}
        onSelectSimilar={(s) => setInspectingSticker(s)}
      />
    </section>
  );
};
