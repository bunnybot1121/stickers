import React, { useState } from 'react';
import { X, Send, AlertCircle, Edit3, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { PackSelectionState, PackRule, Sticker } from '../types';
import { storeService } from '../services/storeService';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selection: PackSelectionState;
  rule: PackRule;
  stickersMap: Map<string, Sticker>;
  onOrderSuccess: (orderNumber: string, orderId: string) => void;
  onEditPack?: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  selection,
  rule,
  stickersMap,
  onOrderSuccess,
  onEditPack,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalSelected = selection.baseStickerIds.length + selection.bonusStickerIds.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!customerContact.trim()) {
      setErrorMessage('Please enter your contact number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const idempotencyKey = `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      const res = await storeService.submitOrder({
        customerName: customerName.trim(),
        customerContact: `+91 ${customerContact.trim().replace(/^\+91\s*/, '')}`,
        customerNote: customerNote.trim() || undefined,
        baseStickerIds: selection.baseStickerIds,
        bonusStickerIds: selection.bonusStickerIds,
        idempotencyKey,
      });

      if (res.success) {
        onOrderSuccess(res.orderNumber, res.orderId);
      } else {
        setErrorMessage(res.error || 'Failed to submit order. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred while placing your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-[28px] border border-black/10 overflow-hidden relative shadow-soft-xl max-h-[94vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top App Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.06] bg-slate-50/70">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full border border-black/10 bg-white hover:bg-slate-100 transition-colors shadow-soft-xs"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4 text-slate-700" />
            </button>
            <span className="font-display font-black text-xl tracking-tight text-slate-900">
              STICKER<span className="text-[#FF6EB4]">VERSE</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full border border-black/10 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-soft-xs"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 id="order-modal-title" className="font-display font-black text-2xl text-slate-900 leading-tight">
                Complete Your Pack
              </h2>
              <p className="text-xs text-slate-500 font-medium">Review your custom pack and confirm your reservation</p>
            </div>
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#FF6EB4] to-purple-600 text-white text-[11px] font-mono font-bold px-3 py-1 rounded-full shadow-soft-xs">
              <Sparkles className="w-3 h-3 text-yellow-300" />
              <span>10 + 2 Deal</span>
            </span>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-start gap-2 shadow-soft-xs">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Pack Review Snippet Box */}
          <div className="p-4 rounded-2xl bg-slate-50/70 border border-black/[0.06] shadow-soft-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-slate-500">
                Your Pack ({totalSelected} Stickers Selected)
              </span>
              {onEditPack && (
                <button
                  type="button"
                  onClick={onEditPack}
                  className="text-xs font-mono font-bold text-pink-600 hover:text-pink-700 hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Pack</span>
                </button>
              )}
            </div>

            {/* Sticker Thumbnail Grid */}
            <div className="grid grid-cols-6 gap-2">
              {[...selection.baseStickerIds, ...selection.bonusStickerIds].map((id, idx) => {
                const s = stickersMap.get(id);
                const isBonus = idx >= 10;
                return (
                  <div
                    key={`${id}-${idx}`}
                    className={`relative aspect-square rounded-xl border flex items-center justify-center p-1 shadow-soft-xs ${
                      isBonus
                        ? 'border-pink-300 bg-pink-50/80 ring-1 ring-pink-300'
                        : 'border-slate-200 bg-white'
                    }`}
                    title={`${s?.name || 'Sticker'} ${isBonus ? '(Bonus)' : ''}`}
                  >
                    {s?.image_path ? (
                      <img
                        src={s.image_path}
                        alt={s.name}
                        className="max-h-full max-w-full object-contain filter drop-shadow-sm"
                      />
                    ) : (
                      <Sparkles className="w-4 h-4 text-[#FF6EB4]" />
                    )}
                    {isBonus && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-gradient-to-r from-[#FF6EB4] to-purple-600 text-white flex items-center justify-center shadow-soft-xs">
                        <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full Name Input */}
          <div>
            <label className="block font-display font-bold text-xs uppercase tracking-wider text-slate-700 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="customer-name-input"
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white font-body text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6EB4]/40 focus:border-[#FF6EB4] shadow-soft-xs transition-all"
              disabled={isSubmitting}
            />
          </div>

          {/* Contact Number Input with +91 Country Code Badge */}
          <div>
            <label className="block font-display font-bold text-xs uppercase tracking-wider text-slate-700 mb-1.5">
              Contact Number <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center rounded-2xl border border-slate-200 bg-white shadow-soft-xs overflow-hidden focus-within:ring-2 focus-within:ring-[#FF6EB4]/40 focus-within:border-[#FF6EB4]">
              <span className="px-4 py-3 font-mono font-bold text-xs bg-slate-100 border-r border-slate-200 text-slate-700 select-none">
                +91
              </span>
              <input
                id="customer-contact-input"
                type="tel"
                required
                value={customerContact}
                onChange={(e) => setCustomerContact(e.target.value)}
                placeholder="98765 43210"
                className="w-full px-4 py-3 font-mono text-sm font-semibold focus:outline-none bg-transparent"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Special Notes / Instructions */}
          <div>
            <label className="block font-display font-bold text-xs uppercase tracking-wider text-slate-700 mb-1.5">
              Special Notes / Instructions <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="customer-note-input"
              rows={2}
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              placeholder="Any special notes or custom preferences for your pack"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white font-body text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6EB4]/40 focus:border-[#FF6EB4] shadow-soft-xs transition-all resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Big Vibrant Submit Button */}
          <div className="pt-2">
            <button
              id="submit-order-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#FF6EB4] via-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 active:scale-[0.99] text-white font-display font-extrabold text-base shadow-glow-pink/40 hover:shadow-glow-pink/60 flex items-center justify-center gap-2.5 transition-all"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Confirming Order...</span>
                </>
              ) : (
                <>
                  <span>Place Order (10 + 2 Pack)</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
