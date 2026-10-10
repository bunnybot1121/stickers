import React from 'react';
import { Sparkles, Heart, Shield, CheckCircle2, ShieldCheck, Layers, Sun } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onNavigateHome: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onNavigateHome }) => {
  return (
    <footer className="mt-20 border-t border-black/[0.06] bg-white/80 backdrop-blur-md py-14 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Brand column */}
        <div className="md:col-span-2 space-y-4">
          <div
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-900 via-purple-950 to-[#FF6EB4] text-white flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </div>
            <span className="font-display font-black text-2xl tracking-tight text-slate-900">
              STICKER<span className="text-[#FF6EB4]">VERSE</span>
            </span>
          </div>

          <p className="font-body text-sm text-slate-600 max-w-sm font-normal leading-relaxed">
            The creative studio for curated vinyl sticker packs. Select 10 collectible designs and unlock 2 free bonus rewards on us, crafted with premium weatherproof matte lamination.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400 mb-3.5">
            Storefront
          </h4>
          <ul className="space-y-2.5 text-sm font-medium text-slate-600 font-body">
            <li>
              <a href="#catalogue-section" className="hover:text-[#FF6EB4] transition-colors">
                Browse Collection
              </a>
            </li>
            <li>
              <a href="#offer-explainer-section" className="hover:text-[#FF6EB4] transition-colors">
                10 + 2 Pack Bundle
              </a>
            </li>
            <li>
              <button onClick={onOpenAdmin} className="hover:text-slate-900 text-xs text-slate-400 transition-colors flex items-center gap-1.5 pt-1">
                <Shield className="w-3 h-3" />
                <span>Staff Portal</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Quality Guarantee (No raw emojis or repetitive technical claims) */}
        <div>
          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400 mb-3.5">
            Material &amp; Finish
          </h4>
          <ul className="space-y-2 text-xs font-normal text-slate-500 font-body leading-relaxed">
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>Weather-Resistant Matte Vinyl</span>
            </li>
            <li className="flex items-center gap-2">
              <Sun className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              <span>Sun &amp; Light Fade Protection</span>
            </li>
            <li className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
              <span>Smooth Die-Cut Contour Edge</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
              <span>Clean-Peel Residue-Free Adhesive</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
        <div>
          © 2026 STICKERVERSE Studio. Curated Vinyl Collectibles.
        </div>
        <div className="flex items-center gap-1">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-[#FF6EB4] fill-[#FF6EB4] inline" />
          <span>for sticker lovers everywhere</span>
        </div>
      </div>
    </footer>
  );
};
