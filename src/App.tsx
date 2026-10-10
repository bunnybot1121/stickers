import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { OfferExplainer } from './components/OfferExplainer';
import { Catalogue } from './components/Catalogue';
import { PackTray } from './components/PackTray';
import { PackBuilderModal } from './components/PackBuilderModal';
import { OrderModal } from './components/OrderModal';
import { OrderConfirmation } from './components/OrderConfirmation';
import { BonusCelebrationModal } from './components/BonusCelebrationModal';
import { AiVibeModal } from './components/AiVibeModal';
import { Footer } from './components/Footer';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { storeService } from './services/storeService';
import {
  Sticker,
  Category,
  PackRule,
  Order,
  PrintBatch,
  PackSelectionState,
} from './types';
import { isBonusUnlocked, DEFAULT_PACK_RULE } from './lib/packRules';

export function App() {
  // App views: 'store' | 'admin-login' | 'admin'
  const [currentView, setCurrentView] = useState<'store' | 'admin-login' | 'admin'>('store');
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState('home');

  // Data state
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [packRule, setPackRule] = useState<PackRule>(DEFAULT_PACK_RULE);
  const [orders, setOrders] = useState<Order[]>([]);
  const [batches, setBatches] = useState<PrintBatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Customer pack builder state
  const [selection, setSelection] = useState<PackSelectionState>({
    baseStickerIds: [],
    bonusStickerIds: [],
  });
  const [isPackBuilderOpen, setIsPackBuilderOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [isAiVibeOpen, setIsAiVibeOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<{ orderNumber: string; orderId: string } | null>(null);

  // Load initial data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [stList, catList, rule, ordList, batchList] = await Promise.all([
        storeService.getStickers({ status: 'all' }),
        storeService.getCategories(),
        storeService.getActivePackRule(),
        storeService.getOrders(),
        storeService.getPrintBatches(),
      ]);

      setStickers(stList);
      setCategories(catList);
      setPackRule(rule);
      setOrders(ordList);
      setBatches(batchList);
    } catch (err) {
      console.error('Failed to load store data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Fast map lookup for stickers by ID
  const stickersMap = useMemo(() => {
    const map = new Map<string, Sticker>();
    stickers.forEach((s) => map.set(s.id, s));
    return map;
  }, [stickers]);

  // Pack counters & statuses
  const bonusUnlocked = isBonusUnlocked(selection.baseStickerIds, packRule);
  const isBaseFull = selection.baseStickerIds.length >= packRule.base_quantity;
  const isBonusFull = selection.bonusStickerIds.length >= packRule.bonus_quantity;

  // Trigger celebration modal when base reaches required 10 stickers
  useEffect(() => {
    if (selection.baseStickerIds.length >= packRule.base_quantity && !hasCelebrated) {
      setIsCelebrationOpen(true);
      setHasCelebrated(true);
    } else if (selection.baseStickerIds.length < packRule.base_quantity && hasCelebrated) {
      setHasCelebrated(false);
    }
  }, [selection.baseStickerIds.length, packRule.base_quantity, hasCelebrated]);

  // Selection handlers
  const handleSelectBase = (sticker: Sticker) => {
    if (isBaseFull) return;
    if (selection.baseStickerIds.includes(sticker.id) || selection.bonusStickerIds.includes(sticker.id)) return;

    setSelection((prev) => ({
      ...prev,
      baseStickerIds: [...prev.baseStickerIds, sticker.id],
    }));
  };

  const handleSelectBonus = (sticker: Sticker) => {
    if (!bonusUnlocked || isBonusFull) return;
    if (selection.baseStickerIds.includes(sticker.id) || selection.bonusStickerIds.includes(sticker.id)) return;

    setSelection((prev) => ({
      ...prev,
      bonusStickerIds: [...prev.bonusStickerIds, sticker.id],
    }));
  };

  const handleRemove = (stickerId: string) => {
    setSelection((prev) => ({
      baseStickerIds: prev.baseStickerIds.filter((id) => id !== stickerId),
      bonusStickerIds: prev.bonusStickerIds.filter((id) => id !== stickerId),
    }));
  };

  // AI Vibe auto-populate handler
  const handleApplyVibePack = (suggestedStickers: Sticker[]) => {
    const baseIds = suggestedStickers.slice(0, packRule.base_quantity).map((s) => s.id);
    const bonusIds = suggestedStickers
      .slice(packRule.base_quantity, packRule.base_quantity + packRule.bonus_quantity)
      .map((s) => s.id);

    setSelection({
      baseStickerIds: baseIds,
      bonusStickerIds: bonusIds,
    });
    setIsAiVibeOpen(false);
    setIsPackBuilderOpen(true);
  };

  // Order submission success
  const handleOrderSuccess = (orderNumber: string, orderId: string) => {
    setIsOrderModalOpen(false);
    setIsPackBuilderOpen(false);
    setConfirmedOrder({ orderNumber, orderId });
    loadData(); // refresh orders in background
  };

  const handleResetForNewPack = () => {
    setSelection({ baseStickerIds: [], bonusStickerIds: [] });
    setConfirmedOrder(null);
    setHasCelebrated(false);
  };

  const scrollToCatalogue = () => {
    setIsPackBuilderOpen(false);
    const el = document.getElementById('catalogue-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // View: Admin Login
  if (currentView === 'admin-login') {
    return (
      <AdminLogin
        onLoginSuccess={(email) => {
          setAdminEmail(email);
          setCurrentView('admin');
        }}
        onBackToStore={() => setCurrentView('store')}
      />
    );
  }

  // View: Authenticated Admin Studio
  if (currentView === 'admin' && adminEmail) {
    return (
      <AdminLayout
        adminEmail={adminEmail}
        orders={orders}
        stickers={stickers}
        categories={categories}
        packRule={packRule}
        batches={batches}
        onSignOut={() => {
          setAdminEmail(null);
          setCurrentView('store');
        }}
        onReturnToStore={() => setCurrentView('store')}
        onRefreshData={loadData}
        onRuleUpdated={setPackRule}
      />
    );
  }

  // View: Customer Storefront
  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-brand-pink selection:text-white bg-[#FAF7F2]">
      <div>
        <Navbar
          selection={selection}
          rule={packRule}
          onOpenPackBuilder={() => setIsPackBuilderOpen(true)}
          onOpenAdmin={() => {
            if (adminEmail) setCurrentView('admin');
            else setCurrentView('admin-login');
          }}
          onNavigateHome={() => setConfirmedOrder(null)}
          onOpenAiVibe={() => setIsAiVibeOpen(true)}
          activeNav={activeNav}
          setActiveNav={setActiveNav}
        />

        <main>
          {confirmedOrder ? (
            /* Order Confirmation View matching Mockup Screen 09 */
            <OrderConfirmation
              orderNumber={confirmedOrder.orderNumber}
              orderId={confirmedOrder.orderId}
              selection={selection}
              stickersMap={stickersMap}
              onReset={handleResetForNewPack}
              onOpenAdmin={() => {
                if (adminEmail) setCurrentView('admin');
                else setCurrentView('admin-login');
              }}
            />
          ) : (
            /* Standard Storefront Flow */
            <>
              <Hero
                onExploreClick={scrollToCatalogue}
                onOpenPackBuilder={() => setIsPackBuilderOpen(true)}
                onOpenAiVibe={() => setIsAiVibeOpen(true)}
              />

              <OfferExplainer />

              <Catalogue
                stickers={stickers}
                categories={categories}
                selection={selection}
                isBaseFull={isBaseFull}
                isBonusFull={isBonusFull}
                bonusUnlocked={bonusUnlocked}
                onSelectBase={handleSelectBase}
                onSelectBonus={handleSelectBonus}
                onRemove={handleRemove}
              />

              {/* Floating Pack Tray */}
              <PackTray
                selection={selection}
                rule={packRule}
                stickersMap={stickersMap}
                onOpenPackBuilder={() => setIsPackBuilderOpen(true)}
                onProceedToOrder={() => setIsOrderModalOpen(true)}
              />

              {/* Full Pack Builder Modal */}
              <PackBuilderModal
                isOpen={isPackBuilderOpen}
                onClose={() => setIsPackBuilderOpen(false)}
                selection={selection}
                rule={packRule}
                stickersMap={stickersMap}
                onRemove={handleRemove}
                onProceedToOrder={() => {
                  setIsPackBuilderOpen(false);
                  setIsOrderModalOpen(true);
                }}
                onExploreMore={scrollToCatalogue}
              />

              {/* Order Submission Form Modal matching Mockup Screen 08 */}
              <OrderModal
                isOpen={isOrderModalOpen}
                onClose={() => setIsOrderModalOpen(false)}
                selection={selection}
                rule={packRule}
                stickersMap={stickersMap}
                onOrderSuccess={handleOrderSuccess}
                onEditPack={() => {
                  setIsOrderModalOpen(false);
                  setIsPackBuilderOpen(true);
                }}
              />

              {/* Bonus Unlock Celebration Modal matching Mockup Screen 07 / 10 */}
              <BonusCelebrationModal
                isOpen={isCelebrationOpen}
                onClose={() => setIsCelebrationOpen(false)}
                onChooseBonus={() => {
                  setIsCelebrationOpen(false);
                  setIsPackBuilderOpen(true);
                }}
              />

              {/* Customer AI Vibe Stylist Modal Powered by Groq */}
              <AiVibeModal
                isOpen={isAiVibeOpen}
                onClose={() => setIsAiVibeOpen(false)}
                stickers={stickers}
                onApplyPack={(baseIds, bonusIds) => {
                  setSelection({
                    baseStickerIds: baseIds,
                    bonusStickerIds: bonusIds,
                  });
                  setIsAiVibeOpen(false);
                  setIsPackBuilderOpen(true);
                }}
              />
            </>
          )}
        </main>
      </div>

      <Footer
        onOpenAdmin={() => {
          if (adminEmail) setCurrentView('admin');
          else setCurrentView('admin-login');
        }}
        onNavigateHome={() => setConfirmedOrder(null)}
      />
    </div>
  );
}

export default App;

