import React from 'react';
import { ArrowRight, Sparkles, Award, Layers, Gift, Droplets } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onOpenPackBuilder: () => void;
  onOpenAiVibe: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onOpenPackBuilder, onOpenAiVibe }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-10 sm:pt-16 sm:pb-14 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Promo Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE4EF] text-[#D81B60] border border-[#FF6EB4] font-mono text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6EB4]" />
              <span>10 + 2 SPECIAL OFFER IS LIVE!</span>
            </div>

            {/* Main Headline matching reference */}
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-brand-dark">
              Stickers <br />
              For Your <br />
              Everyday <br />
              <span className="text-[#FF6EB4] relative inline-block">
                Vibe.
                {/* Hand-drawn underline accent */}
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                  height="8"
                >
                  <path
                    d="M0,6 Q30,12 60,4 T100,6"
                    fill="none"
                    stroke="#FACC15"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="font-body text-base sm:text-lg text-gray-700 max-w-lg font-medium leading-relaxed">
              Explore aesthetic, coding, anime, gaming and more — pick your favorites and get{' '}
              <strong className="text-black bg-[#FEF9C3] px-1.5 py-0.5 rounded border border-black/10">
                +2 FREE stickers
              </strong>{' '}
              on every 10!
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                id="hero-build-pack-btn"
                onClick={onOpenPackBuilder}
                className="btn-neo-yellow text-sm sm:text-base py-3 px-6 flex items-center gap-2"
              >
                <span>Build Your Pack</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-explore-collection-btn"
                onClick={onExploreClick}
                className="btn-neo-white text-sm sm:text-base py-3 px-6"
              >
                <span>Explore Collection</span>
              </button>

              <button
                onClick={onOpenAiVibe}
                className="btn-neo bg-[#EBD4FF] text-purple-900 border-2 border-purple-500 hover:bg-purple-200 text-xs sm:text-sm py-2.5 px-4 flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>AI Vibe Stylist</span>
              </button>
            </div>
          </div>

          {/* Right Column: Realistic Laptop Desk Sticker Scene matching reference */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl bg-white border-2 border-black/80 shadow-neo-lg p-4 overflow-hidden">
              {/* Background laptop surface simulation */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#F5F2EB] to-[#ECE7DD] flex flex-col justify-end p-6">
                <div className="w-full h-3/4 rounded-2xl bg-[#2D3142] border-2 border-black relative overflow-hidden shadow-md flex items-center justify-center p-3">
                  {/* Laptop lid branding */}
                  <div className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest absolute top-2 text-center w-full">
                    STICKERZ LAPTOP
                  </div>

                  {/* Collage of Stickers on Laptop Lid */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src="/stickers/sleepy-ramen-neko.svg"
                      alt="Neko"
                      className="w-20 h-20 absolute -top-1 -left-2 transform -rotate-12 filter drop-shadow-[2px_3px_0px_#111] hover:scale-110 transition-transform"
                    />
                    <img
                      src="/stickers/terminal-wizard.svg"
                      alt="Terminal Wizard"
                      className="w-20 h-20 absolute -top-1 -right-2 transform rotate-12 filter drop-shadow-[2px_3px_0px_#111] hover:scale-110 transition-transform"
                    />
                    <img
                      src="/stickers/caffeinated-python.svg"
                      alt="Python"
                      className="w-20 h-20 absolute -bottom-1 -left-1 transform rotate-6 filter drop-shadow-[2px_3px_0px_#111] hover:scale-110 transition-transform"
                    />
                    <img
                      src="/stickers/pixel-game-cart.svg"
                      alt="Game Cart"
                      className="w-20 h-20 absolute -bottom-1 -right-1 transform -rotate-6 filter drop-shadow-[2px_3px_0px_#111] hover:scale-110 transition-transform"
                    />
                    <img
                      src="/stickers/boba-ghost.svg"
                      alt="Ghost"
                      className="w-24 h-24 absolute m-auto filter drop-shadow-[3px_4px_0px_#111] hover:scale-110 transition-transform"
                    />
                  </div>
                </div>
              </div>

              {/* Floating Highlight Banner Badge matching reference */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm border-2 border-black px-3 py-1.5 rounded-full shadow-neo-sm transform rotate-3 flex items-center gap-1.5 text-xs font-mono font-bold text-black select-none">
                <span className="text-[#FF6EB4]">✦</span>
                <span>— 10 + 2 Free Stickers! —</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Trust Badges matching reference */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-12 pt-8 border-t-2 border-black/10">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border-2 border-black/80 shadow-neo-sm">
            <div className="w-10 h-10 rounded-xl bg-[#FFE4EF] text-[#FF6EB4] border border-black/20 flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-black text-xs sm:text-sm text-brand-dark block">
                500+ Original
              </span>
              <span className="text-[10px] font-mono text-gray-500 block">
                Original Designs
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border-2 border-black/80 shadow-neo-sm">
            <div className="w-10 h-10 rounded-xl bg-[#FEF9C3] text-amber-700 border border-black/20 flex items-center justify-center flex-shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-black text-xs sm:text-sm text-brand-dark block">
                10 + 2 Packs
              </span>
              <span className="text-[10px] font-mono text-gray-500 block">
                2 Free Bonus Stickers
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border-2 border-black/80 shadow-neo-sm">
            <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] text-sky-700 border border-black/20 flex items-center justify-center flex-shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-black text-xs sm:text-sm text-brand-dark block">
                Multiple Categories
              </span>
              <span className="text-[10px] font-mono text-gray-500 block">
                Anime, Tech, Gaming
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border-2 border-black/80 shadow-neo-sm">
            <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-emerald-700 border border-black/20 flex items-center justify-center flex-shrink-0">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-black text-xs sm:text-sm text-brand-dark block">
                High Quality Print
              </span>
              <span className="text-[10px] font-mono text-gray-500 block">
                Waterproof Matte Vinyl
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
