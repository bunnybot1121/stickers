import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Printer,
  Layers,
  Tags,
  Box,
  Settings,
  ExternalLink,
  LogOut,
  Shield,
  Menu,
  X,
} from 'lucide-react';
import { Order, Sticker, Category, PackRule, PrintBatch } from '../../types';
import { AdminDashboard } from './AdminDashboard';
import { AdminOrders } from './AdminOrders';
import { AdminPrintStudio } from './AdminPrintStudio';
import { AdminCatalogue } from './AdminCatalogue';
import { AdminCategories } from './AdminCategories';
import { AdminInventory } from './AdminInventory';
import { AdminSettings } from './AdminSettings';

interface AdminLayoutProps {
  adminEmail: string;
  orders: Order[];
  stickers: Sticker[];
  categories: Category[];
  packRule: PackRule;
  batches: PrintBatch[];
  onSignOut: () => void;
  onReturnToStore: () => void;
  onRefreshData: () => void;
  onRuleUpdated: (rule: PackRule) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  adminEmail,
  orders,
  stickers,
  categories,
  packRule,
  batches,
  onSignOut,
  onReturnToStore,
  onRefreshData,
  onRuleUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inspectingOrder, setInspectingOrder] = useState<Order | null>(null);

  const readyToPrintCount = orders.filter((o) => o.status === 'ready_to_print' || o.status === 'submitted').length;

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: orders.length },
    { id: 'print-studio', label: 'Print Studio', icon: Printer, badge: readyToPrintCount, badgeColor: 'bg-brand-pink text-white' },
    { id: 'catalogue', label: 'Catalogue', icon: Layers, badge: stickers.length },
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'inventory', label: 'Inventory', icon: Box },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelectOrderFromDashboard = (order: Order) => {
    setInspectingOrder(order);
    setActiveTab('orders');
  };

  return (
    <div className="min-h-screen bg-brand-cream/80 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="w-full md:w-64 bg-white border-b-3 md:border-b-0 md:border-r-3 border-brand-dark flex flex-col justify-between p-4 flex-shrink-0">
        <div>
          {/* Logo / Admin Badge */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-brand-dark/10">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-brand-yellow border-2 border-brand-dark shadow-neo-sm flex items-center justify-center font-display font-black">
                ⚡
              </div>
              <div>
                <span className="font-display font-black text-lg text-brand-dark leading-tight block">
                  STUDIO OPS
                </span>
                <span className="font-mono text-[10px] text-gray-500 uppercase tracking-wider block">
                  Admin Portal
                </span>
              </div>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg border border-brand-dark"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Nav List */}
          <nav className={`space-y-1.5 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-display font-bold text-xs transition-all ${
                    isActive
                      ? 'bg-brand-dark text-white shadow-neo-sm'
                      : 'text-brand-dark hover:bg-yellow-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full border ${
                        item.badgeColor || (isActive ? 'bg-white/20 text-white border-transparent' : 'bg-gray-100 text-gray-700 border-gray-300')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className={`pt-4 border-t-2 border-brand-dark/10 space-y-2 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
          <div className="p-2 rounded-xl bg-gray-50 border border-gray-200 text-[11px] font-mono text-gray-600 truncate">
            User: <strong>{adminEmail}</strong>
          </div>

          <button
            onClick={onReturnToStore}
            className="w-full btn-neo-white text-xs py-2 flex items-center justify-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </button>

          <button
            onClick={onSignOut}
            className="w-full py-1.5 text-xs font-mono font-bold text-red-600 hover:text-red-800 flex items-center justify-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl">
        {activeTab === 'dashboard' && (
          <AdminDashboard
            orders={orders}
            stickers={stickers}
            onNavigateTab={setActiveTab}
            onSelectOrder={handleSelectOrderFromDashboard}
          />
        )}

        {activeTab === 'orders' && (
          <AdminOrders
            orders={orders}
            onOrderUpdated={onRefreshData}
            selectedOrderForModal={inspectingOrder}
            onClearSelectedOrder={() => setInspectingOrder(null)}
          />
        )}

        {activeTab === 'print-studio' && (
          <AdminPrintStudio
            orders={orders}
            batches={batches}
            onBatchCreated={onRefreshData}
          />
        )}

        {activeTab === 'catalogue' && (
          <AdminCatalogue
            stickers={stickers}
            categories={categories}
            onStickerUpdated={onRefreshData}
          />
        )}

        {activeTab === 'categories' && (
          <AdminCategories
            categories={categories}
            onCategoryUpdated={onRefreshData}
          />
        )}

        {activeTab === 'inventory' && (
          <AdminInventory
            stickers={stickers}
            onInventoryAdjusted={onRefreshData}
          />
        )}

        {activeTab === 'settings' && (
          <AdminSettings
            packRule={packRule}
            onRuleUpdated={onRuleUpdated}
          />
        )}
      </main>
    </div>
  );
};
