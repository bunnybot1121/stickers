import React from 'react';
import { ArrowRight, Sparkles, Award, Layers, Gift, Droplets } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onOpenPackBuilder: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onOpenPackBuilder }) => {
  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-12 sm:pb-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Typography & CTAs matching Reference Mockup Screen 01 */}
          <div className="lg:col-span-6 space-y-6">
            {/* Promo Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFE4EF] text-[#D81B60] border-2 border-[#FF6EB4] font-mono text-xs font-black shadow-sm">
              <Sparkles className="w-4 h-4 text-[#FF6EB4] animate-spin" style={{ animationDuration: '6s' }} />
              <span>10 + 2 PACK SPECIAL DEAL IS LIVE!</span>
            </div>

            {/* Main Headline matching reference */}
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl leading-[1.08] tracking-tight text-brand-dark">
              Stickers{' '}
              <span className="inline-block transform -rotate-12 text-2xl sm:text-4xl">👑</span>
              <br />
              For Your <br />
              Everyday <br />
              <span className="text-[#FF6EB4] relative inline-block">
                Vibe.
                {/* Hand-drawn yellow underline curve matching mockup */}
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                  height="10"
                >
                  <path
                    d="M0,7 Q30,14 60,5 T100,7"
                    fill="none"
                    stroke="#FACC15"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="font-body text-base sm:text-lg text-gray-700 max-w-lg font-medium leading-relaxed">
              Explore aesthetic, coding, anime, gaming and more — pick your favorites and get{' '}
              <span className="font-bold text-brand-dark bg-[#FEF9C3] px-2 py-0.5 rounded-lg border border-black/10 inline-block shadow-sm">
                +2 FREE stickers
              </span>{' '}
              on every 10!
            </p>

            {/* Main CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                id="hero-build-pack-btn"
                onClick={onOpenPackBuilder}
                className="btn-neo-yellow text-sm sm:text-base py-3 px-6 flex items-center gap-2 font-black shadow-neo"
              >
                <span>Build Your Pack</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-explore-collection-btn"
                onClick={onExploreClick}
                className="btn-neo-white text-sm sm:text-base py-3 px-6 font-bold shadow-neo-sm"
              >
                <span>Explore Collection</span>
              </button>
            </div>
          </div>

          {/* Right Column: Real Laptop Desk Flatlay Scene matching Reference Screen 01 */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative w-full max-w-lg aspect-[16/10] rounded-3xl overflow-hidden border-3 border-brand-dark shadow-neo-xl group transition-transform duration-300 hover:rotate-0 transform rotate-1">
              {/* Photorealistic Hero Image */}
              <img
                src="/hero-laptop.jpg"
                alt="Aesthetic laptop covered in vibrant stickers"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Floating Badge 1: "- 10 + 2 Free Stickers! -" */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm border-2 border-brand-dark rounded-full px-3.5 py-1 text-xs font-mono font-black text-brand-dark shadow-neo-sm transform rotate-2">
                ✨ 10 + 2 Free Stickers!
              </div>

              {/* Floating Badge 2: "Waterproof Vinyl" */}
              <div className="absolute bottom-4 left-4 bg-[#FACC15] border-2 border-brand-dark rounded-xl px-3 py-1 text-[11px] font-display font-black text-brand-dark shadow-neo-sm transform -rotate-2">
                💧 Waterproof Matte Vinyl
              </div>
            </div>
          </div>
        </div>

        {/* 4 Trust Badges Strip matching Reference Mockup Screen 01 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-12 pt-6 border-t-2 border-black/10">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border-2 border-brand-dark shadow-neo-sm">
            <div className="w-10 h-10 rounded-xl bg-pink-100 border border-brand-dark flex items-center justify-center text-xl flex-shrink-0">
              ⭐
            </div>
            <div>
              <div className="font-display font-black text-xs sm:text-sm text-brand-dark">Original Designs</div>
              <div className="text-[10px] font-mono text-gray-500 font-bold">100% Unique Artwork</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border-2 border-brand-dark shadow-neo-sm">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 border border-brand-dark flex items-center justify-center text-xl flex-shrink-0">
              🎁
            </div>
            <div>
              <div className="font-display font-black text-xs sm:text-sm text-brand-dark">10 + 2 Packs</div>
              <div className="text-[10px] font-mono text-gray-500 font-bold">+2 Free With Every 10</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border-2 border-brand-dark shadow-neo-sm">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 border border-brand-dark flex items-center justify-center text-xl flex-shrink-0">
              🏷️
            </div>
            <div>
              <div className="font-display font-black text-xs sm:text-sm text-brand-dark">Multiple Categories</div>
              <div className="text-[10px] font-mono text-gray-500 font-bold">Coding, Anime, Memes</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border-2 border-brand-dark shadow-neo-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-brand-dark flex items-center justify-center text-xl flex-shrink-0">
              ✨
            </div>
            <div>
              <div className="font-display font-black text-xs sm:text-sm text-brand-dark">High Quality Print</div>
              <div className="text-[10px] font-mono text-gray-500 font-bold">UV &amp; Water Resistant</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

