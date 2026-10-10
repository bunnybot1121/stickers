import React, { useState, useMemo } from 'react';
import {
  Printer,
  Download,
  CheckCircle,
  Plus,
  Layers,
  Sparkles,
  FileSpreadsheet,
  AlertCircle,
  CheckSquare,
  Square,
} from 'lucide-react';
import { Order, PrintBatch } from '../../types';
import {
  calculatePrintDemand,
  generatePrintQuantitiesCsv,
  generateOrderDetailsCsv,
  generateOrdersSummaryCsv,
} from '../../lib/printStudio';
import { storeService } from '../../services/storeService';

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
  // Track selected order IDs for new batch
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [batchNotes, setBatchNotes] = useState('');
  const [isCreatingBatch, setIsCreatingBatch] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'batches'>('create');
  const [viewingBatch, setViewingBatch] = useState<PrintBatch | null>(null);

  // Existing allocations from store
  const allocations = storeService.getAllocations();

  // Filter orders eligible for printing (submitted, reviewed, ready_to_print)
  const eligibleOrders = useMemo(() => {
    return orders.filter(
      (o) => o.status !== 'cancelled' && o.status !== 'completed'
    );
  }, [orders]);

  // Selected orders object array
  const selectedOrders = useMemo(() => {
    return orders.filter((o) => selectedOrderIds.includes(o.id));
  }, [orders, selectedOrderIds]);

  // Compute unallocated demand across selected orders
  const { demand, totalCopies, distinctDesigns } = useMemo(() => {
    return calculatePrintDemand(selectedOrders, allocations);
  }, [selectedOrders, allocations]);

  // Toggle order selection
  const handleToggleOrder = (orderId: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  // Select all eligible orders
  const handleSelectAll = () => {
    if (selectedOrderIds.length === eligibleOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(eligibleOrders.map((o) => o.id));
    }
  };

  // Create batch action
  const handleCreateBatch = async () => {
    if (selectedOrderIds.length === 0 || totalCopies === 0) return;
    setIsCreatingBatch(true);

    try {
      const newBatch = await storeService.createPrintBatch(selectedOrderIds, batchNotes);
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

  // CSV download helper
  const downloadCsv = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export handlers
  const handleExportDemandCsv = () => {
    const csv = generatePrintQuantitiesCsv('PREVIEW-BATCH', demand);
    downloadCsv(`print_demand_preview_${Date.now()}.csv`, csv);
  };

  const handleExportBatchCsv = (batch: PrintBatch) => {
    const batchDemands = (batch.items || []).map((i) => ({
      stickerId: i.sticker_id,
      stickerName: i.sticker_name || i.sticker_id,
      imagePath: i.image_path || '',
      quantityRequired: i.quantity_required,
      contributingOrders: [],
    }));
    const csv = generatePrintQuantitiesCsv(batch.batch_number, batchDemands);
    downloadCsv(`${batch.batch_number}_quantities.csv`, csv);
  };

  const handleExportSelectedOrdersCsv = () => {
    const csv = generateOrderDetailsCsv(selectedOrders);
    downloadCsv(`order_line_items_${Date.now()}.csv`, csv);
  };

  const handleExportSummaryCsv = () => {
    const csv = generateOrdersSummaryCsv(selectedOrders);
    downloadCsv(`orders_summary_${Date.now()}.csv`, csv);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Tab Navigation */}
      <div className="card-neo p-6 bg-gradient-to-r from-pink-50 via-white to-cyan-50 border-3 border-brand-dark flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge-neo bg-brand-pink text-white text-xs">FLAGSHIP WORKFLOW</span>
            <span className="badge-neo bg-brand-yellow text-brand-dark text-xs">NO DOUBLE-COUNTING</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-brand-dark">
            Print Studio &amp; Aggregator
          </h1>
          <p className="font-body text-xs sm:text-sm text-gray-700 font-medium mt-1">
            Batch eligible customer orders, calculate design-wise copies required, and generate formula-safe print CSVs.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-display font-bold border-2 border-brand-dark transition-all ${
              activeTab === 'create'
                ? 'bg-brand-dark text-white shadow-neo-sm'
                : 'bg-white text-brand-dark hover:bg-gray-100'
            }`}
          >
            Create Batch ({selectedOrderIds.length})
          </button>
          <button
            onClick={() => setActiveTab('batches')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-display font-bold border-2 border-brand-dark transition-all ${
              activeTab === 'batches'
                ? 'bg-brand-dark text-white shadow-neo-sm'
                : 'bg-white text-brand-dark hover:bg-gray-100'
            }`}
          >
            Recorded Batches ({batches.length})
          </button>
        </div>
      </div>

      {activeTab === 'create' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Eligible Orders Selection (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="card-neo bg-white border-3 border-brand-dark p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-black text-base text-brand-dark">
                    Select Orders for Batch
                  </h2>
                  <span className="badge-neo bg-brand-cream text-brand-dark text-[11px]">
                    {eligibleOrders.length} Available
                  </span>
                </div>
                <button
                  onClick={handleSelectAll}
                  className="text-xs font-mono font-bold text-brand-pink hover:underline"
                >
                  {selectedOrderIds.length === eligibleOrders.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              {/* Orders Checklist */}
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {eligibleOrders.map((order) => {
                  const isChecked = selectedOrderIds.includes(order.id);
                  return (
                    <div
                      key={order.id}
                      onClick={() => handleToggleOrder(order.id)}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isChecked
                          ? 'border-brand-dark bg-yellow-50 shadow-neo-sm'
                          : 'border-gray-200 bg-gray-50/70 hover:border-brand-dark'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-brand-dark flex-shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                        <div>
                          <span className="font-mono font-bold text-xs text-brand-dark block">
                            {order.order_number}
                          </span>
                          <span className="text-[11px] font-body text-gray-600 block">
                            {order.customer_name} • {order.total_quantity} stickers
                          </span>
                        </div>
                      </div>

                      <span className="badge-neo bg-white text-gray-700 text-[10px] py-0">
                        {order.status}
                      </span>
                    </div>
                  );
                })}

                {eligibleOrders.length === 0 && (
                  <p className="p-4 text-center text-xs font-mono text-gray-400">
                    No eligible orders found.
                  </p>
                )}
              </div>
            </div>

            {/* Batch Preparation Box */}
            <div className="card-neo bg-white border-3 border-brand-dark p-5 space-y-3">
              <h3 className="font-display font-bold text-sm text-brand-dark">
                Batch Notes &amp; Confirm
              </h3>
              <input
                type="text"
                value={batchNotes}
                onChange={(e) => setBatchNotes(e.target.value)}
                placeholder="Optional notes e.g. Sheet size A3, glossy vinyl..."
                className="input-neo py-2 text-xs"
              />
              <button
                disabled={selectedOrderIds.length === 0 || totalCopies === 0 || isCreatingBatch}
                onClick={handleCreateBatch}
                className="w-full btn-neo-pink py-2.5 text-sm flex items-center justify-center gap-2"
              >
                {isCreatingBatch ? (
                  <span>Generating Batch Allocations...</span>
                ) : (
                  <>
                    <Printer className="w-4 h-4" />
                    <span>Generate Batch ({totalCopies} Copies)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT: Live Aggregated Demand Calculation (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="card-neo bg-white border-3 border-brand-dark p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display font-black text-lg text-brand-dark">
                      Aggregated Demand Preview
                    </h2>
                    <span className="badge-neo bg-brand-cyan text-brand-dark text-xs">
                      {distinctDesigns} Designs
                    </span>
                  </div>
                  <p className="text-xs font-mono text-gray-500 mt-0.5">
                    Total unallocated demand across {selectedOrderIds.length} selected orders: <strong>{totalCopies} sticker copies</strong>
                  </p>
                </div>

                {/* CSV Exports Strip */}
                {demand.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportDemandCsv}
                      title="Export design quantities CSV"
                      className="btn-neo-white text-xs py-1.5 px-3 flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-brand-pink" />
                      <span>Quantities CSV</span>
                    </button>
                    <button
                      onClick={handleExportSelectedOrdersCsv}
                      title="Export line items CSV"
                      className="btn-neo-white text-xs py-1.5 px-3 flex items-center gap-1.5"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-brand-cyan" />
                      <span>Orders CSV</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Demand Table */}
              {demand.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-mono">
                        <th className="p-3">Design</th>
                        <th className="p-3">ID</th>
                        <th className="p-3 text-center">Copies Needed</th>
                        <th className="p-3">Contributing Orders</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {demand.map((item) => (
                        <tr key={item.stickerId} className="hover:bg-gray-50 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-10 h-10 rounded-lg bg-gray-50 border border-brand-dark p-0.5 flex-shrink-0 flex items-center justify-center">
                                <img
                                  src={item.imagePath}
                                  alt={item.stickerName}
                                  className="max-h-full max-w-full object-contain"
                                />
                              </div>
                              <span className="font-display font-bold text-xs text-brand-dark truncate max-w-[140px]">
                                {item.stickerName}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 font-mono text-gray-500 text-[11px] truncate max-w-[100px]">
                            {item.stickerId}
                          </td>
                          <td className="p-3 text-center">
                            <span className="inline-block px-3 py-1 rounded-full bg-brand-yellow font-display font-black text-sm text-brand-dark border-2 border-brand-dark shadow-neo-sm">
                              {item.quantityRequired}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {item.contributingOrders.map((ord, idx) => (
                                <span
                                  key={idx}
                                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                                    ord.itemRole === 'bonus'
                                      ? 'bg-pink-50 border-pink-300 text-pink-700'
                                      : 'bg-gray-50 border-gray-300 text-gray-700'
                                  }`}
                                  title={`${ord.orderNumber} (${ord.itemRole})`}
                                >
                                  {ord.orderNumber.replace('ORD-', '')} ×{ord.quantity}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-10 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <Printer className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="font-display font-bold text-sm text-gray-600">
                    No Orders Selected
                  </p>
                  <p className="font-mono text-xs text-gray-400 mt-1">
                    Check orders on the left to compute aggregated print demand.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* TAB 2: Recorded Batches */
        <div className="card-neo bg-white border-3 border-brand-dark p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-black text-lg text-brand-dark">
              Recorded Print Batches
            </h2>
            <span className="text-xs font-mono text-gray-500">
              {batches.length} total batches
            </span>
          </div>

          <div className="space-y-4">
            {batches.map((batch) => (
              <div
                key={batch.id}
                className="p-4 rounded-xl border-2 border-brand-dark bg-yellow-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-base text-brand-dark">
                      {batch.batch_number}
                    </span>
                    <span className="badge-neo bg-white text-brand-dark text-[10px]">
                      {batch.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-gray-500 mt-1">
                    Created: {new Date(batch.created_at).toLocaleString()} •{' '}
                    {batch.items?.length ?? 0} unique designs
                  </p>
                  {batch.notes && (
                    <p className="text-xs font-body text-gray-700 italic mt-1">
                      Note: {batch.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExportBatchCsv(batch)}
                    className="btn-neo-white text-xs py-1.5 px-3 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-brand-pink" />
                    <span>Download CSV</span>
                  </button>
                  <button
                    onClick={() => setViewingBatch(batch)}
                    className="btn-neo-yellow text-xs py-1.5 px-3"
                  >
                    View Items
                  </button>
                </div>
              </div>
            ))}

            {batches.length === 0 && (
              <div className="p-8 text-center text-gray-400 font-mono text-xs">
                No print batches generated yet. Select orders and click "Generate Batch".
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/70 backdrop-blur-sm animate-in fade-in"
          onClick={() => setViewingBatch(null)}
        >
          <div
            className="card-neo w-full max-w-2xl bg-white overflow-hidden relative shadow-neo-xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b-3 border-brand-dark bg-brand-yellow">
              <div>
                <span className="badge-neo bg-brand-dark text-white text-[10px]">PRINT BATCH</span>
                <h3 className="font-display font-black text-xl text-brand-dark">
                  {viewingBatch.batch_number}
                </h3>
              </div>
              <button
                onClick={() => setViewingBatch(null)}
                className="p-1.5 rounded-xl border-2 border-brand-dark bg-white hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-gray-600">
                  Total Designs: {viewingBatch.items?.length ?? 0}
                </span>
                <button
                  onClick={() => handleExportBatchCsv(viewingBatch)}
                  className="btn-neo-white text-xs py-1 px-3 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-brand-pink" />
                  <span>Download Batch CSV</span>
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {viewingBatch.items?.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-display font-bold text-xs text-brand-dark block">
                        {item.sticker_name || item.sticker_id}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">
                        ID: {item.sticker_id}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="badge-neo bg-yellow-100 text-yellow-800 text-xs">
                        Required: {item.quantity_required}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
