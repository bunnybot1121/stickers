import React from 'react';
import { Sparkles, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onOpenPackBuilder: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onOpenPackBuilder }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Banner Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-yellow border-3 border-brand-dark shadow-neo-sm font-mono text-xs sm:text-sm font-bold mb-6 animate-bounce">
          <Zap className="w-4 h-4 text-brand-dark" />
          <span>FLAGSHIP OFFER: 10 + 2 PACK DEAL ACTIVE NOW</span>
        </div>

        {/* Main Grid: Hero Text & Interactive Floating Sticker Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-brand-dark">
              CURATE YOUR <br className="hidden sm:inline" />
              <span className="inline-block px-3 py-1 bg-brand-cyan border-3 border-brand-dark shadow-neo-md rounded-2xl transform -rotate-1">
                STICKER
              </span>{' '}
              <span className="inline-block px-3 py-1 bg-brand-pink text-white border-3 border-brand-dark shadow-neo-md rounded-2xl transform rotate-2">
                UNIVERSE
              </span>
            </h1>

            <p className="font-body text-base sm:text-xl text-gray-800 max-w-xl font-medium leading-relaxed">
              Express yourself with handmade, die-cut collectible stickers. Pick <strong>10 eligible designs</strong>, unlock <strong>2 bonus stickers free</strong>, and get a production-ready custom pack!
            </p>

            {/* Value checklist */}
            <div className="flex flex-wrap gap-3 sm:gap-4 font-mono text-xs sm:text-sm font-bold text-gray-800">
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border-2 border-brand-dark shadow-neo-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Durable UV Vinyl
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border-2 border-brand-dark shadow-neo-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Waterproof & Dishwasher Safe
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border-2 border-brand-dark shadow-neo-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Precision Laser Die-Cut
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                id="hero-explore-catalogue-btn"
                onClick={onExploreClick}
                className="btn-neo-yellow text-base sm:text-lg px-6 py-3.5 flex items-center gap-2 group"
              >
                <span>Explore Catalogue</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-open-pack-btn"
                onClick={onOpenPackBuilder}
                className="btn-neo-white text-base sm:text-lg px-6 py-3.5 flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-brand-pink" />
                <span>Open Pack Builder</span>
              </button>
            </div>
          </div>

          {/* Right: Kawaii Sticker Cluster Display */}
          <div className="lg:col-span-5 relative flex items-center justify-center py-6">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96">
              {/* Center Decorative Sticker Mat */}
              <div className="absolute inset-0 bg-brand-cyan/20 rounded-3xl border-3 border-brand-dark border-dashed rotate-3 transform" />

              {/* Floating Sticker 1: Boba Ghost */}
              <div className="absolute -top-3 -left-2 w-32 h-32 sm:w-40 sm:h-40 transform -rotate-12 hover:rotate-0 transition-transform duration-300 cursor-pointer">
                <img
                  src="/stickers/boba-ghost.svg"
                  alt="Boba Ghost Sticker"
                  className="w-full h-full object-contain filter drop-shadow-[4px_6px_0px_#111]"
                />
              </div>

              {/* Floating Sticker 2: Caffeinated Python */}
              <div className="absolute top-0 -right-4 w-32 h-32 sm:w-40 sm:h-40 transform rotate-12 hover:rotate-0 transition-transform duration-300 cursor-pointer">
                <img
                  src="/stickers/caffeinated-python.svg"
                  alt="Caffeinated Python Sticker"
                  className="w-full h-full object-contain filter drop-shadow-[4px_6px_0px_#111]"
                />
              </div>

              {/* Floating Sticker 3: Ramen Cat */}
              <div className="absolute -bottom-4 -left-2 w-32 h-32 sm:w-40 sm:h-40 transform rotate-6 hover:rotate-0 transition-transform duration-300 cursor-pointer">
                <img
                  src="/stickers/sleepy-ramen-neko.svg"
                  alt="Sleepy Ramen Neko Sticker"
                  className="w-full h-full object-contain filter drop-shadow-[4px_6px_0px_#111]"
                />
              </div>

              {/* Floating Sticker 4: Pixel Game Cart */}
              <div className="absolute -bottom-3 -right-3 w-32 h-32 sm:w-40 sm:h-40 transform -rotate-6 hover:rotate-0 transition-transform duration-300 cursor-pointer">
                <img
                  src="/stickers/pixel-game-cart.svg"
                  alt="Pixel Game Cart Sticker"
                  className="w-full h-full object-contain filter drop-shadow-[4px_6px_0px_#111]"
                />
              </div>

              {/* Center 10+2 Badge */}
              <div className="absolute inset-0 m-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-brand-pink text-white border-3 border-brand-dark shadow-neo-lg flex flex-col items-center justify-center font-display font-black leading-tight text-center z-10 animate-pulse">
                <span className="text-xl sm:text-2xl">10+2</span>
                <span className="text-[10px] font-mono tracking-widest uppercase">FREE BONUS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
