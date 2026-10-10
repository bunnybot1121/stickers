-- ============================================================================
-- Migration: 002_rls_policies.sql
-- Description: Row Level Security (RLS) policies and role verification
-- ============================================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.stickers enable row level security;
alter table public.sticker_categories enable row level security;
alter table public.tags enable row level security;
alter table public.sticker_tags enable row level security;
alter table public.pack_rules enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.print_batches enable row level security;
alter table public.print_batch_items enable row level security;
alter table public.print_batch_order_items enable row level security;
alter table public.app_settings enable row level security;

-- ----------------------------------------------------------------------------
-- Helper Functions for Security
-- ----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
    select exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'admin'
    );
$$;

-- ----------------------------------------------------------------------------
-- 1. Profiles Policies
-- ----------------------------------------------------------------------------
-- Users can read their own profile
create policy "Users can view their own profile"
    on public.profiles for select
    using (auth.uid() = id);

-- Only admins can view all profiles or manage roles
create policy "Admins can view all profiles"
    on public.profiles for select
    using (public.is_admin());

create policy "Admins can update profiles"
    on public.profiles for update
    using (public.is_admin());

-- Disallow self-promotion on insert/update: Trigger to keep roles safe
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles (id, display_name, role)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
        'customer' -- New signups are always customer role by default
    )
    on conflict (id) do nothing;
    return new;
end;
$$;

-- Drop trigger if exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 2. Categories Policies
-- ----------------------------------------------------------------------------
-- Public can read active categories
create policy "Public can read active categories"
    on public.categories for select
    using (is_active = true or public.is_admin());

-- Admin has full access to categories
create policy "Admins can insert categories"
    on public.categories for insert
    with check (public.is_admin());

create policy "Admins can update categories"
    on public.categories for update
    using (public.is_admin());

create policy "Admins can delete categories"
    on public.categories for delete
    using (public.is_admin());

-- ----------------------------------------------------------------------------
-- 3. Stickers Policies
-- ----------------------------------------------------------------------------
-- Public can read active stickers
create policy "Public can read active stickers"
    on public.stickers for select
    using (status = 'active' or public.is_admin());

-- Admin full access
create policy "Admins can insert stickers"
    on public.stickers for insert
    with check (public.is_admin());

create policy "Admins can update stickers"
    on public.stickers for update
    using (public.is_admin());

create policy "Admins can delete stickers"
    on public.stickers for delete
    using (public.is_admin());

-- ----------------------------------------------------------------------------
-- 4. Sticker Categories & Tags Policies
-- ----------------------------------------------------------------------------
create policy "Public can read sticker categories"
    on public.sticker_categories for select
    using (true);

create policy "Admins can manage sticker categories"
    on public.sticker_categories for all
    using (public.is_admin());

create policy "Public can read tags"
    on public.tags for select
    using (true);

create policy "Admins can manage tags"
    on public.tags for all
    using (public.is_admin());

create policy "Public can read sticker tags"
    on public.sticker_tags for select
    using (true);

create policy "Admins can manage sticker tags"
    on public.sticker_tags for all
    using (public.is_admin());

-- ----------------------------------------------------------------------------
-- 5. Pack Rules Policies
-- ----------------------------------------------------------------------------
-- Public can read active pack rules
create policy "Public can read active pack rules"
    on public.pack_rules for select
    using (is_active = true or public.is_admin());

create policy "Admins can manage pack rules"
    on public.pack_rules for all
    using (public.is_admin());

-- ----------------------------------------------------------------------------
-- 6. Orders and Order Items Policies
-- ----------------------------------------------------------------------------
-- Public/anonymous visitors CANNOT read orders or items directly
-- Only Admins can view and manage all orders and line items
create policy "Admins can view orders"
    on public.orders for select
    using (public.is_admin());

create policy "Admins can update orders"
    on public.orders for update
    using (public.is_admin());

create policy "Admins can view order items"
    on public.order_items for select
    using (public.is_admin());

create policy "Admins can view order status history"
    on public.order_status_history for select
    using (public.is_admin());

-- ----------------------------------------------------------------------------
-- 7. Inventory Movements Policies
-- ----------------------------------------------------------------------------
create policy "Admins can view inventory movements"
    on public.inventory_movements for select
    using (public.is_admin());

create policy "Admins can manage inventory movements"
    on public.inventory_movements for all
    using (public.is_admin());

-- ----------------------------------------------------------------------------
-- 8. Print Batches Policies
-- ----------------------------------------------------------------------------
create policy "Admins can view print batches"
    on public.print_batches for select
    using (public.is_admin());

create policy "Admins can manage print batches"
    on public.print_batches for all
    using (public.is_admin());

create policy "Admins can view print batch items"
    on public.print_batch_items for select
    using (public.is_admin());

create policy "Admins can manage print batch items"
    on public.print_batch_items for all
    using (public.is_admin());

create policy "Admins can view print batch order items"
    on public.print_batch_order_items for select
    using (public.is_admin());

create policy "Admins can manage print batch order items"
    on public.print_batch_order_items for all
    using (public.is_admin());

-- ----------------------------------------------------------------------------
-- 9. App Settings Policies
-- ----------------------------------------------------------------------------
create policy "Public can read public settings"
    on public.app_settings for select
    using (key in ('brand_name', 'contact_info', 'store_notice', 'order_confirmation_message'));

create policy "Admins can manage all settings"
    on public.app_settings for all
    using (public.is_admin());

-- ----------------------------------------------------------------------------
-- 10. Supabase Storage Policies (sticker-artwork bucket)
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('sticker-artwork', 'sticker-artwork', true)
on conflict (id) do nothing;

create policy "Public can read sticker artwork"
    on storage.objects for select
    using (bucket_id = 'sticker-artwork');

create policy "Admins can upload sticker artwork"
    on storage.objects for insert
    with check (bucket_id = 'sticker-artwork' and public.is_admin());

create policy "Admins can update sticker artwork"
    on storage.objects for update
    using (bucket_id = 'sticker-artwork' and public.is_admin());

create policy "Admins can delete sticker artwork"
    on storage.objects for delete
    using (bucket_id = 'sticker-artwork' and public.is_admin());
