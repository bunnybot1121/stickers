import React, { useState, useMemo } from 'react';
import { Search, X, AlertCircle } from 'lucide-react';
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

export type SortOption = 'popular' | 'featured' | 'newest' | 'price-asc' | 'price-desc';

// Categories matching user's mockup screenshot exactly
const MOCKUP_CATEGORIES = [
  { name: 'All', slug: 'all' },
  { name: 'Anime', slug: 'anime-chibi' },
  { name: 'Coding', slug: 'coding-tech' },
  { name: 'Aesthetic', slug: 'aesthetic-chill' },
  { name: 'Memes', slug: 'memes-chaos' },
  { name: 'Minimal', slug: 'minimal' },
  { name: 'Animals', slug: 'cute-animals' },
  { name: 'Motivational', slug: 'motivational' },
  { name: 'Movies', slug: 'pop-culture' },
  { name: 'Quotes', slug: 'quotes' },
];

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
  const [sortBy, setSortBy] = useState<SortOption>('popular');
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
          const matchCat =
            sticker.categories?.some((c) => c.slug === selectedCategorySlug) ||
            sticker.style?.toLowerCase().includes(selectedCategorySlug) ||
            sticker.description?.toLowerCase().includes(selectedCategorySlug);
          if (!matchCat) return false;
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
        if (sortBy === 'featured') return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
        // Default: 'popular'
        return (a.stock_on_hand ?? 50) - (b.stock_on_hand ?? 50);
      });
  }, [stickers, searchQuery, selectedCategorySlug, sortBy]);

  return (
    <section id="catalogue-section" className="py-10 sm:py-14 px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto relative bg-[#0A0B0E]">
      
      {/* Section Header matching user's screenshot */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
          <div>
            <p className="text-[11px] font-mono font-bold uppercase tracking-[0.22em] text-[#94A3B8] mb-1">
              Explore Collections
            </p>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight uppercase leading-none">
              All Stickers
            </h2>
          </div>

          <div className="flex items-center gap-5 self-start sm:self-end">
            {/* Playful doodle note from screenshot: GOOD STICKERS BETTER DAYS ッ */}
            <div className="hidden md:flex flex-col items-center -rotate-6 text-[#FACC15] select-none leading-tight">
              <span className="font-mono text-[10px] tracking-widest font-black uppercase">
                Good Stickers
              </span>
              <span className="font-mono text-[9px] tracking-wider text-slate-300">
                Better Days ッ
              </span>
            </div>

            {/* Sort Dropdown matching screenshot */}
            <div className="flex items-center gap-2">
              <select
                id="catalogue-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Sort stickers"
                className="px-3.5 py-1.5 rounded-lg bg-[#141721] border border-white/10 text-xs font-display font-bold text-white focus:outline-none focus:border-white/30 cursor-pointer"
              >
                <option value="popular">Sort: Popular</option>
                <option value="featured">Sort: Featured</option>
                <option value="newest">Sort: Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills Row matching screenshot */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {MOCKUP_CATEGORIES.map((cat) => {
            const isActive = selectedCategorySlug === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategorySlug(cat.slug)}
                className={`px-4 py-1.5 rounded-full font-display font-bold text-xs transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-black shadow-sm font-black'
                    : 'bg-[#141721] text-white/70 border border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid: 4 Columns on Desktop matching previous version's larger sticker size */}
      <div>
        {filteredStickers.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
          <div className="p-12 text-center bg-[#111319] rounded-2xl border border-white/10 max-w-md mx-auto my-8">
            <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="font-display font-bold text-lg text-white mb-1">
              No stickers found
            </h3>
            <p className="font-body text-xs text-slate-400 mb-4">
              Try adjusting your search terms or choose another collection.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategorySlug('all');
              }}
              className="px-4 py-2 rounded-xl bg-white text-black font-display font-bold text-xs hover:bg-slate-200 transition-all cursor-pointer"
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
