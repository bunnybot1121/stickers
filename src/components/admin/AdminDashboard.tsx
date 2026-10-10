import React from 'react';
import { ShoppingBag, Printer, Layers, AlertCircle, ArrowRight, Clock, CheckCircle } from 'lucide-react';
import { Order, Sticker } from '../../types';
import { STATUS_LABELS } from '../../lib/orderWorkflow';

interface AdminDashboardProps {
  orders: Order[];
  stickers: Sticker[];
  onNavigateTab: (tab: string) => void;
  onSelectOrder: (order: Order) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  stickers,
  onNavigateTab,
  onSelectOrder,
}) => {
  const submittedOrders = orders.filter((o) => o.status === 'submitted');
  const readyToPrintOrders = orders.filter((o) => o.status === 'ready_to_print');
  const completedOrders = orders.filter((o) => o.status === 'completed');
  const activeStickers = stickers.filter((s) => s.status === 'active');
  const lowStockStickers = stickers.filter(
    (s) => s.track_inventory && (s.stock_on_hand ?? 0) <= (s.low_stock_threshold ?? 10)
  );

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="card-neo p-6 bg-gradient-to-r from-brand-yellow via-white to-brand-cyan/20 border-3 border-brand-dark flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="badge-neo bg-brand-dark text-white text-xs mb-2">OPERATIONS CENTER</span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-brand-dark">
            Sticker Studio Overview
          </h1>
          <p className="font-body text-xs sm:text-sm text-gray-700 font-medium mt-1">
            Real-time orders, catalogue movements, and Print Studio aggregated demand.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onNavigateTab('print-studio')}
            className="btn-neo-pink py-2 px-4 text-xs sm:text-sm flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Open Print Studio</span>
          </button>
          <button
            onClick={() => onNavigateTab('catalogue')}
            className="btn-neo-white py-2 px-4 text-xs sm:text-sm flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4" />
            <span>Catalogue</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-neo p-5 bg-white border-3 border-brand-dark">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider">New Orders</span>
            <Clock className="w-4 h-4 text-brand-cyan" />
          </div>
          <div className="font-display font-black text-3xl text-brand-dark">
            {submittedOrders.length}
          </div>
          <span className="text-[11px] font-mono text-gray-500 mt-1 block">Awaiting review</span>
        </div>

        <div className="card-neo p-5 bg-white border-3 border-brand-dark">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider">Ready to Print</span>
            <Printer className="w-4 h-4 text-brand-pink" />
          </div>
          <div className="font-display font-black text-3xl text-brand-pink">
            {readyToPrintOrders.length}
          </div>
          <span className="text-[11px] font-mono text-gray-500 mt-1 block">In print queue</span>
        </div>

        <div className="card-neo p-5 bg-white border-3 border-brand-dark">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider">Active Designs</span>
            <Layers className="w-4 h-4 text-brand-purple" />
          </div>
          <div className="font-display font-black text-3xl text-brand-dark">
            {activeStickers.length}
          </div>
          <span className="text-[11px] font-mono text-gray-500 mt-1 block">In public catalogue</span>
        </div>

        <div className="card-neo p-5 bg-white border-3 border-brand-dark">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider">Low Stock</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="font-display font-black text-3xl text-amber-600">
            {lowStockStickers.length}
          </div>
          <span className="text-[11px] font-mono text-gray-500 mt-1 block">Under threshold</span>
        </div>
      </div>

      {/* Recent Orders Card */}
      <div className="card-neo bg-white border-3 border-brand-dark overflow-hidden">
        <div className="p-5 border-b-2 border-brand-dark/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-dark" />
            <h2 className="font-display font-black text-lg text-brand-dark">
              Recent Customer Orders
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-mono font-bold text-brand-pink hover:underline flex items-center gap-1"
          >
            <span>View All ({orders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-mono">
                <th className="p-3.5">Order Number</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Stickers</th>
                <th className="p-3.5">Submitted</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => {
                const badge = STATUS_LABELS[order.status] || STATUS_LABELS.submitted;
                return (
                  <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-brand-dark">
                      {order.order_number}
                    </td>
                    <td className="p-3.5 font-bold text-gray-800">
                      <div>{order.customer_name}</div>
                      <div className="text-[10px] font-mono text-gray-400 font-normal">
                        {order.customer_contact}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono">
                      {order.total_quantity} items ({order.base_quantity}+{order.bonus_quantity})
                    </td>
                    <td className="p-3.5 font-mono text-gray-500">
                      {new Date(order.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => onSelectOrder(order)}
                        className="btn-neo-white text-[11px] py-1 px-2.5"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400 font-mono">
                    No orders placed yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
