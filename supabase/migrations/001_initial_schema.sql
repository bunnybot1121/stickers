-- ============================================================================
-- Migration: 001_initial_schema.sql
-- Description: Core schema for Sticker Shop Platform
-- ============================================================================

-- Ensure pgcrypto / uuid extension exists
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. Profiles Table (Authenticated Users & Admins)
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    display_name text,
    role text not null default 'customer' check (role in ('customer', 'admin', 'print_operator', 'order_manager')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 2. Categories Table
-- ----------------------------------------------------------------------------
create table if not exists public.categories (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null unique,
    description text,
    image_path text,
    icon_name text default 'Sparkles',
    sort_order integer not null default 0,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 3. Stickers Table
-- ----------------------------------------------------------------------------
create table if not exists public.stickers (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null unique,
    description text,
    image_path text not null,
    thumbnail_path text,
    status text not null default 'active' check (status in ('active', 'draft', 'archived')),
    style text default 'Kawaii' check (style in ('Kawaii', 'Neo-Brutal', 'Pixel Art', 'Holographic', 'Retro', 'Minimal', 'Vintage')),
    is_featured boolean not null default false,
    track_inventory boolean not null default false,
    stock_on_hand integer check (stock_on_hand is null or stock_on_hand >= 0),
    low_stock_threshold integer default 10 check (low_stock_threshold is null or low_stock_threshold >= 0),
    price numeric(10,2) default 0.00 check (price >= 0),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 4. Sticker Categories (Join table for flexible multi-category support)
-- ----------------------------------------------------------------------------
create table if not exists public.sticker_categories (
    sticker_id uuid not null references public.stickers(id) on delete cascade,
    category_id uuid not null references public.categories(id) on delete cascade,
    created_at timestamptz not null default now(),
    primary key (sticker_id, category_id)
);

-- ----------------------------------------------------------------------------
-- 5. Tags & Sticker Tags
-- ----------------------------------------------------------------------------
create table if not exists public.tags (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null unique,
    created_at timestamptz not null default now()
);

create table if not exists public.sticker_tags (
    sticker_id uuid not null references public.stickers(id) on delete cascade,
    tag_id uuid not null references public.tags(id) on delete cascade,
    created_at timestamptz not null default now(),
    primary key (sticker_id, tag_id)
);

-- ----------------------------------------------------------------------------
-- 6. Pack Rules Table
-- ----------------------------------------------------------------------------
create table if not exists public.pack_rules (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    base_quantity integer not null default 10 check (base_quantity > 0),
    bonus_quantity integer not null default 2 check (bonus_quantity >= 0),
    bonus_mode text not null default 'customer_choice' check (bonus_mode in ('customer_choice', 'automatic')),
    allow_duplicate_stickers boolean not null default false,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 7. Orders Table
-- ----------------------------------------------------------------------------
create table if not exists public.orders (
    id uuid primary key default gen_random_uuid(),
    order_number text not null unique,
    customer_name text not null,
    customer_contact text not null,
    customer_email text,
    customer_note text,
    status text not null default 'submitted' check (
        status in ('submitted', 'reviewed', 'ready_to_print', 'printing', 'printed', 'packed', 'completed', 'cancelled', 'on_hold')
    ),
    pack_rule_id uuid references public.pack_rules(id),
    base_quantity integer not null check (base_quantity > 0),
    bonus_quantity integer not null check (bonus_quantity >= 0),
    total_quantity integer not null check (total_quantity = base_quantity + bonus_quantity),
    currency text default 'USD',
    total_amount numeric(10,2) default 0.00 check (total_amount >= 0),
    idempotency_key text unique,
    admin_notes text,
    submitted_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    completed_at timestamptz
);

-- ----------------------------------------------------------------------------
-- 8. Order Items Table (with snapshotting)
-- ----------------------------------------------------------------------------
create table if not exists public.order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null references public.orders(id) on delete cascade,
    sticker_id uuid not null references public.stickers(id),
    sticker_name_snapshot text not null,
    image_path_snapshot text,
    item_role text not null check (item_role in ('base', 'bonus')),
    quantity integer not null default 1 check (quantity > 0),
    unit_price numeric(10,2) default 0.00 check (unit_price >= 0),
    created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 9. Order Status History Table
-- ----------------------------------------------------------------------------
create table if not exists public.order_status_history (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null references public.orders(id) on delete cascade,
    old_status text,
    new_status text not null,
    changed_by uuid references auth.users(id),
    note text,
    created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 10. Inventory Movements Table
-- ----------------------------------------------------------------------------
create table if not exists public.inventory_movements (
    id uuid primary key default gen_random_uuid(),
    sticker_id uuid not null references public.stickers(id) on delete cascade,
    order_id uuid references public.orders(id) on delete set null,
    movement_type text not null check (
        movement_type in ('restock', 'reserve', 'release', 'sale', 'adjustment', 'damage')
    ),
    quantity_delta integer not null,
    reason text,
    created_by uuid references auth.users(id),
    created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 11. Print Batches Table
-- ----------------------------------------------------------------------------
create table if not exists public.print_batches (
    id uuid primary key default gen_random_uuid(),
    batch_number text not null unique,
    status text not null default 'draft' check (
        status in ('draft', 'prepared', 'printing', 'printed', 'cancelled')
    ),
    created_by uuid references auth.users(id),
    notes text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    printed_at timestamptz
);

-- ----------------------------------------------------------------------------
-- 12. Print Batch Items Table (Aggregated designs for batch)
-- ----------------------------------------------------------------------------
create table if not exists public.print_batch_items (
    id uuid primary key default gen_random_uuid(),
    print_batch_id uuid not null references public.print_batches(id) on delete cascade,
    sticker_id uuid not null references public.stickers(id),
    quantity_required integer not null check (quantity_required > 0),
    quantity_printed integer default 0 check (quantity_printed >= 0),
    created_at timestamptz not null default now(),
    unique (print_batch_id, sticker_id)
);

-- ----------------------------------------------------------------------------
-- 13. Print Batch Order Items (Explicit Allocation Junction Table)
-- ----------------------------------------------------------------------------
create table if not exists public.print_batch_order_items (
    print_batch_id uuid not null references public.print_batches(id) on delete cascade,
    order_item_id uuid not null references public.order_items(id) on delete cascade,
    allocated_quantity integer not null check (allocated_quantity > 0),
    created_at timestamptz not null default now(),
    primary key (print_batch_id, order_item_id)
);

-- ----------------------------------------------------------------------------
-- 14. App Settings Table
-- ----------------------------------------------------------------------------
create table if not exists public.app_settings (
    key text primary key,
    value jsonb not null,
    updated_by uuid references auth.users(id),
    updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 15. Performance Indexes
-- ----------------------------------------------------------------------------
create index if not exists idx_stickers_status on public.stickers(status);
create index if not exists idx_stickers_is_featured on public.stickers(is_featured);
create index if not exists idx_stickers_slug on public.stickers(slug);
create index if not exists idx_categories_slug on public.categories(slug);
create index if not exists idx_categories_sort_order on public.categories(sort_order);
create index if not exists idx_sticker_categories_cat on public.sticker_categories(category_id);
create index if not exists idx_sticker_tags_tag on public.sticker_tags(tag_id);
create index if not exists idx_orders_order_number on public.orders(order_number);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_submitted_at on public.orders(submitted_at desc);
create index if not exists idx_orders_idempotency on public.orders(idempotency_key);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_order_items_sticker_id on public.order_items(sticker_id);
create index if not exists idx_order_items_role on public.order_items(item_role);
create index if not exists idx_print_batch_items_batch on public.print_batch_items(print_batch_id);
create index if not exists idx_print_batch_items_sticker on public.print_batch_items(sticker_id);
create index if not exists idx_print_batch_order_items_order_item on public.print_batch_order_items(order_item_id);
