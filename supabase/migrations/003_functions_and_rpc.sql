-- ============================================================================
-- Migration: 003_functions_and_rpc.sql
-- Description: Trusted PostgreSQL Functions & RPCs for Atomic Order Creation
--              and Print Studio Demand Allocation
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Helper function to generate human-readable order numbers
-- ----------------------------------------------------------------------------
create or replace function public.generate_order_number()
returns text
language plpgsql
as $$
declare
    v_prefix text;
    v_random text;
    v_candidate text;
    v_exists boolean;
begin
    v_prefix := 'ORD-' || to_char(clock_timestamp(), 'YYYYMMDD') || '-';
    loop
        v_random := upper(substr(md5(random()::text), 1, 4));
        v_candidate := v_prefix || v_random;
        select exists(select 1 from public.orders where order_number = v_candidate) into v_exists;
        exit when not v_exists;
    end loop;
    return v_candidate;
end;
$$;

-- ----------------------------------------------------------------------------
-- 2. Trusted RPC: create_pack_order
--    Atomically validates pack rules, checks sticker availability,
--    enforces idempotency, snapshots item details, and inserts order.
-- ----------------------------------------------------------------------------
create or replace function public.create_pack_order(
    p_customer_name text,
    p_customer_contact text,
    p_customer_email text default null,
    p_customer_note text default null,
    p_base_sticker_ids uuid[] default '{}',
    p_bonus_sticker_ids uuid[] default '{}',
    p_idempotency_key text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    v_rule record;
    v_order_id uuid;
    v_order_number text;
    v_base_count integer;
    v_bonus_count integer;
    v_total_count integer;
    v_existing_order record;
    v_sticker record;
    v_id uuid;
    v_all_ids uuid[];
    v_unique_count integer;
begin
    -- 1. Validate required contact inputs
    if coalesce(trim(p_customer_name), '') = '' then
        raise exception 'Customer name is required' using errcode = 'P0001';
    end if;

    if coalesce(trim(p_customer_contact), '') = '' then
        raise exception 'Customer contact information is required' using errcode = 'P0001';
    end if;

    -- 2. Check Idempotency Key
    if p_idempotency_key is not null and trim(p_idempotency_key) <> '' then
        select id, order_number, status, total_quantity, submitted_at
        into v_existing_order
        from public.orders
        where idempotency_key = trim(p_idempotency_key);

        if found then
            return jsonb_build_object(
                'success', true,
                'is_idempotent_replay', true,
                'order_id', v_existing_order.id,
                'order_number', v_existing_order.order_number,
                'status', v_existing_order.status,
                'total_quantity', v_existing_order.total_quantity,
                'submitted_at', v_existing_order.submitted_at
            );
        end if;
    end if;

    -- 3. Load active pack rule
    select * into v_rule
    from public.pack_rules
    where is_active = true
    order by created_at desc
    limit 1;

    if not found then
        -- Fallback default pack rule if none explicitly active
        v_rule.id := null;
        v_rule.base_quantity := 10;
        v_rule.bonus_quantity := 2;
        v_rule.allow_duplicate_stickers := false;
    end if;

    v_base_count := coalesce(array_length(p_base_sticker_ids, 1), 0);
    v_bonus_count := coalesce(array_length(p_bonus_sticker_ids, 1), 0);

    -- 4. Validate exact pack sizes
    if v_base_count <> v_rule.base_quantity then
        raise exception 'Invalid base sticker count: expected %, received %', v_rule.base_quantity, v_base_count
            using errcode = 'P0002';
    end if;

    if v_bonus_count <> v_rule.bonus_quantity then
        raise exception 'Invalid bonus sticker count: expected %, received %', v_rule.bonus_quantity, v_bonus_count
            using errcode = 'P0002';
    end if;

    v_total_count := v_base_count + v_bonus_count;
    v_all_ids := p_base_sticker_ids || p_bonus_sticker_ids;

    -- 5. Duplicate ID validation if duplicates disallowed
    if not v_rule.allow_duplicate_stickers then
        select count(distinct id) into v_unique_count from unnest(v_all_ids) as id;
        if v_unique_count <> v_total_count then
            raise exception 'Duplicate sticker selections are not permitted' using errcode = 'P0003';
        end if;
    end if;

    -- 6. Verify each sticker exists, is active, and stock is available
    foreach v_id in array v_all_ids loop
        select id, name, image_path, status, track_inventory, stock_on_hand
        into v_sticker
        from public.stickers
        where id = v_id;

        if not found then
            raise exception 'Sticker ID % does not exist', v_id using errcode = 'P0004';
        end if;

        if v_sticker.status <> 'active' then
            raise exception 'Sticker "%" is not active or has been archived', v_sticker.name using errcode = 'P0005';
        end if;

        if v_sticker.track_inventory and coalesce(v_sticker.stock_on_hand, 0) < 1 then
            raise exception 'Sticker "%" is out of stock', v_sticker.name using errcode = 'P0006';
        end if;
    end loop;

    -- 7. Generate unique order number
    v_order_number := public.generate_order_number();

    -- 8. Insert Order
    insert into public.orders (
        order_number,
        customer_name,
        customer_contact,
        customer_email,
        customer_note,
        status,
        pack_rule_id,
        base_quantity,
        bonus_quantity,
        total_quantity,
        idempotency_key
    ) values (
        v_order_number,
        trim(p_customer_name),
        trim(p_customer_contact),
        nullif(trim(p_customer_email), ''),
        nullif(trim(p_customer_note), ''),
        'submitted',
        v_rule.id,
        v_base_count,
        v_bonus_count,
        v_total_count,
        nullif(trim(p_idempotency_key), '')
    ) returning id into v_order_id;

    -- 9. Insert base items with snapshots
    foreach v_id in array p_base_sticker_ids loop
        select name, image_path into v_sticker from public.stickers where id = v_id;
        insert into public.order_items (
            order_id,
            sticker_id,
            sticker_name_snapshot,
            image_path_snapshot,
            item_role,
            quantity
        ) values (
            v_order_id,
            v_id,
            v_sticker.name,
            v_sticker.image_path,
            'base',
            1
        );
    end loop;

    -- 10. Insert bonus items with snapshots
    foreach v_id in array p_bonus_sticker_ids loop
        select name, image_path into v_sticker from public.stickers where id = v_id;
        insert into public.order_items (
            order_id,
            sticker_id,
            sticker_name_snapshot,
            image_path_snapshot,
            item_role,
            quantity
        ) values (
            v_order_id,
            v_id,
            v_sticker.name,
            v_sticker.image_path,
            'bonus',
            1
        );
    end loop;

    -- 11. Record initial status history
    insert into public.order_status_history (
        order_id,
        old_status,
        new_status,
        note
    ) values (
        v_order_id,
        null,
        'submitted',
        'Order submitted by customer'
    );

    -- 12. Adjust stock if inventory tracking is enabled
    foreach v_id in array v_all_ids loop
        select id, name, track_inventory, stock_on_hand into v_sticker from public.stickers where id = v_id;
        if v_sticker.track_inventory then
            update public.stickers
            set stock_on_hand = stock_on_hand - 1,
                updated_at = now()
            where id = v_id;

            insert into public.inventory_movements (
                sticker_id,
                order_id,
                movement_type,
                quantity_delta,
                reason
            ) values (
                v_id,
                v_order_id,
                'reserve',
                -1,
                'Reserved for order ' || v_order_number
            );
        end if;
    end loop;

    -- Return safe customer response
    return jsonb_build_object(
        'success', true,
        'order_id', v_order_id,
        'order_number', v_order_number,
        'status', 'submitted',
        'base_quantity', v_base_count,
        'bonus_quantity', v_bonus_count,
        'total_quantity', v_total_count,
        'submitted_at', now()
    );
end;
$$;

-- Grant execution to anon and authenticated users
grant execute on function public.create_pack_order to anon, authenticated;

-- ----------------------------------------------------------------------------
-- 3. Print Studio RPC: create_print_batch_with_allocations
--    Aggregates unallocated order items across selected eligible orders,
--    creates the print batch, items, and atomic allocation records.
-- ----------------------------------------------------------------------------
create or replace function public.create_print_batch_with_allocations(
    p_order_ids uuid[],
    p_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    v_batch_id uuid;
    v_batch_number text;
    v_today_str text;
    v_seq integer;
    v_total_copies integer := 0;
    v_distinct_designs integer := 0;
    v_item record;
begin
    -- 1. Ensure user is admin
    if not public.is_admin() then
        raise exception 'Unauthorized: Admin privileges required' using errcode = '42501';
    end if;

    if coalesce(array_length(p_order_ids, 1), 0) = 0 then
        raise exception 'At least one order must be selected' using errcode = 'P0010';
    end if;

    -- 2. Generate batch number
    v_today_str := to_char(clock_timestamp(), 'YYYYMMDD');
    select coalesce(count(*), 0) + 1 into v_seq
    from public.print_batches
    where batch_number like 'PB-' || v_today_str || '-%';

    v_batch_number := 'PB-' || v_today_str || '-' || lpad(v_seq::text, 3, '0');

    -- 3. Create print batch row
    insert into public.print_batches (
        batch_number,
        status,
        created_by,
        notes
    ) values (
        v_batch_number,
        'prepared',
        auth.uid(),
        nullif(trim(p_notes), '')
    ) returning id into v_batch_id;

    -- 4. Calculate unallocated demand and allocate
    -- Temporary record table for unallocated quantities
    for v_item in
        select
            oi.id as order_item_id,
            oi.sticker_id,
            oi.quantity as item_qty,
            coalesce(sum(pboi.allocated_quantity), 0) as already_allocated
        from public.order_items oi
        join public.orders o on o.id = oi.order_id
        left join public.print_batch_order_items pboi on pboi.order_item_id = oi.id
        left join public.print_batches pb on pb.id = pboi.print_batch_id and pb.status <> 'cancelled'
        where oi.order_id = any(p_order_ids)
          and o.status not in ('cancelled')
        group by oi.id, oi.sticker_id, oi.quantity
        having oi.quantity > coalesce(sum(pboi.allocated_quantity), 0)
    loop
        declare
            v_unallocated integer := v_item.item_qty - v_item.already_allocated;
        begin
            if v_unallocated > 0 then
                -- Insert allocation record
                insert into public.print_batch_order_items (
                    print_batch_id,
                    order_item_id,
                    allocated_quantity
                ) values (
                    v_batch_id,
                    v_item.order_item_id,
                    v_unallocated
                );

                -- Upsert aggregated quantity in print_batch_items
                insert into public.print_batch_items (
                    print_batch_id,
                    sticker_id,
                    quantity_required,
                    quantity_printed
                ) values (
                    v_batch_id,
                    v_item.sticker_id,
                    v_unallocated,
                    0
                )
                on conflict (print_batch_id, sticker_id)
                do update set quantity_required = print_batch_items.quantity_required + v_unallocated;

                v_total_copies := v_total_copies + v_unallocated;
            end if;
        end;
    end loop;

    -- If no unallocated items found
    if v_total_copies = 0 then
        -- Roll back batch creation
        delete from public.print_batches where id = v_batch_id;
        raise exception 'No unallocated sticker items found in the selected orders' using errcode = 'P0011';
    end if;

    select count(*) into v_distinct_designs
    from public.print_batch_items
    where print_batch_id = v_batch_id;

    -- Update status of orders to ready_to_print if they were reviewed/submitted
    update public.orders
    set status = 'ready_to_print', updated_at = now()
    where id = any(p_order_ids) and status in ('submitted', 'reviewed');

    return jsonb_build_object(
        'success', true,
        'batch_id', v_batch_id,
        'batch_number', v_batch_number,
        'total_copies', v_total_copies,
        'distinct_designs', v_distinct_designs,
        'order_count', array_length(p_order_ids, 1)
    );
end;
$$;

grant execute on function public.create_print_batch_with_allocations to authenticated;

-- ----------------------------------------------------------------------------
-- 4. Order Status Transition with Audit History
-- ----------------------------------------------------------------------------
create or replace function public.transition_order_status(
    p_order_id uuid,
    p_new_status text,
    p_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    v_order record;
    v_is_valid boolean := false;
begin
    if not public.is_admin() then
        raise exception 'Unauthorized' using errcode = '42501';
    end if;

    select id, status into v_order from public.orders where id = p_order_id;
    if not found then
        raise exception 'Order not found' using errcode = 'P0020';
    end if;

    -- Allowed status transitions validation
    -- submitted -> reviewed, cancelled, on_hold
    -- reviewed -> ready_to_print, cancelled, on_hold
    -- ready_to_print -> printing, cancelled, on_hold
    -- printing -> printed, cancelled, on_hold
    -- printed -> packed, cancelled, on_hold
    -- packed -> completed, cancelled, on_hold
    -- on_hold -> reviewed, ready_to_print, cancelled
    if (v_order.status = 'submitted' and p_new_status in ('reviewed', 'ready_to_print', 'cancelled', 'on_hold')) or
       (v_order.status = 'reviewed' and p_new_status in ('ready_to_print', 'cancelled', 'on_hold')) or
       (v_order.status = 'ready_to_print' and p_new_status in ('printing', 'cancelled', 'on_hold')) or
       (v_order.status = 'printing' and p_new_status in ('printed', 'cancelled', 'on_hold')) or
       (v_order.status = 'printed' and p_new_status in ('packed', 'cancelled', 'on_hold')) or
       (v_order.status = 'packed' and p_new_status in ('completed', 'cancelled', 'on_hold')) or
       (v_order.status = 'on_hold' and p_new_status in ('submitted', 'reviewed', 'ready_to_print', 'cancelled')) or
       (v_order.status = p_new_status) then
        v_is_valid := true;
    end if;

    if not v_is_valid then
        raise exception 'Invalid status transition from "%" to "%"', v_order.status, p_new_status using errcode = 'P0021';
    end if;

    update public.orders
    set status = p_new_status,
        updated_at = now(),
        completed_at = case when p_new_status = 'completed' then now() else completed_at end
    where id = p_order_id;

    insert into public.order_status_history (
        order_id,
        old_status,
        new_status,
        changed_by,
        note
    ) values (
        p_order_id,
        v_order.status,
        p_new_status,
        auth.uid(),
        p_note
    );

    return jsonb_build_object('success', true, 'old_status', v_order.status, 'new_status', p_new_status);
end;
$$;

grant execute on function public.transition_order_status to authenticated;
