import React, { useState, useEffect } from 'react';
import { Box, Plus, Minus, AlertTriangle, ArrowUpDown, History } from 'lucide-react';
import { Sticker, InventoryMovement } from '../../types';
import { storeService } from '../../services/storeService';

interface AdminInventoryProps {
  stickers: Sticker[];
  onInventoryAdjusted: () => void;
}

export const AdminInventory: React.FC<AdminInventoryProps> = ({
  stickers,
  onInventoryAdjusted,
}) => {
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [adjustingSticker, setAdjustingSticker] = useState<Sticker | null>(null);
  const [adjustDelta, setAdjustDelta] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState<string>('Restock batch');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    storeService.getInventoryMovements().then(setMovements);
  }, []);

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingSticker || adjustDelta === 0) return;

    setIsSubmitting(true);
    try {
      await storeService.adjustInventory(adjustingSticker.id, adjustDelta, adjustReason.trim());
      const updated = await storeService.getInventoryMovements();
      setMovements(updated);
      setAdjustingSticker(null);
      setAdjustDelta(10);
      setAdjustReason('Restock batch');
      onInventoryAdjusted();
    } catch (err: any) {
      alert(`Error adjusting stock: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inventoryTracked = stickers.filter((s) => s.track_inventory);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-brand-dark">
          Inventory Movements &amp; Stock
        </h1>
        <p className="font-body text-xs text-gray-600 font-medium mt-0.5">
          Track physical sticker inventory, record restocks, and inspect movement audit logs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Current Stock Table (8 cols) */}
        <div className="lg:col-span-8 card-neo bg-white border-3 border-brand-dark overflow-hidden">
          <div className="p-4 border-b-2 border-brand-dark/10 flex items-center justify-between">
            <h2 className="font-display font-bold text-base text-brand-dark">
              Stock On Hand ({inventoryTracked.length} tracked items)
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-mono">
                  <th className="p-3">Design</th>
                  <th className="p-3">Stock on Hand</th>
                  <th className="p-3">Threshold</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inventoryTracked.map((sticker) => {
                  const stock = sticker.stock_on_hand ?? 0;
                  const threshold = sticker.low_stock_threshold ?? 10;
                  const isLow = stock <= threshold && stock > 0;
                  const isOut = stock === 0;

                  return (
                    <tr key={sticker.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-3 font-bold text-gray-800">
                        <div className="flex items-center gap-2">
                          <img
                            src={sticker.image_path}
                            alt={sticker.name}
                            className="w-8 h-8 object-contain rounded border p-0.5"
                          />
                          <span>{sticker.name}</span>
                        </div>
                      </td>
                      <td className="p-3 font-mono font-bold text-base text-brand-dark">
                        {stock}
                      </td>
                      <td className="p-3 font-mono text-gray-500">{threshold}</td>
                      <td className="p-3">
                        {isOut ? (
                          <span className="badge-neo bg-red-100 text-red-800 text-[10px] py-0">
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="badge-neo bg-amber-100 text-amber-800 text-[10px] py-0">
                            Low Stock
                          </span>
                        ) : (
                          <span className="badge-neo bg-emerald-100 text-emerald-800 text-[10px] py-0">
                            Healthy
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setAdjustingSticker(sticker)}
                          className="btn-neo-white text-[11px] py-1 px-2.5"
                        >
                          Adjust
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Movements Log (4 cols) */}
        <div className="lg:col-span-4 card-neo bg-white border-3 border-brand-dark p-5">
          <div className="flex items-center gap-2 mb-3">
            <History className="w-4 h-4 text-brand-dark" />
            <h2 className="font-display font-bold text-sm uppercase tracking-wider text-brand-dark">
              Movements Audit Log
            </h2>
          </div>

          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1 text-xs">
            {movements.slice(0, 15).map((m) => {
              const st = stickers.find((s) => s.id === m.sticker_id);
              const isPositive = m.quantity_delta > 0;

              return (
                <div key={m.id} className="p-2.5 rounded-xl border border-gray-200 bg-gray-50 font-mono">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-brand-dark truncate max-w-[140px]">
                      {st?.name || 'Sticker'}
                    </span>
                    <span
                      className={`font-black ${
                        isPositive ? 'text-emerald-700' : 'text-red-700'
                      }`}
                    >
                      {isPositive ? `+${m.quantity_delta}` : m.quantity_delta}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 font-sans">
                    {m.reason || m.movement_type}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">
                    {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              );
            })}

            {movements.length === 0 && (
              <p className="p-4 text-center text-xs font-mono text-gray-400">
                No movements logged yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Adjustment Modal */}
      {adjustingSticker && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/70 backdrop-blur-sm animate-in fade-in"
          onClick={() => setAdjustingSticker(null)}
        >
          <div
            className="card-neo w-full max-w-sm bg-white overflow-hidden relative shadow-neo-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b-3 border-brand-dark bg-brand-yellow font-display font-black text-lg text-brand-dark">
              Adjust Stock: {adjustingSticker.name}
            </div>

            <form onSubmit={handleAdjust} className="p-6 space-y-4 text-xs font-body">
              <div>
                <label className="block font-display font-bold uppercase tracking-wider text-brand-dark mb-1">
                  Quantity Delta (+ to add, - to subtract)
                </label>
                <input
                  type="number"
                  required
                  value={adjustDelta}
                  onChange={(e) => setAdjustDelta(parseInt(e.target.value) || 0)}
                  className="input-neo py-2 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block font-display font-bold uppercase tracking-wider text-brand-dark mb-1">
                  Reason for Adjustment
                </label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Restocked batch from local printer"
                  className="input-neo py-2"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustingSticker(null)}
                  className="btn-neo-white text-xs py-2 px-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-neo-yellow text-xs py-2 px-4"
                >
                  {isSubmitting ? 'Saving...' : 'Apply Stock Change'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
