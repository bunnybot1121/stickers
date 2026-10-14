import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface OfferExplainerProps {
  onOpenPackBuilder?: () => void;
  onExploreClick?: () => void;
}

export const OfferExplainer: React.FC<OfferExplainerProps> = ({
  onOpenPackBuilder,
  onExploreClick,
}) => {
  return (
    <div id="offer-explainer-section" className="bg-[#0A0B0E] text-white">
      {/* 
        ========================================================================
        CYAN / NEON PACK BAND: "THE BEST KIND OF MATHS"
        Matches dark theme with neon cyan & yellow accents, and "10 + 2" watermark
        ========================================================================
      */}
      <section className="mx-4 sm:mx-8 lg:mx-16 my-8 rounded-[24px] bg-gradient-to-r from-[#0F1420] via-[#111624] to-[#151928] border border-[#00F0FF]/25 p-8 sm:p-12 lg:p-16 relative overflow-hidden text-white shadow-2xl">
        {/* Large "10 + 2" Watermark in Background */}
        <div
          className="absolute right-6 sm:right-16 -bottom-10 sm:-bottom-14 font-display font-black text-[120px] sm:text-[180px] lg:text-[230px] text-[#00F0FF]/[0.05] tracking-tighter select-none pointer-events-none leading-none"
          aria-hidden="true"
        >
          10 + 2
        </div>

        <div className="relative z-10 max-w-2xl">
          <p className="text-[11px] sm:text-xs font-mono font-black uppercase tracking-[0.22em] text-[#00F0FF] mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The best kind of maths</span>
          </p>

          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.02] text-white">
            10 stickers you love. <br />
            <span className="text-[#FACC15]">2 bonus ones on us.</span>
          </h2>

          <p className="mt-3.5 text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-lg font-normal">
            Build a bundle that feels like you. Choose your ten favourites, and we’ll throw in two bonus stickers automatically.
          </p>

          <div className="mt-7">
            <button
              onClick={onOpenPackBuilder}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#00F0FF] hover:bg-[#38f3ff] text-black font-display font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-[#00F0FF]/20 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer uppercase"
            >
              <span>Build my pack</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        MARQUEE TICKER TAPE
        Dark background with neon pink stars
        ========================================================================
      */}
      <div className="bg-[#0E1015] border-y border-white/10 py-4 overflow-hidden whitespace-nowrap text-[11px] font-mono font-black uppercase tracking-[0.2em] text-white/90 select-none">
        <div className="flex items-center justify-around gap-10">
          <span>
            GOOD STICKERS, GOOD MOOD <span className="text-[#FF2E93] mx-2 text-base">✦</span>
          </span>
          <span>
            MAKE THE EVERYDAY YOURS <span className="text-[#FF2E93] mx-2 text-base">✦</span>
          </span>
          <span>
            SMALL ART, BIG ENERGY <span className="text-[#00F0FF] mx-2 text-base">✦</span>
          </span>
          <span>
            STICK A LITTLE JOY ON IT <span className="text-[#FACC15] mx-2 text-base">✦</span>
          </span>
        </div>
      </div>

      {/* 
        ========================================================================
        STORY SECTION: "YOUR LAPTOP CALLED. IT WANTS PERSONALITY."
        Matches dark theme with desk photography and hot pink accent
        ========================================================================
      */}
      <section className="px-4 sm:px-8 lg:px-16 py-16 sm:py-20 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 items-center">
        {/* Left: Lifestyle Photo with Pink Sticky Note */}
        <div className="relative rounded-[22px] overflow-hidden min-h-[300px] sm:min-h-[380px] bg-[#141721] border border-white/10 shadow-2xl aspect-[4/3]">
          <img
            src="/hero-stickers.webp"
            alt="Close-up of the Stickerverse sticker collection"
            className="w-full h-full object-cover object-center select-none"
            loading="lazy"
          />
          <div className="absolute left-5 bottom-5 bg-[#FF2E93] text-white font-display font-black text-xs sm:text-sm px-4 py-3 rounded-lg leading-tight -rotate-3 shadow-lg select-none">
            A LITTLE <br />
            MORE YOU.
          </div>
        </div>

        {/* Right: Story Copy */}
        <div className="space-y-4">
          <p className="text-[11px] font-mono font-black uppercase tracking-[0.22em] text-[#94A3B8]">
            Not just stickers
          </p>

          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white leading-[0.96] tracking-tight">
            Your laptop called. <br />
            It wants <span className="text-[#FF2E93]">personality.</span>
          </h2>

          <p className="text-[#94A3B8] text-sm sm:text-base leading-relaxed max-w-lg font-normal pt-2">
            We’re here for the little things that make your stuff feel like yours. The sleepy cat on your laptop. The tiny ghost on your bottle. The inside joke only your friends get.
          </p>

          <p className="text-[#94A3B8] text-sm sm:text-base leading-relaxed max-w-lg font-normal">
            Pick what makes you smile, mix your moods, and stick it wherever life happens.
          </p>

          <div className="pt-2">
            <button
              onClick={onExploreClick}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#111319] hover:bg-[#1a1e29] border border-white/20 text-white font-display font-bold text-xs sm:text-sm hover:-translate-y-0.5 active:translate-y-0 transition-transform shadow-md cursor-pointer"
            >
              <span>Meet your new favourites</span>
              <span className="text-[#00F0FF] text-base font-bold">↗</span>
            </button>
          </div>

          <div className="flex items-center gap-4 pt-5 text-xs font-mono font-bold text-slate-300">
            <span className="pl-2 border-l-2 border-[#00F0FF]">Original designs</span>
            <span className="pl-2 border-l-2 border-[#FF2E93]">Gift-worthy packs</span>
            <span className="pl-2 border-l-2 border-[#FACC15]">Made for everyday</span>
          </div>
        </div>
      </section>
    </div>
  );
};
