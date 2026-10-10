export type StickerStyle = 'Kawaii' | 'Neo-Brutal' | 'Pixel Art' | 'Holographic' | 'Retro' | 'Minimal' | 'Vintage';

export type StickerStatus = 'active' | 'draft' | 'archived';

export interface Sticker {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_path: string;
  thumbnail_path?: string;
  status: StickerStatus;
  style: StickerStyle;
  is_featured: boolean;
  track_inventory: boolean;
  stock_on_hand: number | null;
  low_stock_threshold: number | null;
  price: number;
  created_at: string;
  updated_at: string;
  categories?: Category[];
  tags?: Tag[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_path?: string;
  icon_name?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export type BonusMode = 'customer_choice' | 'automatic';

export interface PackRule {
  id: string;
  name: string;
  base_quantity: number; // default 10
  bonus_quantity: number; // default 2
  bonus_mode: BonusMode; // default 'customer_choice'
  allow_duplicate_stickers: boolean; // default false
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type OrderStatus =
  | 'submitted'
  | 'reviewed'
  | 'ready_to_print'
  | 'printing'
  | 'printed'
  | 'packed'
  | 'completed'
  | 'cancelled'
  | 'on_hold';

export interface OrderItem {
  id: string;
  order_id: string;
  sticker_id: string;
  sticker_name_snapshot: string;
  image_path_snapshot: string;
  item_role: 'base' | 'bonus';
  quantity: number;
  unit_price: number;
  created_at: string;
  sticker?: Sticker;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_contact: string;
  customer_email?: string | null;
  customer_note?: string | null;
  status: OrderStatus;
  pack_rule_id?: string;
  base_quantity: number;
  bonus_quantity: number;
  total_quantity: number;
  currency?: string;
  total_amount?: number;
  idempotency_key?: string | null;
  admin_notes?: string | null;
  submitted_at: string;
  updated_at: string;
  completed_at?: string | null;
  items?: OrderItem[];
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  old_status: string | null;
  new_status: string;
  changed_by?: string;
  note?: string | null;
  created_at: string;
}

export interface InventoryMovement {
  id: string;
  sticker_id: string;
  order_id?: string | null;
  movement_type: 'restock' | 'reserve' | 'release' | 'sale' | 'adjustment' | 'damage';
  quantity_delta: number;
  reason?: string;
  created_by?: string;
  created_at: string;
}

export type PrintBatchStatus = 'draft' | 'prepared' | 'printing' | 'printed' | 'cancelled';

export interface PrintBatch {
  id: string;
  batch_number: string;
  status: PrintBatchStatus;
  created_by?: string;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  printed_at?: string | null;
  items?: PrintBatchItem[];
}

export interface PrintBatchItem {
  id: string;
  print_batch_id: string;
  sticker_id: string;
  sticker_name?: string;
  image_path?: string;
  quantity_required: number;
  quantity_printed: number;
  created_at: string;
}

export interface PrintBatchOrderItem {
  print_batch_id: string;
  order_item_id: string;
  allocated_quantity: number;
  created_at: string;
}

export interface PackSelectionState {
  baseStickerIds: string[];
  bonusStickerIds: string[];
}

export interface OrderSubmissionPayload {
  customerName: string;
  customerContact: string;
  customerEmail?: string;
  customerNote?: string;
  baseStickerIds: string[];
  bonusStickerIds: string[];
  idempotencyKey?: string;
}
