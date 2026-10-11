import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Category,
  Sticker,
  PackRule,
  Order,
  OrderStatus,
  PrintBatch,
  OrderSubmissionPayload,
  InventoryMovement,
} from '../types';
import {
  SEED_CATEGORIES,
  SEED_STICKERS,
  SEED_PACK_RULE,
  SEED_ORDERS,
} from '../data/seedData';
import { validatePack, DEFAULT_PACK_RULE } from '../lib/packRules';

// Local storage keys for persistent demo mode
const STORAGE_KEY_STICKERS = 'sticker_verse_stickers_v6';
const STORAGE_KEY_CATEGORIES = 'sticker_verse_categories_v6';
const STORAGE_KEY_PACK_RULE = 'sticker_verse_pack_rule';
const STORAGE_KEY_ORDERS = 'sticker_verse_orders';
const STORAGE_KEY_BATCHES = 'sticker_verse_batches';
const STORAGE_KEY_ALLOCATIONS = 'sticker_verse_allocations';
const STORAGE_KEY_MOVEMENTS = 'sticker_verse_movements';

class StoreService {
  public isConnectedToSupabase: boolean = isSupabaseConfigured;

  // Local state cache / fallback
  private stickers: Sticker[] = [];
  private categories: Category[] = [];
  private packRule: PackRule = SEED_PACK_RULE;
  private orders: Order[] = [];
  private printBatches: PrintBatch[] = [];
  private allocations: Map<string, number> = new Map(); // order_item_id -> allocated_quantity
  private movements: InventoryMovement[] = [];

  constructor() {
    this.initLocalData();
  }

  private initLocalData() {
    try {
      const storedStickers = localStorage.getItem(STORAGE_KEY_STICKERS);
      this.stickers = storedStickers ? JSON.parse(storedStickers) : [...SEED_STICKERS];

      const storedCategories = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      this.categories = storedCategories ? JSON.parse(storedCategories) : [...SEED_CATEGORIES];

      const storedRule = localStorage.getItem(STORAGE_KEY_PACK_RULE);
      this.packRule = storedRule ? JSON.parse(storedRule) : { ...SEED_PACK_RULE };

      const storedOrders = localStorage.getItem(STORAGE_KEY_ORDERS);
      this.orders = storedOrders ? JSON.parse(storedOrders) : [...SEED_ORDERS];

      const storedBatches = localStorage.getItem(STORAGE_KEY_BATCHES);
      this.printBatches = storedBatches ? JSON.parse(storedBatches) : [];

      const storedAlloc = localStorage.getItem(STORAGE_KEY_ALLOCATIONS);
      if (storedAlloc) {
        this.allocations = new Map(JSON.parse(storedAlloc));
      }

      const storedMovements = localStorage.getItem(STORAGE_KEY_MOVEMENTS);
      this.movements = storedMovements ? JSON.parse(storedMovements) : [];
    } catch {
      this.stickers = [...SEED_STICKERS];
      this.categories = [...SEED_CATEGORIES];
      this.packRule = { ...SEED_PACK_RULE };
      this.orders = [...SEED_ORDERS];
      this.printBatches = [];
      this.allocations = new Map();
      this.movements = [];
    }
  }

