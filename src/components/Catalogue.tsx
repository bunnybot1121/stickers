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
    <section id="catalogue-section" className="py-12 pb-28 sm:pb-32 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        {/* Search input with sleek rounded pill style */}
        <div className="w-full md:w-96 relative">
          <input
            id="catalogue-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stickers (e.g. cat, dev, anime, synth)..."
            className="w-full rounded-full border border-black/10 bg-white/90 backdrop-blur-sm px-4 py-3 pl-11 text-xs sm:text-sm font-medium shadow-soft-xs focus:outline-none focus:ring-2 focus:ring-[#FF6EB4]/40 focus:border-[#FF6EB4] transition-all placeholder:text-slate-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort by dropdown & result counter */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <span className="text-xs font-mono font-medium text-slate-500">
            Showing <strong className="text-slate-900 font-bold">{filteredStickers.length}</strong> collectible stickers
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-slate-400 hidden sm:inline">
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3.5 py-2 rounded-full border border-black/10 bg-white text-xs font-bold text-slate-800 shadow-soft-xs focus:outline-none focus:border-black/30 cursor-pointer"
            >
              <option value="featured">Popular / Featured</option>
              <option value="newest">Newest Arrivals</option>
              <option value="name-asc">Name (A–Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Horizontal Category Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
        <button
          onClick={() => setSelectedCategorySlug('all')}
          className={`px-4 py-2 rounded-full font-display font-bold text-xs transition-all whitespace-nowrap border ${
            selectedCategorySlug === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-soft-sm'
              : 'bg-white text-slate-700 border-black/[0.08] hover:bg-slate-50 hover:border-black/20'
          }`}
        >
          ✨ All Stickers
        </button>

        {categories.map((cat) => {
          const isActive = selectedCategorySlug === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategorySlug(cat.slug)}
              className={`px-4 py-2 rounded-full font-display font-bold text-xs transition-all whitespace-nowrap border ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-soft-sm'
                  : 'bg-white text-slate-700 border-black/[0.08] hover:bg-slate-50 hover:border-black/20'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Desktop Category Sidebar (Left) + Stickers Grid (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Desktop Category Sidebar */}
        <div className="hidden lg:block lg:col-span-3 space-y-4 sticky top-24">
          <div className="p-4 rounded-3xl bg-white border border-black/[0.07] shadow-soft">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400 mb-3 px-2">
              Categories
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategorySlug('all')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-display font-bold transition-all ${
                  selectedCategorySlug === 'all'
                    ? 'bg-slate-900 text-white shadow-soft-xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>★</span>
                  <span>All Stickers</span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${selectedCategorySlug === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
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
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-display font-bold transition-all ${
                      isActive
                        ? 'bg-pink-50 text-pink-700 border border-pink-200 shadow-soft-xs'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cat.name}</span>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${isActive ? 'bg-pink-200/60 text-pink-800' : 'bg-slate-100 text-slate-600'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sticky 10+2 Promotional Promo Box */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-50 via-pink-50 to-purple-50 border border-pink-200/60 text-center shadow-soft">
            <span className="text-3xl block mb-1.5 animate-subtle-float">🎁</span>
            <span className="font-display font-black text-sm text-slate-900 block">
              10 + 2 On Every Pack!
            </span>
            <p className="text-[11px] font-medium text-slate-600 mt-1.5 leading-relaxed">
              Add any 10 base stickers and unlock 2 bonus designs for free at checkout.
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
            <div className="p-12 text-center bg-white rounded-3xl border border-black/[0.08] shadow-soft max-w-md mx-auto">
              <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="font-display font-bold text-lg text-slate-900 mb-1">
                No stickers found
              </h3>
              <p className="font-body text-xs text-slate-500 mb-4">
                Try searching for another keyword or select All Stickers.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategorySlug('all');
                }}
                className="btn-neo-dark text-xs py-2 px-5 rounded-full"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
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
