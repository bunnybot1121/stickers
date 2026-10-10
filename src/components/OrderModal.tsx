import React, { useState } from 'react';
import { X, Send, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PackSelectionState, PackRule, Sticker } from '../types';
import { storeService } from '../services/storeService';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selection: PackSelectionState;
  rule: PackRule;
  stickersMap: Map<string, Sticker>;
  onOrderSuccess: (orderNumber: string, orderId: string) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  selection,
  rule,
  stickersMap,
  onOrderSuccess,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form validation
    if (!customerName.trim()) {
      setErrorMessage('Please provide your name.');
      return;
    }
    if (!customerContact.trim()) {
      setErrorMessage('Please provide your email address or phone number for order updates.');
      return;
    }
    if (!acceptedTerms) {
      setErrorMessage('Please confirm acknowledgment of the order terms.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate client-side idempotency token to prevent double submissions
      const idempotencyKey = `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      const res = await storeService.submitOrder({
        customerName: customerName.trim(),
        customerContact: customerContact.trim(),
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
      setErrorMessage(err.message || 'An unexpected error occurred while placing the order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/70 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="card-neo w-full max-w-xl bg-white overflow-hidden relative shadow-neo-xl max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b-3 border-brand-dark bg-brand-cyan">
          <div>
            <h2 id="order-modal-title" className="font-display font-black text-xl sm:text-2xl text-brand-dark">
              Complete Your Custom Pack
            </h2>
            <p className="font-mono text-xs text-brand-dark font-bold">
              10 Base Designs + 2 Bonus Stickers (12 Items Total)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border-2 border-brand-dark bg-white hover:bg-gray-100 shadow-neo-sm transition-all"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 text-brand-dark" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border-2 border-red-500 text-red-800 text-xs font-bold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Pack Review Snippet */}
          <div className="p-4 rounded-xl border-2 border-brand-dark bg-yellow-50/70">
            <div className="flex items-center justify-between mb-2">
              <span className="font-display font-bold text-sm text-brand-dark">Pack Breakdown:</span>
              <span className="badge-neo bg-brand-pink text-white text-[10px]">10 + 2 QUALIFIED</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[...selection.baseStickerIds, ...selection.bonusStickerIds].map((id, idx) => {
                const s = stickersMap.get(id);
                const isBonus = idx >= 10;
                return (
                  <span
                    key={`${id}-${idx}`}
                    className={`inline-flex items-center px-2 py-0.5 rounded-lg border text-[10px] font-mono font-bold ${
                      isBonus
                        ? 'bg-brand-pink/20 border-brand-pink text-pink-900'
                        : 'bg-white border-brand-dark text-brand-dark'
                    }`}
                  >
                    {s?.name || 'Sticker'} {isBonus && '★'}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Customer Name */}
          <div>
            <label className="block font-display font-bold text-xs uppercase tracking-wider text-brand-dark mb-1.5">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              id="customer-name-input"
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Maya Lin"
              className="input-neo text-sm"
              disabled={isSubmitting}
            />
          </div>

          {/* Primary Contact */}
          <div>
            <label className="block font-display font-bold text-xs uppercase tracking-wider text-brand-dark mb-1.5">
              Primary Contact (Email or Phone) <span className="text-red-500">*</span>
            </label>
            <input
              id="customer-contact-input"
              type="text"
              required
              value={customerContact}
              onChange={(e) => setCustomerContact(e.target.value)}
              placeholder="e.g. maya@example.com or +1 555-0192"
              className="input-neo text-sm"
              disabled={isSubmitting}
            />
            <span className="text-[11px] font-mono text-gray-500 block mt-1">
              We will use this to confirm production and dispatch details.
            </span>
          </div>

          {/* Optional Note */}
          <div>
            <label className="block font-display font-bold text-xs uppercase tracking-wider text-brand-dark mb-1.5">
              Production or Packaging Note <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <textarea
              id="customer-note-input"
              rows={2}
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              placeholder="Any special handling notes, gift message, or convention pick-up..."
              className="input-neo text-sm resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Consent Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                id="customer-terms-checkbox"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-2 border-brand-dark text-brand-pink focus:ring-0"
              />
              <span className="text-xs text-gray-700 font-medium">
                I agree to the order terms and consent to Sticker Universe contacting me regarding this custom pack fulfillment.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              id="submit-order-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-neo-yellow text-base py-3 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-3 border-brand-dark border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Order to Studio...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Custom Pack Order</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
