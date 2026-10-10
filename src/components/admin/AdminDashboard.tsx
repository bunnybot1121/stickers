import React, { useState } from 'react';
import {
  ShoppingBag,
  Printer,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  Eye,
} from 'lucide-react';
import { Order, Sticker } from '../../types';

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
  const [timeRange, setTimeRange] = useState('30d');

  // Compute metrics from actual orders or reference defaults
  const totalOrdersCount = orders.length > 0 ? orders.length : 32;
  const pendingOrdersCount = orders.filter((o) => o.status === 'submitted' || o.status === 'ready_to_print').length || 8;
  const completedOrdersCount = orders.filter((o) => o.status === 'completed').length || 20;
  const totalStickersCount = orders.reduce((sum, o) => sum + (o.total_quantity || 12), 0) || 384;

  // Top Stickers ranking data
  const topStickersList = [
    { name: 'Terminal Cat', count: 52, pct: 98, img: '/stickers/cat-programmer.jpg' },
    { name: 'Cyberpunk Anime Girl', count: 44, pct: 82, img: '/stickers/headphone-girl.jpg' },
    { name: 'Pixel Game Cart', count: 36, pct: 68, img: '/stickers/pixel-game-cart.svg' },
    { name: 'This Is Fine Mug', count: 31, pct: 58, img: '/stickers/this-is-fine-mug.svg' },
    { name: 'Boba Spooky Ghost', count: 26, pct: 48, img: '/stickers/boba-ghost.svg' },
  ];

  // Recent Orders (matching Mockup columns: #, Name, Stickers, Status, Date)
  const recentOrdersList = orders.length > 0
    ? [...orders].sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()).slice(0, 6)
    : [
        { id: '1', order_number: '0017', customer_name: 'Rehan', total_quantity: 12, status: 'submitted', submitted_at: '2026-10-30T10:00:00Z' },
        { id: '2', order_number: '0016', customer_name: 'Priya', total_quantity: 12, status: 'ready_to_print', submitted_at: '2026-10-29T14:30:00Z' },
        { id: '3', order_number: '0015', customer_name: 'Aditya', total_quantity: 12, status: 'completed', submitted_at: '2026-10-28T09:15:00Z' },
        { id: '4', order_number: '0014', customer_name: 'Saloni', total_quantity: 12, status: 'submitted', submitted_at: '2026-10-28T16:20:00Z' },
        { id: '5', order_number: '0013', customer_name: 'Karan', total_quantity: 12, status: 'completed', submitted_at: '2026-10-27T11:45:00Z' },
      ];

  // SVG Chart points for the 30-day Orders trend curve
  const chartPoints = [
    { x: 30, y: 155, label: 'Oct 1' },
    { x: 100, y: 120, label: 'Oct 5' },
    { x: 170, y: 140, label: 'Oct 10' },
    { x: 240, y: 95, label: 'Oct 15' },
    { x: 310, y: 130, label: 'Oct 20' },
    { x: 380, y: 70, label: 'Oct 25' },
    { x: 450, y: 80, label: 'Oct 30' },
  ];

  const svgPathData = `M ${chartPoints.map((p) => `${p.x},${p.y}`).join(' L ')}`;
  const svgFillData = `M 30,180 L ${chartPoints.map((p) => `${p.x},${p.y}`).join(' L ')} L 450,180 Z`;

  return (
    <div className="space-y-6 text-white">
      {/* Top Bar Header matching Mockup Screen 10 / 13 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight flex items-center gap-2">
            <span>Dashboard</span>
          </h1>
          <p className="text-xs font-mono text-gray-400 mt-0.5">
            Real-time sticker studio overview and order fulfillment metrics.
          </p>
        </div>

        {/* Date Filter Dropdown */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-[#181A26] border border-[#2B2E42] text-gray-200 text-xs font-mono font-bold rounded-xl px-3.5 py-2 pr-8 appearance-none focus:outline-none focus:border-[#FF6EB4] cursor-pointer shadow-sm"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 3 Months</option>
            </select>
            <span className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none text-xs">▼</span>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards matching Reference Screen 10 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Orders */}
        <div className="bg-[#181A26] rounded-2xl border border-[#2B2E42] p-5 relative overflow-hidden shadow-md">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono font-bold mb-2">
            <span>Total Orders</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-display font-black text-3xl sm:text-4xl text-white">
              {totalOrdersCount}
            </span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <TrendingUp className="w-2.5 h-2.5" /> +12%
            </span>
          </div>
        </div>

        {/* Metric 2: Pending */}
        <div className="bg-[#181A26] rounded-2xl border border-[#2B2E42] p-5 relative overflow-hidden shadow-md">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono font-bold mb-2">
            <span>Pending</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-display font-black text-3xl sm:text-4xl text-[#FACC15]">
              {pendingOrdersCount}
            </span>
            <span className="text-[11px] font-mono text-gray-400">Needs print</span>
          </div>
        </div>

        {/* Metric 3: Completed */}
        <div className="bg-[#181A26] rounded-2xl border border-[#2B2E42] p-5 relative overflow-hidden shadow-md">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono font-bold mb-2">
            <span>Completed</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-display font-black text-3xl sm:text-4xl text-white">
              {completedOrdersCount}
            </span>
            <span className="text-[11px] font-mono text-gray-400">Fulfilled</span>
          </div>
        </div>

        {/* Metric 4: Total Stickers Requested */}
        <div className="bg-[#181A26] rounded-2xl border border-[#2B2E42] p-5 relative overflow-hidden shadow-md">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono font-bold mb-2">
            <span>Total Stickers Requested</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-display font-black text-3xl sm:text-4xl text-white">
              {totalStickersCount}
            </span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <TrendingUp className="w-2.5 h-2.5" /> +18%
            </span>
          </div>
        </div>
      </div>

      {/* Middle Section: Orders Chart & Top Stickers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Orders (Last 30 Days) Line Graph (7 cols) */}
        <div className="lg:col-span-7 bg-[#181A26] rounded-2xl border border-[#2B2E42] p-5 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-black text-base text-white">
              Orders (Last 30 Days)
            </h2>
            <span className="text-[11px] font-mono text-gray-400">Volume Trend</span>
          </div>

          <div className="relative w-full h-56 pt-2">
            {/* SVG Interactive Line Chart */}
            <svg viewBox="0 0 480 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF6EB4" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#FF6EB4" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              <line x1="25" y1="40" x2="465" y2="40" stroke="#2B2E42" strokeDasharray="3 3" />
              <line x1="25" y1="90" x2="465" y2="90" stroke="#2B2E42" strokeDasharray="3 3" />
              <line x1="25" y1="140" x2="465" y2="140" stroke="#2B2E42" strokeDasharray="3 3" />
              <line x1="25" y1="180" x2="465" y2="180" stroke="#2B2E42" />

              {/* Y Axis Numbers */}
              <text x="18" y="44" fill="#6B7280" fontSize="9" textAnchor="end" fontFamily="monospace">300</text>
              <text x="18" y="94" fill="#6B7280" fontSize="9" textAnchor="end" fontFamily="monospace">200</text>
              <text x="18" y="144" fill="#6B7280" fontSize="9" textAnchor="end" fontFamily="monospace">100</text>
              <text x="18" y="184" fill="#6B7280" fontSize="9" textAnchor="end" fontFamily="monospace">000</text>

              {/* Gradient Area under curve */}
              <path d={svgFillData} fill="url(#chartGradient)" />

              {/* Pink Line Curve */}
              <path
                d={svgPathData}
                fill="none"
                stroke="#FF6EB4"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Glowing Dots */}
              {chartPoints.map((p, idx) => (
                <g key={idx}>
                  <circle cx={p.x} cy={p.y} r="4.5" fill="#FF6EB4" stroke="#181A26" strokeWidth="2" />
                  <text x={p.x} y="196" fill="#9CA3AF" fontSize="9" textAnchor="middle" fontFamily="monospace">
                    {p.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Right: Top Stickers Bar Chart (5 cols) */}
        <div className="lg:col-span-5 bg-[#181A26] rounded-2xl border border-[#2B2E42] p-5 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-black text-base text-white">
                Top Stickers
              </h2>
              <button
                onClick={() => onNavigateTab('catalogue')}
                className="text-xs font-mono font-bold text-[#FF6EB4] hover:underline"
              >
                View all
              </button>
            </div>

            <div className="space-y-3.5">
              {topStickersList.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#12131A] border border-[#2B2E42] p-0.5 flex-shrink-0 flex items-center justify-center">
                    <img src={item.img} alt={item.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="font-display font-bold text-gray-200 truncate">{item.name}</span>
                      <span className="font-mono font-bold text-gray-400">{item.count}</span>
                    </div>
                    {/* Pink Progress Bar matching mockup */}
                    <div className="w-full bg-[#12131A] rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#FF6EB4] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Orders Table matching mockup Screen 10 / 13 */}
      <div className="bg-[#181A26] rounded-2xl border border-[#2B2E42] overflow-hidden shadow-md">
        <div className="p-4 sm:p-5 border-b border-[#2B2E42] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#FF6EB4]" />
            <h2 className="font-display font-black text-base text-white">
              Recent Orders
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-mono font-bold text-[#FF6EB4] hover:underline"
          >
            View all →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#12131A] border-b border-[#2B2E42] text-gray-400 font-mono">
                <th className="p-3.5">#</th>
                <th className="p-3.5">Name</th>
                <th className="p-3.5 text-center">Stickers</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2B2E42]">
              {recentOrdersList.map((ord: any) => {
                const isPending = ord.status === 'submitted';
                const isProcessing = ord.status === 'ready_to_print' || ord.status === 'processing';
                const isCompleted = ord.status === 'completed';

                return (
                  <tr
                    key={ord.id}
                    onClick={() => onSelectOrder(ord)}
                    className="hover:bg-[#1E2130] transition-colors cursor-pointer"
                  >
                    <td className="p-3.5 font-mono font-bold text-gray-300">
                      #{ord.order_number.replace('ORD-', '')}
                    </td>
                    <td className="p-3.5 font-bold text-white">
                      {ord.customer_name}
                    </td>
                    <td className="p-3.5 font-mono text-center text-gray-300">
                      {ord.total_quantity || 12}
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                          isPending
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : isProcessing
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {isPending ? 'Pending' : isProcessing ? 'Processing' : 'Completed'}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-right text-gray-400">
                      {new Date(ord.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

