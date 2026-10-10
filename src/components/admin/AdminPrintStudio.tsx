import React, { useState, useMemo } from 'react';
import {
  Printer,
  Download,
  Sparkles,
  FileSpreadsheet,
  CheckSquare,
  Square,
  Layers,
  ChevronDown,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { Order, PrintBatch } from '../../types';
import {
  calculatePrintDemand,
  generatePrintQuantitiesCsv,
  generateOrderDetailsCsv,
  generateOrdersSummaryCsv,
} from '../../lib/printStudio';
import { storeService } from '../../services/storeService';
import { groqService } from '../../services/groqService';

interface AdminPrintStudioProps {
  orders: Order[];
  batches: PrintBatch[];
  onBatchCreated: () => void;
}

export const AdminPrintStudio: React.FC<AdminPrintStudioProps> = ({
  orders,
  batches,
  onBatchCreated,
}) => {
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [monthFilter, setMonthFilter] = useState('this-month');
  const [activeTab, setActiveTab] = useState<'studio' | 'batches'>('studio');
  const [isCreatingBatch, setIsCreatingBatch] = useState(false);
  const [batchNotes, setBatchNotes] = useState('');
  const [viewingBatch, setViewingBatch] = useState<PrintBatch | null>(null);

  // AI Batch Optimization state
  const [isAiOptimizing, setIsAiOptimizing] = useState(false);
  const [aiOptimizationResult, setAiOptimizationResult] = useState<any | null>(null);

  // Existing allocations from store
  const allocations = storeService.getAllocations();

  // Eligible orders for printing
  const eligibleOrders = useMemo(() => {
    return orders.filter((o) => o.status !== 'cancelled' && o.status !== 'completed');
  }, [orders]);

  // If no specific orders are checked, default to analyzing all eligible orders so the studio table is full!
  const effectiveSelectedOrderIds = useMemo(() => {
    if (selectedOrderIds.length > 0) return selectedOrderIds;
    return eligibleOrders.map((o) => o.id);
  }, [selectedOrderIds, eligibleOrders]);

  const selectedOrders = useMemo(() => {
    return orders.filter((o) => effectiveSelectedOrderIds.includes(o.id));
  }, [orders, effectiveSelectedOrderIds]);

  // Compute unallocated demand
  const { demand, totalCopies, distinctDesigns } = useMemo(() => {
    return calculatePrintDemand(selectedOrders, allocations);
  }, [selectedOrders, allocations]);

  // Max quantity among demand items for proportional progress bars
  const maxDemandQuantity = useMemo(() => {
    return Math.max(...demand.map((d) => d.quantityRequired), 10);
  }, [demand]);

  const handleToggleOrder = (orderId: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrderIds.length === eligibleOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(eligibleOrders.map((o) => o.id));
    }
  };

  const handleCreateBatch = async () => {
    if (effectiveSelectedOrderIds.length === 0 || totalCopies === 0) return;
    setIsCreatingBatch(true);

    try {
      const newBatch = await storeService.createPrintBatch(effectiveSelectedOrderIds, batchNotes);
      setSelectedOrderIds([]);
      setBatchNotes('');
      onBatchCreated();
      setViewingBatch(newBatch);
      setActiveTab('batches');
    } catch (err: any) {
      alert(`Error creating print batch: ${err.message}`);
    } finally {
      setIsCreatingBatch(false);
    }
  };

  const downloadCsv = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = () => {
    const csv = generatePrintQuantitiesCsv(`PRINT-STUDIO-${Date.now()}`, demand);
    downloadCsv(`print_studio_demand_${Date.now()}.csv`, csv);
  };

  const handleAiOptimize = async () => {
    if (demand.length === 0) return;
    setIsAiOptimizing(true);
    setAiOptimizationResult(null);

    try {
      const ordersToOptimize = selectedOrders.length > 0 ? selectedOrders : eligibleOrders;
      const result = await groqService.optimizePrintBatches(ordersToOptimize);
      setAiOptimizationResult(result);
    } catch (err: any) {
      alert(`AI Optimization error: ${err.message}`);
    } finally {
      setIsAiOptimizing(false);
    }
  };

  return (
    <div className="space-y-6 text-white">
      {/* Top Header matching Reference Screen 15 (Print Studio Desktop) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight flex items-center gap-2">
            <span>Print Studio</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#FF6EB4]/20 text-[#FF6EB4] border border-[#FF6EB4]/30">
              Zero Double-Count
            </span>
          </h1>
          <p className="text-xs font-mono text-gray-400 mt-0.5">
            Real-time aggregated print runs, ink demand calculations, and AI batch grouping.
          </p>
        </div>

        {/* Controls strip */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Month Dropdown */}
          <div className="relative">
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="bg-[#181A26] border border-[#2B2E42] text-gray-200 text-xs font-mono font-bold rounded-xl px-3.5 py-2 pr-8 appearance-none focus:outline-none focus:border-[#FF6EB4] cursor-pointer"
            >
              <option value="this-month">This Month</option>
              <option value="all-time">All Pending</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" />
          </div>

          {/* AI Optimize Batches Button */}
          <button
            onClick={handleAiOptimize}
            disabled={isAiOptimizing || demand.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-display font-bold bg-[#8B5CF6] hover:bg-[#7C3AED] text-white border border-purple-400/30 transition-all shadow-sm active:translate-y-0.5"
            title="Use Groq AI to optimize print groupings and sheet layouts"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAiOptimizing ? 'animate-spin' : ''}`} />
            <span>{isAiOptimizing ? 'Analyzing with Groq...' : 'AI Organize (Groq)'}</span>
          </button>

          {/* Export CSV Button matching Mockup Screen 15 */}
          <button
            onClick={handleExportCsv}
            disabled={demand.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-display font-bold bg-[#FF6EB4] hover:bg-pink-600 text-white transition-all shadow-sm active:translate-y-0.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {/* Tab Switcher */}
          <div className="flex rounded-xl bg-[#181A26] border border-[#2B2E42] p-0.5">
            <button
              onClick={() => setActiveTab('studio')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                activeTab === 'studio' ? 'bg-[#2B2E42] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Demand Grid
            </button>
            <button
              onClick={() => setActiveTab('batches')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                activeTab === 'batches' ? 'bg-[#2B2E42] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Batches ({batches.length})
            </button>
          </div>
        </div>
      </div>

      {/* AI Optimization Modal / Drawer Banner if active */}
      {aiOptimizationResult && (
        <div className="bg-gradient-to-r from-purple-900/60 to-[#181A26] border-2 border-purple-500/40 rounded-2xl p-5 animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-500/30 flex items-center justify-center">
                <Zap className="w-4 h-4 text-purple-300" />
              </div>
              <h3 className="font-display font-black text-sm text-purple-200">
                Groq AI Print Batch Recommendations
              </h3>
            </div>
            <button
              onClick={() => setAiOptimizationResult(null)}
              className="text-xs font-mono text-purple-300 hover:text-white"
            >
              Dismiss ✕
            </button>
          </div>

          <p className="text-xs font-body text-purple-100/90 mb-3">
            {aiOptimizationResult.efficiencyRationale ||
              'Orders sorted into optimized print clusters by finish and volume.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {aiOptimizationResult.recommendedBatches?.map((b: any, idx: number) => (
              <div key={idx} className="bg-[#12131A]/80 border border-purple-500/30 rounded-xl p-3">
                <div className="flex justify-between items-center text-xs font-mono font-bold text-purple-300 mb-1">
                  <span>{b.batchName}</span>
                  <span className="text-[10px] text-gray-400">{b.estimatedSheets} Sheets • {b.targetFinish}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {b.stickerNames?.map((name: string, i: number) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900/40 border border-purple-500/20 text-purple-200">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'studio' ? (
        <div className="space-y-6">
          {/* Main Print Studio Table matching Reference Screen 15 */}
          <div className="bg-[#181A26] rounded-2xl border border-[#2B2E42] overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#12131A] border-b border-[#2B2E42] text-gray-400 font-mono">
                    <th className="p-4 w-24">Sticker</th>
                    <th className="p-4">Design Name</th>
                    <th className="p-4 text-right w-36">Total Quantity</th>
                    <th className="p-4 w-1/3">Production Demand Bar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2B2E42]">
                  {demand.map((item) => {
                    const barPercent = Math.min(
                      Math.round((item.quantityRequired / maxDemandQuantity) * 100),
                      100
                    );

                    return (
                      <tr key={item.stickerId} className="hover:bg-[#1E2130] transition-colors">
                        {/* Sticker Artwork Avatar */}
                        <td className="p-4">
                          <div className="w-10 h-10 rounded-xl bg-[#12131A] border border-[#2B2E42] p-1 flex items-center justify-center">
                            <img
                              src={item.imagePath}
                              alt={item.stickerName}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                        </td>

                        {/* Design Name */}
                        <td className="p-4 font-display font-bold text-sm text-white">
                          <div>{item.stickerName}</div>
                          <div className="text-[10px] font-mono text-gray-400 mt-0.5">
                            {item.contributingOrders.length} orders contributing
                          </div>
                        </td>

                        {/* Total Quantity */}
                        <td className="p-4 font-mono font-black text-right text-base text-white">
                          {item.quantityRequired}
                        </td>

                        {/* Horizontal Hot Pink Demand Bar matching Mockup */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-[#12131A] rounded-full h-3 overflow-hidden">
                              <div
                                className="bg-[#FF6EB4] h-3 rounded-full transition-all duration-500 shadow-sm"
                                style={{ width: `${barPercent}%` }}
                              />
                            </div>
                            <span className="font-mono text-[11px] text-gray-400 w-10 text-right">
                              {barPercent}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {demand.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-12 text-center text-gray-400 font-mono">
                        No pending stickers require printing. All order items are fully allocated!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Action Footer */}
            <div className="p-4 sm:p-5 bg-[#141620] border-t border-[#2B2E42] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs font-mono text-gray-400">
                Summary: <strong className="text-white">{distinctDesigns} Designs</strong> •{' '}
                <strong className="text-white">{totalCopies} Copies Required</strong>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <input
                  type="text"
                  value={batchNotes}
                  onChange={(e) => setBatchNotes(e.target.value)}
                  placeholder="Batch note e.g. Matte Vinyl A3..."
                  className="bg-[#181A26] border border-[#2B2E42] text-xs font-mono text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#FF6EB4] flex-1 sm:w-60"
                />
                <button
                  onClick={handleCreateBatch}
                  disabled={isCreatingBatch || demand.length === 0}
                  className="px-5 py-2 rounded-xl text-xs font-display font-bold bg-[#FF6EB4] hover:bg-pink-600 text-white shadow-sm transition-all whitespace-nowrap active:translate-y-0.5"
                >
                  {isCreatingBatch ? 'Allocating...' : 'Commit Batch Run'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* TAB 2: Recorded Batches (Dark Theme) */
        <div className="bg-[#181A26] rounded-2xl border border-[#2B2E42] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-black text-base text-white">
              Recorded Print Runs
            </h2>
            <span className="text-xs font-mono text-gray-400">
              {batches.length} total batches
            </span>
          </div>

          <div className="space-y-3">
            {batches.map((batch) => (
              <div
                key={batch.id}
                className="p-4 rounded-xl border border-[#2B2E42] bg-[#12131A] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-white">
                      {batch.batch_number}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {batch.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-gray-400 mt-1">
                    Created: {new Date(batch.created_at).toLocaleString()} • {batch.items?.length ?? 0} unique designs
                  </p>
                  {batch.notes && (
                    <p className="text-xs font-body text-gray-300 italic mt-0.5">
                      Note: {batch.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const csv = generatePrintQuantitiesCsv(
                        batch.batch_number,
                        (batch.items || []).map((i) => ({
                          stickerId: i.sticker_id,
                          stickerName: i.sticker_name || i.sticker_id,
                          imagePath: i.image_path || '',
                          quantityRequired: i.quantity_required,
                          contributingOrders: [],
                        }))
                      );
                      downloadCsv(`${batch.batch_number}_quantities.csv`, csv);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-[#2B2E42] bg-[#181A26] hover:bg-[#25283B] text-xs font-mono font-bold text-gray-200 flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#FF6EB4]" />
                    <span>Download CSV</span>
                  </button>
                  <button
                    onClick={() => setViewingBatch(batch)}
                    className="px-3 py-1.5 rounded-xl bg-[#2B2E42] hover:bg-[#383C56] text-xs font-mono font-bold text-white transition-colors"
                  >
                    View Items
                  </button>
                </div>
              </div>
            ))}

            {batches.length === 0 && (
              <div className="p-8 text-center text-gray-400 font-mono text-xs">
                No print batches recorded yet. Click "Commit Batch Run" to lock in print copies.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Batch Details Modal */}
      {viewingBatch && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setViewingBatch(null)}
        >
          <div
            className="w-full max-w-xl bg-[#181A26] border border-[#2B2E42] rounded-3xl overflow-hidden relative shadow-2xl max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-[#2B2E42] bg-[#12131A]">
              <div>
                <span className="text-[10px] font-mono text-[#FF6EB4] font-bold uppercase tracking-wider">
                  PRINT BATCH DETAILS
                </span>
                <h3 className="font-display font-black text-xl text-white">
                  {viewingBatch.batch_number}
                </h3>
              </div>
              <button
                onClick={() => setViewingBatch(null)}
                className="p-1.5 rounded-xl border border-[#2B2E42] hover:bg-[#25283B] text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-3">
              {viewingBatch.items?.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-[#12131A] border border-[#2B2E42] flex items-center justify-between"
                >
                  <div>
                    <span className="font-display font-bold text-sm text-white block">
                      {item.sticker_name || item.sticker_id}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">
                      ID: {item.sticker_id}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#FF6EB4]/20 text-[#FF6EB4] border border-[#FF6EB4]/30">
                    Qty: {item.quantity_required}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

