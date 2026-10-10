import React from 'react';
import { Sparkles, Heart, Shield, Database } from 'lucide-react';
import { storeService } from '../services/storeService';

interface FooterProps {
  onOpenAdmin: () => void;
  onNavigateHome: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onNavigateHome }) => {
  const isSupabase = storeService.isConnectedToSupabase;

  return (
    <footer className="mt-20 border-t border-black/[0.06] bg-white/80 backdrop-blur-md py-14 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Brand column */}
        <div className="md:col-span-2 space-y-4">
          <div
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-900 via-purple-950 to-[#FF6EB4] text-white flex items-center justify-center font-display font-black text-sm shadow-soft group-hover:scale-105 transition-transform">
              <span className="text-yellow-300">★</span>
            </div>
            <span className="font-display font-black text-2xl tracking-tight text-slate-900">
              STICKER<span className="text-[#FF6EB4]">VERSE</span>
            </span>
          </div>

          <p className="font-body text-sm text-slate-600 max-w-sm font-normal leading-relaxed">
            The studio for curated vinyl sticker packs. Select 10 collectible designs and unlock 2 free bonus rewards on us, laser die-cut with premium waterproof lamination.
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/[0.08] bg-slate-50 text-xs font-mono font-medium text-slate-700 shadow-soft-xs">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Backend: {isSupabase ? 'Supabase Live' : 'Local Resilient Mode'}</span>
          </div>
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
                How 10 + 2 Works
              </a>
            </li>
            <li>
              <button onClick={onOpenAdmin} className="hover:text-[#FF6EB4] transition-colors flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-purple-600" />
                <span>Admin Console</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Policies & Contact */}
        <div>
          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400 mb-3.5">
            Quality Guarantee
          </h4>
          <ul className="space-y-2 text-xs font-normal text-slate-500 font-body leading-relaxed">
            <li>💧 100% Dishwasher Proof Vinyl</li>
            <li>☀️ 5-Year UV Non-Fade Lamination</li>
            <li>✂️ Precision Laser Die-Cut Edge</li>
            <li>✨ Residue-Free Clean Peel Adhesive</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
        <div>
          © 2026 STICKERVERSE. Curated Vinyl Collectibles &amp; Print Studio.
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
