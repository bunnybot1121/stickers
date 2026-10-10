import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
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

  interface NavItem {
    id: string;
    label: string;
    icon: any;
    badge?: number;
    badgeColor?: string;
  }

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: orders.length },
    { id: 'catalogue', label: 'Catalogue & Bulk AI', icon: Layers, badge: stickers.length },
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'inventory', label: 'Inventory', icon: Box },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelectOrderFromDashboard = (order: Order) => {
    setInspectingOrder(order);
    setActiveTab('orders');
  };

  return (
    <div className="min-h-screen bg-[#12131A] text-white flex flex-col md:flex-row">
      {/* Sidebar for Desktop matching reference dark sidebar */}
      <aside className="w-full md:w-64 bg-[#181A26] border-b md:border-b-0 md:border-r border-[#2B2E42] flex flex-col justify-between p-4 flex-shrink-0">
        <div>
          {/* Logo / Admin Badge matching STICKERZ */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#2B2E42]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FF6EB4] text-white flex items-center justify-center font-display font-black text-sm">
                ★
              </div>
              <div>
                <span className="font-display font-black text-base text-white leading-tight block tracking-tight">
                  STICKER<span className="text-[#FF6EB4]">Z</span>
                </span>
                <span className="font-mono text-[10px] text-gray-400 uppercase tracking-wider block">
                  Studio Operations
                </span>
              </div>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg border border-[#2B2E42] text-gray-300"
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
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-display font-bold text-xs transition-all ${
                    isActive
                      ? 'bg-[#FF6EB4] text-white shadow-md'
                      : 'text-gray-300 hover:bg-[#25283B] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full border ${
                        item.badgeColor ||
                        (isActive
                          ? 'bg-white/20 text-white border-transparent'
                          : 'bg-[#12131A] text-gray-400 border-[#2B2E42]')
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
        <div className={`pt-4 border-t border-[#2B2E42] space-y-2 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
          <div className="p-2.5 rounded-xl bg-[#12131A] border border-[#2B2E42] text-[11px] font-mono text-gray-400 truncate">
            Admin: <strong className="text-gray-200">{adminEmail}</strong>
          </div>

          <button
            onClick={onReturnToStore}
            className="w-full py-2 px-3 rounded-xl border border-[#2B2E42] bg-[#181A26] hover:bg-[#25283B] text-xs font-mono font-bold text-gray-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#FF6EB4]" />
            <span>Storefront</span>
          </button>

          <button
            onClick={onSignOut}
            className="w-full py-1.5 text-xs font-mono font-bold text-red-400 hover:text-red-300 flex items-center justify-center gap-1"
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
