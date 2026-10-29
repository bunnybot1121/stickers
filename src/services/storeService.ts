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
const STORAGE_KEY_STICKERS = 'sticker_verse_stickers_v8';
const STORAGE_KEY_CATEGORIES = 'sticker_verse_categories_v6';
const STORAGE_KEY_PACK_RULE = 'sticker_verse_pack_rule';
const STORAGE_KEY_ORDERS = 'sticker_verse_orders_v7';
const STORAGE_KEY_BATCHES = 'sticker_verse_batches';
const STORAGE_KEY_ALLOCATIONS = 'sticker_verse_allocations';
const STORAGE_KEY_MOVEMENTS = 'sticker_verse_movements';
const STORAGE_KEY_ADMIN_ALLOWLIST = 'sticker_verse_admin_allowlist';

export interface AdminUser {
  email: string;
  role: 'admin' | 'print_operator' | 'order_manager';
  added_at: string;
  notes?: string;
}

const DEFAULT_ADMIN_TEAM: AdminUser[] = [
  { email: 'sachin@gmail.com', role: 'admin' as const, added_at: '2026-10-14T00:00:00Z', notes: 'Studio Owner' },
  { email: 'sachinyadav402107@gmail.com', role: 'admin' as const, added_at: '2026-10-14T00:00:00Z', notes: 'Studio Owner' },
  { email: 'pragya@gmail.com', role: 'admin' as const, added_at: '2026-10-14T00:00:00Z', notes: 'Admin Team' },
  { email: 'pragya4541@gmail.com', role: 'admin' as const, added_at: '2026-10-14T00:00:00Z', notes: 'Admin Team' },
  { email: 'admin@stickerverse.craft', role: 'admin' as const, added_at: '2026-10-01T00:00:00Z', notes: 'Master Studio Admin' },
  { email: 'studio@stickerverse.craft', role: 'admin' as const, added_at: '2026-10-01T00:00:00Z', notes: 'Operations Lead' },
];

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
    this.checkSupabaseHealth();
  }

  private async checkSupabaseHealth() {
    if (!isSupabaseConfigured) {
      this.isConnectedToSupabase = false;
      return;
    }
    try {
      const { error } = await supabase.from('stickers').select('id').limit(1);
      if (
        error &&
        (error.code === 'PGRST205' ||
          error.message?.includes('schema cache') ||
          error.message?.includes('not found'))
      ) {
        console.warn('Supabase stickers table not detected. Operating in local storage mode.');
        this.isConnectedToSupabase = false;
      }
    } catch {
      this.isConnectedToSupabase = false;
    }
  }

  private initLocalData() {
    if (typeof localStorage === 'undefined') {
      this.stickers = [...SEED_STICKERS];
      this.categories = [...SEED_CATEGORIES];
      this.packRule = { ...SEED_PACK_RULE };
      this.orders = [...SEED_ORDERS];
      this.printBatches = [];
      this.allocations = new Map();
      this.movements = [];
      return;
    }

    try {
      localStorage.removeItem('sticker_verse_stickers_v6');
      localStorage.removeItem('sticker_verse_stickers_v7');
      localStorage.removeItem('sticker_verse_orders');
      const storedStickers = localStorage.getItem(STORAGE_KEY_STICKERS);
      const parsedStickers = storedStickers ? JSON.parse(storedStickers) : null;
      this.stickers =
        Array.isArray(parsedStickers) && parsedStickers.length > 0
          ? parsedStickers
          : [...SEED_STICKERS];

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
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.warn(`LocalStorage write warning for ${key}:`, err);
      try {
        localStorage.removeItem('sticker_verse_stickers_v6');
        localStorage.removeItem('sticker_verse_orders');
        localStorage.setItem(key, JSON.stringify(data));
      } catch (retryErr) {
        console.error(`Unable to persist ${key} to localStorage:`, retryErr);
      }
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
        } else if (
          error &&
          (error.code === 'PGRST205' ||
            error.message?.includes('schema cache') ||
            error.message?.includes('not found'))
        ) {
          this.isConnectedToSupabase = false;
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
    const assignedCats = this.categories.filter((c) => categoryIds.includes(c.id));
    const now = new Date().toISOString();

    const stickerId = sticker.id || `s-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const stickerName = sticker.name || 'Untitled Sticker';
    const stickerSlug =
      sticker.slug ||
      stickerName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') ||
      `sticker-${Date.now()}`;

    const completeSticker: Sticker = {
      id: stickerId,
      name: stickerName,
      slug: stickerSlug,
      description: sticker.description || '',
      image_path: sticker.image_path || '/stickers/what-the-duck.jpg',
      status: sticker.status || 'active',
      style: sticker.style || 'Kawaii',
      is_featured: sticker.is_featured ?? false,
      track_inventory: sticker.track_inventory ?? true,
      stock_on_hand: sticker.stock_on_hand ?? 50,
      low_stock_threshold: sticker.low_stock_threshold ?? 10,
      price: sticker.price ?? 3.5,
      created_at: sticker.created_at || now,
      updated_at: now,
      categories: assignedCats,
    };

    if (this.isConnectedToSupabase) {
      try {
        const payload: Record<string, any> = {
          name: completeSticker.name,
          slug: completeSticker.slug,
          description: completeSticker.description,
          image_path: completeSticker.image_path,
          style: completeSticker.style,
          status: completeSticker.status,
          is_featured: completeSticker.is_featured,
          track_inventory: completeSticker.track_inventory,
          stock_on_hand: completeSticker.stock_on_hand,
          low_stock_threshold: completeSticker.low_stock_threshold,
          price: completeSticker.price,
          updated_at: now,
        };

        const isUuid =
          sticker.id &&
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sticker.id);

        let savedData: any = null;
        if (isUuid) {
          payload.id = sticker.id;
          const { data, error } = await supabase
            .from('stickers')
            .update(payload)
            .eq('id', sticker.id)
            .select()
            .single();
          if (!error && data) savedData = data;
        } else {
          const { data, error } = await supabase.from('stickers').insert(payload).select().single();
          if (!error && data) savedData = data;
        }

        if (savedData) {
          completeSticker.id = savedData.id;
          if (categoryIds.length > 0) {
            await supabase.from('sticker_categories').delete().eq('sticker_id', savedData.id);
            await supabase.from('sticker_categories').insert(
              categoryIds.map((cid) => ({ sticker_id: savedData.id, category_id: cid }))
            );
          }
        }
      } catch (err) {
        console.warn('Supabase sticker sync failed, saving to local state:', err);
      }
    }

    // Always update in-memory cache and persist locally
    const existingIdx = this.stickers.findIndex(
      (s) => s.id === completeSticker.id || s.slug === completeSticker.slug
    );
    if (existingIdx >= 0) {
      this.stickers[existingIdx] = completeSticker;
    } else {
      this.stickers.unshift(completeSticker);
    }

    this.persistLocal(STORAGE_KEY_STICKERS, this.stickers);
    return completeSticker;
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

  async deleteAllStickers(): Promise<boolean> {
    this.stickers = [];
    this.persistLocal(STORAGE_KEY_STICKERS, []);

    if (this.isConnectedToSupabase) {
      try {
        await supabase.from('sticker_categories').delete().neq('sticker_id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('order_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('stickers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      } catch (err) {
        console.warn('Supabase deleteAllStickers error:', err);
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

  // --------------------------------------------------------------------------
  // Admin Team Allowlist Management
  // --------------------------------------------------------------------------
  getAdminTeam(): AdminUser[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ADMIN_ALLOWLIST);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const validUsers = parsed.filter(
            (u): u is AdminUser => typeof u === 'object' && u !== null && typeof u.email === 'string'
          );
          const existingEmails = new Set(validUsers.map((u) => u.email.toLowerCase()));
          const merged = [...validUsers];
          for (const def of DEFAULT_ADMIN_TEAM) {
            if (!existingEmails.has(def.email.toLowerCase())) {
              merged.push(def);
            }
          }
          return merged;
        }
      }
    } catch (parseErr) {
      console.warn('Admin allowlist local storage read failed:', parseErr);
    }
    return [...DEFAULT_ADMIN_TEAM];
  }

  addAdminUser(email: string, role: 'admin' | 'print_operator' | 'order_manager' = 'admin', notes?: string): AdminUser[] {
    const current = this.getAdminTeam();
    const normalized = email.trim().toLowerCase();
    if (!current.some((u) => u.email.toLowerCase() === normalized)) {
      const updated = [
        ...current,
        {
          email: normalized,
          role,
          added_at: new Date().toISOString(),
          notes: notes || 'Authorized Team Member',
        },
      ];
      this.persistLocal(STORAGE_KEY_ADMIN_ALLOWLIST, updated);
      return updated;
    }
    return current;
  }

  removeAdminUser(email: string): AdminUser[] {
    const current = this.getAdminTeam();
    const normalized = email.trim().toLowerCase();
    // Do not remove default root admin
    if (normalized === 'admin@stickerverse.craft') return current;
    const updated = current.filter((u) => u.email.toLowerCase() !== normalized);
    this.persistLocal(STORAGE_KEY_ADMIN_ALLOWLIST, updated);
    return updated;
  }

  isEmailAuthorizedAdmin(email: string): boolean {
    if (!email) return false;
    const normalized = email.trim().toLowerCase();
    const team = this.getAdminTeam();
    return team.some((u) => typeof u?.email === 'string' && u.email.toLowerCase() === normalized);
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
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_STICKERS);
      localStorage.removeItem('sticker_verse_stickers_v6');
      localStorage.removeItem('sticker_verse_stickers_v7');
      localStorage.removeItem(STORAGE_KEY_CATEGORIES);
      localStorage.removeItem(STORAGE_KEY_PACK_RULE);
      localStorage.removeItem(STORAGE_KEY_ORDERS);
      localStorage.removeItem('sticker_verse_orders');
      localStorage.removeItem(STORAGE_KEY_BATCHES);
      localStorage.removeItem(STORAGE_KEY_ALLOCATIONS);
      localStorage.removeItem(STORAGE_KEY_MOVEMENTS);
    }
  }
}

export const storeService = new StoreService();
