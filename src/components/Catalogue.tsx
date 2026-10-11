import React, { useState, useMemo } from 'react';
import { Search, X, Sparkles, AlertCircle, Heart, Flame, Code, Coffee, Gamepad2, Cat, Gift, Star, Zap, SlidersHorizontal, Info } from 'lucide-react';
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

export type SortOption = 'featured' | 'popular' | 'newest' | 'price-asc' | 'price-desc';

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
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [inspectingSticker, setInspectingSticker] = useState<Sticker | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const handleToggleFavorite = (id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Reconciled active sticker count
  const totalActiveStickers = useMemo(
    () => stickers.filter((s) => s.status === 'active').length,
    [stickers]
  );

  // Reconciled dynamic category counts
  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const cat of categories) {
      const count = stickers.filter(
        (s) => s.status === 'active' && s.categories?.some((c) => c.slug === cat.slug)
      ).length;
      counts.set(cat.slug, count);
    }
    return counts;
  }, [categories, stickers]);

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
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        if (sortBy === 'popular') {
          // Sort by stock scarcity / popularity
          return (a.stock_on_hand ?? 50) - (b.stock_on_hand ?? 50);
        }
        // Default: 'featured'
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
      case 'motorsport-speed':
        return Zap;
      case 'retro-gaming':
        return Gamepad2;
      case 'pop-culture':
        return Flame;
      case 'aesthetic-chill':
      case 'memes-chaos':
        return Coffee;
      case 'cute-animals':
        return Cat;
      default:
        return Sparkles;
    }
  };

  return (
    <section id="catalogue-section" className="py-10 pb-36 sm:pb-44 px-4 sm:px-8 max-w-7xl mx-auto relative">
      {/* Compact Header & Toolbar */}
      <div className="space-y-4 mb-6">
        {/* Title & Subtitle */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-black/[0.06] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-md mb-1.5">
              <Sparkles className="w-3 h-3 text-[#FF6EB4]" />
              <span>COLLECTOR CATALOGUE</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Curated Die-Cut Stickers
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>Showing <strong className="text-slate-900 font-bold">{filteredStickers.length}</strong> of {totalActiveStickers} stickers</span>
            <span className="hidden md:inline text-slate-300">•</span>
            <span className="hidden md:inline text-[11px] text-slate-400">Multi-category themes</span>
          </div>
        </div>

        {/* Compact Search and Sort Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search field */}
          <div className="w-full sm:w-80 md:w-96 relative">
            <input
              id="catalogue-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stickers by title, tag, or theme..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pl-10 text-xs sm:text-sm font-body font-medium shadow-soft-xs focus:outline-none focus:ring-2 focus:ring-[#FF6EB4]/30 focus:border-[#FF6EB4] transition-all placeholder:text-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-900 transition-colors p-0.5"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort control */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <label htmlFor="catalogue-sort-select" className="text-xs font-mono font-medium text-slate-500 whitespace-nowrap flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span>Sort:</span>
            </label>
            <select
              id="catalogue-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-display font-bold text-slate-800 shadow-soft-xs focus:outline-none focus:ring-2 focus:ring-[#FF6EB4]/30 focus:border-[#FF6EB4] cursor-pointer"
            >
              <option value="featured">Featured (Default)</option>
              <option value="popular">Popular</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Single Unified Category Navigation Bar with Working Dynamic Counts */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none pt-1">
          <button
            onClick={() => setSelectedCategorySlug('all')}
            className={`px-3.5 py-2 rounded-xl font-display font-bold text-xs transition-all whitespace-nowrap border flex items-center gap-2 ${
              selectedCategorySlug === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-soft-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>All Stickers</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${selectedCategorySlug === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {totalActiveStickers}
            </span>
          </button>

          {categories.map((cat) => {
            const isActive = selectedCategorySlug === cat.slug;
            const Icon = getCategoryIcon(cat.slug);
            const count = categoryCounts.get(cat.slug) ?? 0;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategorySlug(cat.slug)}
                className={`px-3.5 py-2 rounded-xl font-display font-bold text-xs transition-all whitespace-nowrap border flex items-center gap-2 ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-soft-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Full-Width Product Grid (No duplicate sidebar) */}
      <div>
        {filteredStickers.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4.5">
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
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-soft max-w-md mx-auto my-8">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-display font-bold text-lg text-slate-900 mb-1">
              No stickers found
            </h3>
            <p className="font-body text-xs text-slate-500 mb-4">
              Try adjusting your search terms or choose another category.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategorySlug('all');
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-display font-bold text-xs hover:bg-slate-800 transition-all shadow-soft-xs"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Sticker Detail Modal */}
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
