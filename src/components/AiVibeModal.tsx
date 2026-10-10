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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="card-neo w-full max-w-lg bg-white overflow-hidden relative shadow-neo-xl max-h-[90vh] flex flex-col border-2 border-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-black/10 bg-[#FAF7F2]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EBD4FF] border border-purple-300 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-700" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg text-brand-dark">
                AI Pack Stylist
              </h2>
              <p className="font-mono text-[10px] text-gray-500">
                Powered by Groq AI • Generates 10 Base + 2 Bonus Instantly
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full border border-black/20 bg-white hover:bg-gray-100"
          >
            <X className="w-4 h-4 text-black" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <p className="font-body text-xs text-gray-700 font-medium">
            Describe your personality, hobbies, or aesthetic vibe and Groq AI will select the perfect 10 + 2 sticker pack for you!
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
                className="input-neo py-2 text-xs pr-10"
                disabled={isLoading}
              />
              <button
                onClick={() => handleCurate(prompt)}
                disabled={isLoading || !prompt.trim()}
                className="absolute right-2 top-2 p-1.5 rounded-lg bg-[#FACC15] text-black hover:bg-yellow-400 disabled:opacity-40"
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
                  className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-gray-100 hover:bg-[#FFE4EF] text-gray-700 hover:text-pink-800 transition-colors border border-black/10 text-left"
                >
                  ✦ {qp}
                </button>
              ))}
            </div>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="p-8 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-purple-200 space-y-2">
              <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="font-display font-bold text-xs text-purple-900">
                Groq AI is styling your 10 + 2 pack...
              </p>
              <p className="font-mono text-[10px] text-gray-400">
                Analyzing sticker catalog vibes &amp; harmony
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-red-700 text-xs font-mono">
              {error}
            </div>
          )}

          {/* Result Card */}
          {result && (
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border-2 border-black/80 space-y-3 animate-in zoom-in-95">
              <div className="flex items-center gap-2">
                <span className="badge-neo bg-[#FACC15] text-black text-[10px]">
                  AI CURATED
                </span>
                <h3 className="font-display font-black text-sm text-brand-dark">
                  {result.headline}
                </h3>
              </div>

              <p className="font-body text-xs text-gray-600 italic">
                "{result.reasoning}"
              </p>

              {/* Miniature stickers grid */}
              <div>
                <span className="text-[11px] font-mono font-bold text-gray-500 block mb-1.5">
                  Curated Stickers (10 Base + 2 Bonus):
                </span>
                <div className="grid grid-cols-6 gap-1.5">
                  {[...result.baseStickerIds, ...result.bonusStickerIds].map((id, idx) => {
                    const st = stickers.find((s) => s.id === id);
                    const isBonus = idx >= 10;
                    return (
                      <div
                        key={idx}
                        className={`p-1 rounded-lg border text-center ${
                          isBonus ? 'bg-pink-100 border-[#FF6EB4]' : 'bg-white border-black/20'
                        }`}
                        title={st?.name || 'Sticker'}
                      >
                        <img
                          src={st?.image_path || '/stickers/boba-ghost.svg'}
                          alt={st?.name}
                          className="w-8 h-8 object-contain mx-auto"
                        />
                        <span className="text-[8px] font-mono block truncate">
                          {isBonus ? '★ Bonus' : `#${idx + 1}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleApply}
                className="w-full btn-neo-yellow py-2 text-xs font-black flex items-center justify-center gap-2 shadow-neo"
              >
                <span>Load This Curated Pack</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
