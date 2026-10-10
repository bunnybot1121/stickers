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
  const [customerEmail, setCustomerEmail] = useState('');
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
        customerEmail: customerEmail.trim() || undefined,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-brand-dark/70 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#FAF7F2] rounded-3xl border-3 border-brand-dark overflow-hidden relative shadow-neo-xl max-h-[94vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top App Header matching reference screens */}
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-brand-dark bg-white">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl border border-brand-dark hover:bg-gray-100 transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4 text-brand-dark" />
            </button>
            <span className="font-display font-black text-xl tracking-tight text-brand-dark">
              STICKER<span className="text-[#FF6EB4]">Z</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border-2 border-brand-dark bg-white hover:bg-gray-100 shadow-neo-sm transition-all"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4 text-brand-dark" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <h2 id="order-modal-title" className="font-display font-black text-2xl text-brand-dark">
              Order Details
            </h2>
            <span className="badge-neo bg-[#FF6EB4] text-white text-[11px] py-0.5">
              10 + 2 Deal Applied
            </span>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-50 border-2 border-red-500 text-red-800 text-xs font-bold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Pack Review Snippet Box matching Mockup Screen 08 / 11 */}
          <div className="p-4 rounded-2xl bg-white border-2 border-brand-dark shadow-neo-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="font-display font-bold text-sm text-brand-dark">
                Your Pack ({totalSelected} Stickers)
              </span>
              {onEditPack && (
                <button
                  type="button"
                  onClick={onEditPack}
                  className="text-xs font-mono font-bold text-[#FF6EB4] hover:underline flex items-center gap-1"
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
                    className={`relative aspect-square rounded-xl border-2 flex items-center justify-center p-1 ${
                      isBonus
                        ? 'border-[#FF6EB4] bg-pink-50 ring-1 ring-[#FF6EB4]'
                        : 'border-brand-dark bg-[#FAF7F2]'
                    }`}
                    title={`${s?.name || 'Sticker'} ${isBonus ? '(Bonus ★)' : ''}`}
                  >
                    {s?.image_path ? (
                      <img
                        src={s.image_path}
                        alt={s.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <Sparkles className="w-4 h-4 text-[#FF6EB4]" />
                    )}
                    {isBonus && (
                      <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-[#FF6EB4] text-white font-mono font-bold text-[8px] flex items-center justify-center">
                        ★
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full Name Input */}
          <div>
            <label className="block font-display font-bold text-xs uppercase tracking-wider text-brand-dark mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="customer-name-input"
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-2xl border-2 border-brand-dark bg-white font-body text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6EB4] shadow-neo-sm transition-all"
              disabled={isSubmitting}
            />
          </div>

          {/* Contact Number Input with +91 Country Code Badge */}
          <div>
            <label className="block font-display font-bold text-xs uppercase tracking-wider text-brand-dark mb-1.5">
              Contact Number <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center rounded-2xl border-2 border-brand-dark bg-white shadow-neo-sm overflow-hidden focus-within:ring-2 focus-within:ring-[#FF6EB4]">
              <span className="px-3.5 py-3 font-mono font-bold text-xs bg-gray-100 border-r-2 border-brand-dark text-gray-700 select-none">
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

          {/* Email Input (Optional) */}
          <div>
            <label className="block font-display font-bold text-xs uppercase tracking-wider text-brand-dark mb-1.5">
              Email <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="customer-email-input"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="yourmail@gmail.com"
              className="w-full px-4 py-3 rounded-2xl border-2 border-brand-dark bg-white font-body text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6EB4] shadow-neo-sm transition-all"
              disabled={isSubmitting}
            />
          </div>

          {/* Special Notes (Optional) */}
          <div>
            <label className="block font-display font-bold text-xs uppercase tracking-wider text-brand-dark mb-1.5">
              Any special notes? <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="customer-note-input"
              rows={2}
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              placeholder="E.g. preferred themes, gift, etc."
              className="w-full px-4 py-3 rounded-2xl border-2 border-brand-dark bg-white font-body text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6EB4] shadow-neo-sm transition-all resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Big Vibrant Pink Submit Button matching Mockup */}
          <div className="pt-2">
            <button
              id="submit-order-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-2xl border-2 border-brand-dark bg-[#FF6EB4] hover:bg-pink-600 active:translate-x-0.5 active:translate-y-0.5 text-white font-display font-extrabold text-base shadow-neo flex items-center justify-center gap-2.5 transition-all"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Order...</span>
                </>
              ) : (
                <>
                  <span>Submit Order</span>
                  <span className="text-lg">✈</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