  private persistLocal(key: string, data: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      // Storage full or unavailable
    }
  }

  // --------------------------------------------------------------------------
  // Categories
  // --------------------------------------------------------------------------
  async getCategories(): Promise<Category[]> {
    if (this.isConnectedToSupabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch {
        // Fall back to local
      }
    }
    return this.categories.filter((c) => c.is_active).sort((a, b) => a.sort_order - b.sort_order);
  }

  async getAllCategories(): Promise<Category[]> {
    if (this.isConnectedToSupabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('sort_order', { ascending: true });
        if (!error && data) return data;
      } catch {
        // Fall back
      }
    }
    return [...this.categories].sort((a, b) => a.sort_order - b.sort_order);
  }

  async saveCategory(cat: Partial<Category>): Promise<Category> {
    if (this.isConnectedToSupabase) {
      try {
        const { data, error } = await supabase.from('categories').upsert(cat).select().single();
        if (!error && data) return data;
      } catch {
        // Fall back
      }
    }

    if (cat.id) {
      const idx = this.categories.findIndex((c) => c.id === cat.id);
      if (idx >= 0) {
        this.categories[idx] = { ...this.categories[idx], ...cat, updated_at: new Date().toISOString() };
        this.persistLocal(STORAGE_KEY_CATEGORIES, this.categories);
        return this.categories[idx];
      }
    }

    const newCat: Category = {
      id: cat.id || `c-${Date.now()}`,
      name: cat.name || 'New Category',
      slug: cat.slug || `cat-${Date.now()}`,
      description: cat.description || '',
      icon_name: cat.icon_name || 'Sparkles',
      sort_order: cat.sort_order ?? this.categories.length + 1,
      is_active: cat.is_active ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.categories.push(newCat);
    this.persistLocal(STORAGE_KEY_CATEGORIES, this.categories);
    return newCat;
  }

  // --------------------------------------------------------------------------
  // Stickers
  // --------------------------------------------------------------------------
  async getStickers(filters?: {
    categorySlug?: string;
    searchQuery?: string;
    style?: string;
    status?: 'active' | 'archived' | 'all';
    sortBy?: 'featured' | 'newest' | 'name-asc';
  }): Promise<Sticker[]> {
    let result = [...this.stickers];

    if (this.isConnectedToSupabase) {
      try {
        let query = supabase.from('stickers').select('*, sticker_categories(category:categories(*))');
        if (filters?.status !== 'all') {
          query = query.eq('status', filters?.status || 'active');
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          result = data.map((d: any) => ({
            ...d,
            categories: d.sticker_categories?.map((sc: any) => sc.category).filter(Boolean) || [],
          }));
        }
      } catch {
        // fallback to local
      }
    }

    // Filter by status
    if (filters?.status !== 'all') {
      const targetStatus = filters?.status || 'active';
      result = result.filter((s) => s.status === targetStatus);
    }

    // Filter by category
    if (filters?.categorySlug && filters.categorySlug !== 'all') {
      result = result.filter((s) =>
        s.categories?.some((c) => c.slug === filters.categorySlug)
      );
    }

    // Filter by style
    if (filters?.style && filters.style !== 'all') {
      result = result.filter((s) => s.style === filters.style);
    }

    // Filter by search query (name, description, style, tags)
    if (filters?.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.style.toLowerCase().includes(q) ||
          s.categories?.some((c) => c.name.toLowerCase().includes(q))
      );
    }

    // Sort order
    if (filters?.sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters?.sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      // featured first
      result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }

    return result;
  }

  async getStickerBySlug(slug: string): Promise<Sticker | null> {
    const list = await this.getStickers({ status: 'all' });
    return list.find((s) => s.slug === slug) || null;
  }

  async saveSticker(sticker: Partial<Sticker>, categoryIds: string[] = []): Promise<Sticker> {
    if (this.isConnectedToSupabase) {
      try {
        const { data, error } = await supabase.from('stickers').upsert(sticker).select().single();
        if (!error && data) {
          // Update categories
          if (categoryIds.length > 0) {
            await supabase.from('sticker_categories').delete().eq('sticker_id', data.id);
            await supabase.from('sticker_categories').insert(
              categoryIds.map((cid) => ({ sticker_id: data.id, category_id: cid }))
            );
          }
          return data;
        }
      } catch {
        // Fall back
      }
    }

    const assignedCats = this.categories.filter((c) => categoryIds.includes(c.id));

    if (sticker.id) {
      const idx = this.stickers.findIndex((s) => s.id === sticker.id);
      if (idx >= 0) {
        this.stickers[idx] = {
          ...this.stickers[idx],
          ...sticker,
          categories: assignedCats.length > 0 ? assignedCats : this.stickers[idx].categories,
          updated_at: new Date().toISOString(),
        };
        this.persistLocal(STORAGE_KEY_STICKERS, this.stickers);
        return this.stickers[idx];
      }
    }

    const newSticker: Sticker = {
      id: sticker.id || `s-${Date.now()}`,
      name: sticker.name || 'Untitled Sticker',
      slug: sticker.slug || `sticker-${Date.now()}`,
      description: sticker.description || '',
      image_path: sticker.image_path || '/stickers/what-the-duck.jpg',
      status: sticker.status || 'active',
      style: sticker.style || 'Kawaii',
      is_featured: sticker.is_featured || false,
      track_inventory: sticker.track_inventory ?? true,
      stock_on_hand: sticker.stock_on_hand ?? 50,
      low_stock_threshold: sticker.low_stock_threshold ?? 10,
      price: sticker.price ?? 3.5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      categories: assignedCats,
    };
    this.stickers.push(newSticker);
    this.persistLocal(STORAGE_KEY_STICKERS, this.stickers);
    return newSticker;
  }

  async archiveSticker(stickerId: string): Promise<boolean> {
    const s = this.stickers.find((item) => item.id === stickerId);
    if (!s) return false;
    s.status = 'archived';
    s.updated_at = new Date().toISOString();
    this.persistLocal(STORAGE_KEY_STICKERS, this.stickers);

    if (this.isConnectedToSupabase) {
      try {
        await supabase.from('stickers').update({ status: 'archived' }).eq('id', stickerId);
      } catch {
        // fallback
      }
    }
    return true;
  }

  async deleteSticker(stickerId: string): Promise<boolean> {
    this.stickers = this.stickers.filter((item) => item.id !== stickerId);
    this.persistLocal(STORAGE_KEY_STICKERS, this.stickers);

    if (this.isConnectedToSupabase) {
      try {
        await supabase.from('sticker_categories').delete().eq('sticker_id', stickerId);
        await supabase.from('stickers').delete().eq('id', stickerId);
      } catch {
        // fallback
      }
    }
    return true;
  }

  // --------------------------------------------------------------------------
  // Pack Rules
  // --------------------------------------------------------------------------
  async getActivePackRule(): Promise<PackRule> {
    if (this.isConnectedToSupabase) {
      try {
        const { data, error } = await supabase
          .from('pack_rules')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        if (!error && data) return data;
      } catch {
        // Fall back
      }
    }
    return this.packRule;
  }

  async savePackRule(rule: Partial<PackRule>): Promise<PackRule> {
    this.packRule = { ...this.packRule, ...rule, updated_at: new Date().toISOString() };
    this.persistLocal(STORAGE_KEY_PACK_RULE, this.packRule);

    if (this.isConnectedToSupabase) {
      try {
        await supabase.from('pack_rules').upsert(this.packRule);
      } catch {
        // fallback
      }
    }
    return this.packRule;
  }

  // --------------------------------------------------------------------------
  // Orders & Submission (Transactional)
  // --------------------------------------------------------------------------
  async submitOrder(payload: OrderSubmissionPayload): Promise<{
    success: boolean;
    orderNumber: string;
    orderId: string;
    totalQuantity: number;
    isIdempotentReplay?: boolean;
    error?: string;
  }> {
    // 1. If Supabase is connected, invoke trusted RPC function
    if (this.isConnectedToSupabase) {
      try {
        const { data, error } = await supabase.rpc('create_pack_order', {
          p_customer_name: payload.customerName,
          p_customer_contact: payload.customerContact,
          p_customer_email: payload.customerEmail || null,
          p_customer_note: payload.customerNote || null,
          p_base_sticker_ids: payload.baseStickerIds,
          p_bonus_sticker_ids: payload.bonusStickerIds,
          p_idempotency_key: payload.idempotencyKey || null,
        });

        if (error) {
          throw new Error(error.message);
        }

        if (data && data.success) {
          return {
            success: true,
            orderNumber: data.order_number,
            orderId: data.order_id,
            totalQuantity: data.total_quantity,
            isIdempotentReplay: data.is_idempotent_replay,
          };
        }
      } catch (err: any) {
        console.warn('Supabase order submission error, checking local fallback:', err);
        // Continue to fallback if connection failed
      }
    }

    // 2. Local Transactional Handler (Local / Demo mode)
    // Check Idempotency Key
    if (payload.idempotencyKey) {
      const existing = this.orders.find((o) => o.idempotency_key === payload.idempotencyKey);
      if (existing) {
        return {
          success: true,
          orderNumber: existing.order_number,
          orderId: existing.id,
          totalQuantity: existing.total_quantity,
          isIdempotentReplay: true,
        };
      }
    }

    // Build sticker map for validation
    const map = new Map<string, Sticker>();
    this.stickers.forEach((s) => map.set(s.id, s));

    const validation = validatePack(
      { baseStickerIds: payload.baseStickerIds, bonusStickerIds: payload.bonusStickerIds },
      this.packRule,
      map
    );

    if (!validation.isValid) {
      throw new Error(validation.errors.join(' '));
    }

    // Generate human-readable order number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `ORD-${dateStr}-${randCode}`;
    const orderId = `ord-${Date.now()}`;

    const items = [
      ...payload.baseStickerIds.map((id, idx) => {
        const s = map.get(id)!;
        return {
          id: `item-${orderId}-base-${idx}`,
          order_id: orderId,
          sticker_id: id,
          sticker_name_snapshot: s.name,
          image_path_snapshot: s.image_path,
          item_role: 'base' as const,
          quantity: 1,
          unit_price: s.price,
          created_at: new Date().toISOString(),
          sticker: s,
        };
      }),
      ...payload.bonusStickerIds.map((id, idx) => {
        const s = map.get(id)!;
        return {
          id: `item-${orderId}-bonus-${idx}`,
          order_id: orderId,
          sticker_id: id,
          sticker_name_snapshot: s.name,
          image_path_snapshot: s.image_path,
          item_role: 'bonus' as const,
          quantity: 1,
          unit_price: s.price,
          created_at: new Date().toISOString(),
          sticker: s,
        };
      }),
    ];

    const newOrder: Order = {
      id: orderId,
      order_number: orderNumber,
      customer_name: payload.customerName.trim(),
      customer_contact: payload.customerContact.trim(),
      customer_email: payload.customerEmail?.trim() || null,
      customer_note: payload.customerNote?.trim() || null,
      status: 'submitted',
      pack_rule_id: this.packRule.id,
      base_quantity: payload.baseStickerIds.length,
      bonus_quantity: payload.bonusStickerIds.length,
      total_quantity: payload.baseStickerIds.length + payload.bonusStickerIds.length,
      idempotency_key: payload.idempotencyKey || null,
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items,
    };

    // Decrement stock for inventory-tracked stickers
    const allSelectedIds = [...payload.baseStickerIds, ...payload.bonusStickerIds];
    allSelectedIds.forEach((id) => {
      const st = this.stickers.find((s) => s.id === id);
      if (st && st.track_inventory && st.stock_on_hand !== null) {
        st.stock_on_hand = Math.max(0, st.stock_on_hand - 1);
        this.movements.push({
          id: `mov-${Date.now()}-${id}`,
          sticker_id: id,
          order_id: orderId,
          movement_type: 'reserve',
          quantity_delta: -1,
          reason: `Reserved for ${orderNumber}`,
          created_at: new Date().toISOString(),
        });
      }
    });

    this.orders.unshift(newOrder);
    this.persistLocal(STORAGE_KEY_ORDERS, this.orders);
    this.persistLocal(STORAGE_KEY_STICKERS, this.stickers);
    this.persistLocal(STORAGE_KEY_MOVEMENTS, this.movements);

    return {
      success: true,
      orderNumber,
      orderId,
      totalQuantity: newOrder.total_quantity,
    };
  }

  async getOrders(): Promise<Order[]> {
    if (this.isConnectedToSupabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, items:order_items(*)')
          .order('submitted_at', { ascending: false });
        if (!error && data) return data;
      } catch {
        // Fall back
      }
    }
    return [...this.orders].sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
  }

  async getOrderById(id: string): Promise<Order | null> {
    const list = await this.getOrders();
    return list.find((o) => o.id === id || o.order_number === id) || null;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus, adminNote?: string): Promise<boolean> {
    if (this.isConnectedToSupabase) {
      try {
        const { error } = await supabase.rpc('transition_order_status', {
          p_order_id: orderId,
          p_new_status: status,
          p_note: adminNote || null,
        });
        if (!error) return true;
      } catch {
        // Fall back
      }
    }

    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return false;
    order.status = status;
    order.updated_at = new Date().toISOString();
    if (adminNote) {
      order.admin_notes = adminNote;
    }
    if (status === 'completed') {
      order.completed_at = new Date().toISOString();
    }
    this.persistLocal(STORAGE_KEY_ORDERS, this.orders);
    return true;
  }

  // --------------------------------------------------------------------------
  // Print Studio Batches & Allocations
  // --------------------------------------------------------------------------
  getAllocations(): Map<string, number> {
    return this.allocations;
  }

  async getPrintBatches(): Promise<PrintBatch[]> {
    if (this.isConnectedToSupabase) {
      try {
        const { data, error } = await supabase
          .from('print_batches')
          .select('*, items:print_batch_items(*)')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch {
        // Fall back
      }
    }
    return [...this.printBatches].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async createPrintBatch(orderIds: string[], notes?: string): Promise<PrintBatch> {
    if (this.isConnectedToSupabase) {
      try {
        const { data, error } = await supabase.rpc('create_print_batch_with_allocations', {
          p_order_ids: orderIds,
          p_notes: notes || null,
        });
        if (!error && data) {
          const batches = await this.getPrintBatches();
          return batches[0];
        }
      } catch {
        // Fall back
      }
    }

    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const seq = (this.printBatches.length + 1).toString().padStart(3, '0');
    const batchNumber = `PB-${todayStr}-${seq}`;
    const batchId = `pb-${Date.now()}`;

    const eligibleOrders = this.orders.filter((o) => orderIds.includes(o.id) && o.status !== 'cancelled');
    const aggregatedItemsMap = new Map<string, { stickerId: string; name: string; imagePath: string; qty: number }>();

    for (const order of eligibleOrders) {
      if (!order.items) continue;
      for (const item of order.items) {
        const alreadyAllocated = this.allocations.get(item.id) ?? 0;
        const unallocated = Math.max(0, item.quantity - alreadyAllocated);

        if (unallocated > 0) {
          // Record allocation
          this.allocations.set(item.id, alreadyAllocated + unallocated);

          if (!aggregatedItemsMap.has(item.sticker_id)) {
            aggregatedItemsMap.set(item.sticker_id, {
              stickerId: item.sticker_id,
              name: item.sticker_name_snapshot,
              imagePath: item.image_path_snapshot,
              qty: 0,
            });
          }
          const rec = aggregatedItemsMap.get(item.sticker_id)!;
          rec.qty += unallocated;
        }
      }
      // Update order status to ready_to_print if submitted or reviewed
      if (order.status === 'submitted' || order.status === 'reviewed') {
        order.status = 'ready_to_print';
      }
    }

    const batchItems = Array.from(aggregatedItemsMap.values()).map((val, idx) => ({
      id: `pbi-${batchId}-${idx}`,
      print_batch_id: batchId,
      sticker_id: val.stickerId,
      sticker_name: val.name,
      image_path: val.imagePath,
      quantity_required: val.qty,
      quantity_printed: 0,
      created_at: new Date().toISOString(),
    }));

    const newBatch: PrintBatch = {
      id: batchId,
      batch_number: batchNumber,
      status: 'prepared',
      notes: notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: batchItems,
    };

    this.printBatches.unshift(newBatch);
    this.persistLocal(STORAGE_KEY_BATCHES, this.printBatches);
    this.persistLocal(STORAGE_KEY_ALLOCATIONS, Array.from(this.allocations.entries()));
    this.persistLocal(STORAGE_KEY_ORDERS, this.orders);

    return newBatch;
  }

  async recordPrintedQuantity(batchId: string, stickerId: string, printedCount: number): Promise<boolean> {
    const batch = this.printBatches.find((b) => b.id === batchId);
    if (!batch || !batch.items) return false;
    const item = batch.items.find((i) => i.sticker_id === stickerId);
    if (!item) return false;
    item.quantity_printed = printedCount;
    batch.updated_at = new Date().toISOString();

    // If all items are printed, set batch status to printed
    const allDone = batch.items.every((i) => i.quantity_printed >= i.quantity_required);
    if (allDone) {
      batch.status = 'printed';
      batch.printed_at = new Date().toISOString();
    }
    this.persistLocal(STORAGE_KEY_BATCHES, this.printBatches);
    return true;
  }

  // --------------------------------------------------------------------------
  // Inventory Movements
  // --------------------------------------------------------------------------
  async getInventoryMovements(stickerId?: string): Promise<InventoryMovement[]> {
    if (stickerId) {
      return this.movements.filter((m) => m.sticker_id === stickerId);
    }
    return [...this.movements];
  }

  async adjustInventory(stickerId: string, delta: number, reason: string): Promise<boolean> {
    const sticker = this.stickers.find((s) => s.id === stickerId);
    if (!sticker) return false;
    sticker.stock_on_hand = Math.max(0, (sticker.stock_on_hand ?? 0) + delta);
    sticker.updated_at = new Date().toISOString();

    this.movements.push({
      id: `mov-${Date.now()}`,
      sticker_id: stickerId,
      movement_type: delta >= 0 ? 'restock' : 'adjustment',
      quantity_delta: delta,
      reason,
      created_at: new Date().toISOString(),
    });

    this.persistLocal(STORAGE_KEY_STICKERS, this.stickers);
    this.persistLocal(STORAGE_KEY_MOVEMENTS, this.movements);
    return true;
  }

  // Reset demo data to initial seeds
  resetDemoData() {
    this.stickers = [...SEED_STICKERS];
    this.categories = [...SEED_CATEGORIES];
    this.packRule = { ...SEED_PACK_RULE };
    this.orders = [...SEED_ORDERS];
    this.printBatches = [];
    this.allocations = new Map();
    this.movements = [];
    localStorage.removeItem(STORAGE_KEY_STICKERS);
    localStorage.removeItem(STORAGE_KEY_CATEGORIES);
    localStorage.removeItem(STORAGE_KEY_PACK_RULE);
    localStorage.removeItem(STORAGE_KEY_ORDERS);
    localStorage.removeItem(STORAGE_KEY_BATCHES);
    localStorage.removeItem(STORAGE_KEY_ALLOCATIONS);
    localStorage.removeItem(STORAGE_KEY_MOVEMENTS);
  }
}

export const storeService = new StoreService();
