import React, { useState } from 'react';
import { Search, Filter, ShoppingBag, X, Check, AlertCircle, FileText, Download } from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { STATUS_LABELS, canTransitionStatus, ALLOWED_STATUS_TRANSITIONS } from '../../lib/orderWorkflow';
import { generateOrderDetailsCsv } from '../../lib/printStudio';
import { storeService } from '../../services/storeService';

interface AdminOrdersProps {
  orders: Order[];
  onOrderUpdated: () => void;
  selectedOrderForModal?: Order | null;
  onClearSelectedOrder?: () => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({
  orders,
  onOrderUpdated,
  selectedOrderForModal,
  onClearSelectedOrder,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeOrder, setActiveOrder] = useState<Order | null>(selectedOrderForModal || null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [transitionError, setTransitionError] = useState<string | null>(null);

  // Sync prop if opened externally
  React.useEffect(() => {
    if (selectedOrderForModal) {
      setActiveOrder(selectedOrderForModal);
    }
  }, [selectedOrderForModal]);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchNum = o.order_number.toLowerCase().includes(q);
      const matchCust = o.customer_name.toLowerCase().includes(q);
      const matchContact = o.customer_contact.toLowerCase().includes(q);
      if (!matchNum && !matchCust && !matchContact) return false;
    }
    return true;
  });

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!activeOrder) return;
    setTransitionError(null);

    if (!canTransitionStatus(activeOrder.status, newStatus)) {
      setTransitionError(`Transition from "${activeOrder.status}" to "${newStatus}" is not permitted.`);
      return;
    }

    setUpdatingStatus(true);
    try {
      await storeService.updateOrderStatus(activeOrder.id, newStatus, adminNoteInput.trim() || undefined);
      activeOrder.status = newStatus;
      if (adminNoteInput.trim()) activeOrder.admin_notes = adminNoteInput.trim();
      setAdminNoteInput('');
      onOrderUpdated();
    } catch (err: any) {
      setTransitionError(err.message || 'Failed to update order status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleExportOrder = (order: Order) => {
    const csv = generateOrderDetailsCsv([order]);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${order.order_number}_details.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-brand-dark">
            Customer Orders
          </h1>
          <p className="font-body text-xs text-gray-600 font-medium mt-0.5">
            Manage line items, fulfillment stages, and status history.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order #, customer..."
              className="input-neo pl-9 pr-3 py-1.5 text-xs"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border-2 border-brand-dark bg-white text-xs font-bold text-brand-dark shadow-neo-sm focus:outline-none"
          >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="submitted">Submitted</option>
            <option value="reviewed">Reviewed</option>
            <option value="ready_to_print">Ready to Print</option>
            <option value="printing">Printing</option>
            <option value="printed">Printed</option>
            <option value="packed">Packed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="on_hold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card-neo bg-white border-3 border-brand-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-mono">
                <th className="p-3.5">Order Number</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Contact</th>
                <th className="p-3.5">Items</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => {
                const badge = STATUS_LABELS[order.status] || STATUS_LABELS.submitted;
                return (
                  <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-brand-dark">
                      {order.order_number}
                    </td>
                    <td className="p-3.5 font-bold text-gray-800">
                      {order.customer_name}
                    </td>
                    <td className="p-3.5 font-mono text-gray-500">
                      {order.customer_contact}
                    </td>
                    <td className="p-3.5 font-mono">
                      {order.total_quantity} ({order.base_quantity}+{order.bonus_quantity})
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-gray-500">
                      {new Date(order.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="p-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => handleExportOrder(order)}
                        title="Export order CSV"
                        className="p-1.5 rounded-lg border border-brand-dark bg-white hover:bg-gray-100 text-brand-dark"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setActiveOrder(order)}
                        className="btn-neo-white text-[11px] py-1 px-2.5"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400 font-mono">
                    No orders match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Drawer / Modal */}
      {activeOrder && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/70 backdrop-blur-sm animate-in fade-in"
          onClick={() => {
            setActiveOrder(null);
            if (onClearSelectedOrder) onClearSelectedOrder();
          }}
        >
          <div
            className="card-neo w-full max-w-2xl bg-white overflow-hidden relative shadow-neo-xl max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b-3 border-brand-dark bg-brand-cream">
              <div>
                <span className="font-mono text-xs font-bold text-gray-500 block">
                  ORDER SPECIFICATION
                </span>
                <h2 className="font-display font-black text-xl sm:text-2xl text-brand-dark">
                  {activeOrder.order_number}
                </h2>
              </div>
              <button
                onClick={() => {
                  setActiveOrder(null);
                  if (onClearSelectedOrder) onClearSelectedOrder();
                }}
                className="p-1.5 rounded-xl border-2 border-brand-dark bg-white hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-brand-dark" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {transitionError && (
                <div className="p-3 rounded-xl bg-red-50 border-2 border-red-500 text-red-800 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{transitionError}</span>
                </div>
              )}

              {/* Customer Info Card */}
              <div className="p-4 rounded-xl border-2 border-brand-dark bg-gray-50 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-500">Customer Name:</span>
                  <span className="font-bold text-brand-dark">{activeOrder.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Primary Contact:</span>
                  <span className="font-bold text-brand-dark">{activeOrder.customer_contact}</span>
                </div>
                {activeOrder.customer_note && (
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-gray-500 block mb-0.5">Customer Note:</span>
                    <span className="text-gray-800 italic">{activeOrder.customer_note}</span>
                  </div>
                )}
                {activeOrder.admin_notes && (
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-purple-700 font-bold block mb-0.5">Admin Note:</span>
                    <span className="text-gray-800">{activeOrder.admin_notes}</span>
                  </div>
                )}
              </div>

              {/* Status Transition Control */}
              <div className="p-4 rounded-xl border-2 border-brand-dark bg-yellow-50/50">
                <div className="flex items-center justify-between mb-3">
                  <label className="font-display font-bold text-xs uppercase tracking-wider text-brand-dark">
                    Transition Fulfillment Status
                  </label>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      STATUS_LABELS[activeOrder.status]?.bg
                    } ${STATUS_LABELS[activeOrder.status]?.text} ${
                      STATUS_LABELS[activeOrder.status]?.border
                    }`}
                  >
                    Current: {STATUS_LABELS[activeOrder.status]?.label}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      'submitted',
                      'reviewed',
                      'ready_to_print',
                      'printing',
                      'printed',
                      'packed',
                      'completed',
                      'cancelled',
                      'on_hold',
                    ] as OrderStatus[]
                  ).map((status) => {
                    const isAllowed = canTransitionStatus(activeOrder.status, status);
                    const isCurrent = activeOrder.status === status;

                    return (
                      <button
                        key={status}
                        disabled={!isAllowed || isCurrent || updatingStatus}
                        onClick={() => handleStatusChange(status)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border-2 transition-all ${
                          isCurrent
                            ? 'bg-brand-dark text-white border-brand-dark'
                            : isAllowed
                            ? 'bg-white border-brand-dark hover:bg-brand-yellow text-brand-dark shadow-neo-sm'
                            : 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed'
                        }`}
                      >
                        {STATUS_LABELS[status]?.label}
                      </button>
                    );
                  })}
                </div>

                {/* Optional Note field */}
                <div className="mt-3 pt-3 border-t border-yellow-200 flex gap-2">
                  <input
                    type="text"
                    value={adminNoteInput}
                    onChange={(e) => setAdminNoteInput(e.target.value)}
                    placeholder="Attach internal note with next status change..."
                    className="input-neo py-1.5 text-xs flex-1"
                  />
                </div>
              </div>

              {/* Line Items Breakdown: Base and Bonus */}
              <div>
                <h3 className="font-display font-bold text-sm uppercase tracking-wider text-brand-dark mb-3">
                  Selected Sticker Line Items ({activeOrder.items?.length ?? 0})
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {activeOrder.items?.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl border-2 border-brand-dark flex flex-col items-center text-center ${
                        item.item_role === 'bonus' ? 'bg-pink-50' : 'bg-white'
                      }`}
                    >
                      <div className="w-14 h-14 flex items-center justify-center mb-1">
                        <img
                          src={item.image_path_snapshot}
                          alt={item.sticker_name_snapshot}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <span className="font-display font-bold text-xs text-brand-dark truncate w-full">
                        {item.sticker_name_snapshot}
                      </span>
                      <span className="text-[10px] font-mono text-gray-500 mt-0.5">
                        {item.item_role === 'bonus' ? '★ Bonus Reward' : 'Base Design'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t-3 border-brand-dark bg-gray-50 flex items-center justify-between">
              <button
                onClick={() => handleExportOrder(activeOrder)}
                className="btn-neo-white text-xs py-2 px-3 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => {
                  setActiveOrder(null);
                  if (onClearSelectedOrder) onClearSelectedOrder();
                }}
                className="btn-neo-yellow text-xs py-2 px-4"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
