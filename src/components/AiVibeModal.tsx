import React, { useState } from 'react';
import { X, Sparkles, Send, CheckCircle2, ArrowRight } from 'lucide-react';
import { Sticker } from '../types';
import { groqService } from '../services/groqService';

interface AiVibeModalProps {
  isOpen: boolean;
  onClose: () => void;
  stickers: Sticker[];
  onApplyPack: (baseIds: string[], bonusIds: string[]) => void;
}

export const AiVibeModal: React.FC<AiVibeModalProps> = ({
  isOpen,
  onClose,
  stickers,
  onApplyPack,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    headline: string;
    reasoning: string;
    baseStickerIds: string[];
    bonusStickerIds: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    'Cozy Lofi Developer who loves coffee, python and cats',
    '8-Bit Retro Gamer nostalgic for arcade pixel classics',
    'Kawaii Boba & Anime snack enthusiast',
    'Pure Chaos, Memes and Dumpster Fire energy',
  ];

  const handleCurate = async (vibeText: string) => {
    if (!vibeText.trim()) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const curation = await groqService.curatePackByVibe(vibeText, stickers);
      setResult(curation);
    } catch (err: any) {
      setError(err.message || 'Failed to curate pack with AI. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!result) return;
    onApplyPack(result.baseStickerIds, result.bonusStickerIds);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-[28px] overflow-hidden relative shadow-soft-xl max-h-[90vh] flex flex-col border border-black/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-black/[0.06] bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center shadow-soft-xs">
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg text-slate-900 leading-none">
                AI Pack Stylist
              </h2>
              <p className="font-mono text-[10px] text-slate-400 mt-0.5">
                Powered by Groq AI • Curates 10 Base + 2 Bonus Instantly
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full border border-black/10 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-soft-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <p className="font-body text-xs text-slate-600 font-normal">
            Describe your personality, setup, or current aesthetic and Groq AI will curate an optimal 10 + 2 sticker pack for you!
          </p>

          {/* Prompt input */}
          <div className="space-y-2">
            <div className="relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCurate(prompt);
                }}
                placeholder="e.g. Late night coding with matcha tea and cute frogs..."
                className="w-full px-4 py-3 pr-12 rounded-2xl border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400 shadow-soft-xs transition-all"
                disabled={isLoading}
              />
              <button
                onClick={() => handleCurate(prompt)}
                disabled={isLoading || !prompt.trim()}
                className="absolute right-2 top-2 p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Inspiration Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(qp);
                    handleCurate(qp);
                  }}
                  className="text-[10px] font-mono px-3 py-1 rounded-full bg-slate-100 hover:bg-pink-50 text-slate-600 hover:text-pink-700 hover:border-pink-200 transition-colors border border-black/[0.05] text-left"
                >
                  ✦ {qp}
                </button>
              ))}
            </div>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="p-8 text-center bg-purple-50/50 rounded-2xl border border-purple-200 space-y-2">
              <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="font-display font-bold text-xs text-purple-900">
                Groq AI is analyzing your vibe...
              </p>
              <p className="font-mono text-[10px] text-purple-500">
                Evaluating sticker harmonies and color resonance
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono">
              {error}
            </div>
          )}

          {/* Result Card */}
          {result && (
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-black/[0.08] space-y-3 animate-in zoom-in-95 shadow-soft-xs">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  <span>AI CURATED</span>
                </span>
                <h3 className="font-display font-bold text-sm text-slate-900 truncate">
                  {result.headline}
                </h3>
              </div>

              <p className="font-body text-xs text-slate-600 italic">
                "{result.reasoning}"
              </p>

              {/* Miniature stickers grid */}
              <div>
                <span className="text-[11px] font-mono font-bold text-slate-500 block mb-1.5">
                  Curated Stickers (10 Base + 2 Free Bonus):
                </span>
                <div className="grid grid-cols-6 gap-1.5">
                  {[...result.baseStickerIds, ...result.bonusStickerIds].map((id, idx) => {
                    const st = stickers.find((s) => s.id === id);
                    const isBonus = idx >= 10;
                    return (
                      <div
                        key={idx}
                        className={`p-1 rounded-xl border text-center shadow-soft-xs ${
                          isBonus ? 'bg-pink-50 border-pink-300' : 'bg-white border-slate-200'
                        }`}
                        title={st?.name || 'Sticker'}
                      >
                        <img
                          src={st?.image_path || '/stickers/boba-ghost.svg'}
                          alt={st?.name}
                          className="w-8 h-8 object-contain mx-auto"
                        />
                        <span className="text-[8px] font-mono block truncate text-slate-500 mt-0.5">
                          {isBonus ? '★ Bonus' : `#${idx + 1}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleApply}
                className="w-full py-3 px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-display font-bold text-xs flex items-center justify-center gap-2 shadow-soft transition-all"
              >
                <span>Load This Curated Pack (12 Stickers)</span>
                <ArrowRight className="w-3.5 h-3.5 text-pink-400" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
