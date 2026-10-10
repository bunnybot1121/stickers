# ✨ STICKER VERSE — Curated Sticker Pack Platform & Print Studio

> **Neo-Brutalist × Kawaii Sticker Discovery, 10 + 2 Pack Builder, Order Management, and Print Studio Production System.**

---

## 🌟 1. Overview & Core Offer

**STICKER VERSE** is a full-stack web application designed for small independent sticker businesses selling collectible die-cut sticker packs.

- **The Core Offer (10 + 2)**: Customers discover artwork by category, search by keywords, filter by style, and select **10 eligible base stickers**. Upon completing the base selection, an interactive celebratory animation unlocks **2 bonus reward stickers free** (12 stickers total).
- **Flagship Print Studio**: Solves the tedious manual calculation of sticker printing. The owner selects eligible customer orders and the system aggregates exact design-wise demand by stable `sticker_id`, guarantees **no double-counting** across print batches, tracks printed quantities, and exports spreadsheet formula injection-protected CSV files.
- **Dual-Mode Data Architecture**: Connects directly to **Supabase PostgreSQL** (with Auth, RLS, Storage, and transactional RPC functions). When deployed locally or awaiting Supabase keys, it operates in a **Resilient Local Demo Mode** with pre-seeded data and identical business logic.

---

## 🎨 2. Design System & Aesthetics

- **Art Direction**: Neo-Brutalist × Kawaii Sticker Culture.
- **Color Palette**:
  - Electric Cyan: `#00D4D8`
  - Candy Pink: `#FF6EB4`
  - Bright Yellow: `#F5E642`
  - Near-Black Outlines: `#111111`
  - Warm Cream Surface: `#FFF9F0`
- **Visual Features**: 3px solid borders, offset box-shadows (`shadow-neo`, `shadow-neo-lg`), die-cut vector stickers with glossy highlight overlays, responsive floating pack tray, and accessible micro-animations (with `prefers-reduced-motion` compliance).

---

## 🗄️ 3. Supabase Schema & Database Design

The database schema is organized into reviewed SQL migrations in `supabase/migrations/`:

| Migration File | Description |
|---|---|
| [`001_initial_schema.sql`](file:///c:/Users/Sachin/stickers/supabase/migrations/001_initial_schema.sql) | Core tables: `profiles`, `categories`, `stickers`, `sticker_categories`, `tags`, `sticker_tags`, `pack_rules`, `orders`, `order_items`, `order_status_history`, `inventory_movements`, `print_batches`, `print_batch_items`, `print_batch_order_items`, `app_settings`, plus foreign keys & indexes. |
| [`002_rls_policies.sql`](file:///c:/Users/Sachin/stickers/supabase/migrations/002_rls_policies.sql) | Complete Row Level Security (RLS) policies protecting customer data, restricting catalogue edits to verified admins, and provisioning storage bucket policies. |
| [`003_functions_and_rpc.sql`](file:///c:/Users/Sachin/stickers/supabase/migrations/003_functions_and_rpc.sql) | Trusted PostgreSQL functions: `create_pack_order` (atomic pack creation, duplicate checks, idempotency, stock reservations), `create_print_batch_with_allocations` (demand aggregation & double-counting prevention), and `transition_order_status`. |
| [`004_seed_data.sql`](file:///c:/Users/Sachin/stickers/supabase/migrations/004_seed_data.sql) | Starter categories, tags, 10+2 pack rule, and 24 curated vector stickers. |

---

## 🚀 4. Quick Start & Local Setup

### Prerequisites
- Node.js `v20+` or `v24+`
- npm `v10+` or `v11+`

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional for Live Supabase)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Provide your Supabase URL and Publishable Anon Key:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-publishable-key
```
*(If omitted, the app will run seamlessly in Local Demo Mode)*

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔐 5. Admin Studio Access

To access the administrative dashboard, catalogue manager, and Print Studio:
1. Click **"Admin Studio"** in the top navigation or footer.
2. If using **Local Demo Mode**, click the **"Click to Auto-fill Demo Credentials"** link:
   - **Email**: `admin@stickerverse.craft`
   - **Password**: `admin123`
3. If using **Live Supabase**, sign in with an authenticated user account provisioned with `role = 'admin'` in `public.profiles`.

### Provisioning the First Admin in Supabase:
In your Supabase SQL Editor:
```sql
-- 1. Create user via Supabase Auth dashboard or sign up
-- 2. Promote the user to admin role:
update public.profiles
set role = 'admin'
where id = 'YOUR-USER-UUID-HERE';
```

---

## 🖨️ 6. Print Studio Calculation Rules & Allocation Engine

### Accounting Rule:
Print demand is calculated **only from unallocated eligible order items**:
$$\text{Unallocated Quantity} = \text{Order Item Quantity} - \sum \text{Allocated Quantities in Active Batches}$$

- **Multi-Order Selection**: The admin selects any combination of submitted or reviewed orders.
- **Aggregation by Stable ID**: Demand aggregates by stable `sticker_id` (not display name) to guarantee production precision.
- **Zero Double-Counting**: When batch `PB-YYYYMMDD-001` is generated, allocations are recorded in `print_batch_order_items`. Subsequent batches automatically ignore already allocated quantities.
- **Spreadsheet Formula Injection Defense**: Untrusted text fields starting with `=`, `+`, `-`, `@`, `\t`, or `\r` are safely escaped with `'` in all CSV downloads.

---

## 🧪 7. Automated Test Suite

Vitest tests cover all critical business rules and algorithms:

```bash
npm test
```

### Test Coverage Highlights:
- **`test/packRules.test.ts`**:
  - Validates exact 10 base + 2 bonus packs
  - Rejects packs missing base items or exceeding pack size
  - Rejects packs with missing bonus items
  - Rejects duplicate sticker IDs (both within base items and across bonus items)
  - Detects archived or out-of-stock items
  - Verifies bonus unlock threshold triggers
- **`test/printStudio.test.ts`**:
  - Aggregates multi-order demand by stable `sticker_id`
  - Excludes cancelled orders
  - Validates prevention of double-counting using allocation records
  - Tests spreadsheet formula injection sanitization
  - Validates RFC 4180 CSV export headers and data
- **`test/orderWorkflow.test.ts`**:
  - Validates permissible order status state machine transitions
  - Blocks illegal status jumps

---

## 📦 8. Production Build & Deployment

Build the production bundle:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

### Deploying to Vercel / Netlify / Cloudflare Pages:
1. Push repository to GitHub.
2. Connect repository to your deployment provider.
3. Set build command to `npm run build` and output directory to `dist`.
4. Configure environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

---

## 📋 9. Known Decisions to Confirm for Production Launch

1. **Brand Identity**: Finalize trade name, custom domain, and official logo vector.
2. **Order Fulfillment Policy**: Decide whether customer orders trigger immediate email notifications or are processed as review requests.
3. **Physical Stock vs. Print to Order**: Configure whether stickers track physical finished stock (`track_inventory = true`) or are printed on demand.
4. **Print Sheet Dimensions**: Provide exact physical sticker dimensions (e.g., 2.5" × 2.5"), page sheet format (A3/A4/Roll), bleeds, and cutlines if automated PDF tiling is desired in future releases.
