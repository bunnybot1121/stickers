-- ============================================================================
-- Migration: 004_seed_data.sql
-- Description: Starter Seed Data for Sticker Shop Platform
-- ============================================================================

-- 1. Insert Default Pack Rule (10 + 2)
insert into public.pack_rules (id, name, base_quantity, bonus_quantity, bonus_mode, allow_duplicate_stickers, is_active)
values (
    'a0000000-0000-0000-0000-000000000001',
    '10 + 2 Collector Pack',
    10,
    2,
    'customer_choice',
    false,
    true
)
on conflict (id) do nothing;

-- 2. Insert Starter Categories
insert into public.categories (id, name, slug, description, icon_name, sort_order, is_active)
values
    ('c0000000-0000-0000-0000-000000000001', 'Coding & Tech', 'coding-tech', 'For terminal dwellers, git wizards, and caffeinated devs', 'Code', 1, true),
    ('c0000000-0000-0000-0000-000000000002', 'Anime & Chibi', 'anime-chibi', 'Expressive eyes, magical vibes, and chibi moods', 'Sparkles', 2, true),
    ('c0000000-0000-0000-0000-000000000003', 'Aesthetic & Chill', 'aesthetic-chill', 'Lofi afternoons, pastel skies, and warm drinks', 'Coffee', 3, true),
    ('c0000000-0000-0000-0000-000000000004', 'Retro Gaming', 'retro-gaming', '8-bit treasures, game carts, and pixel nostalgia', 'Gamepad2', 4, true),
    ('c0000000-0000-0000-0000-000000000005', 'Cute Animals', 'cute-animals', 'Boba bears, sleepy kittens, and pocket frogs', 'Heart', 5, true),
    ('c0000000-0000-0000-0000-000000000006', 'Memes & Chaos', 'memes-chaos', 'Chaotic energy, dumpster fires, and pure dopamine', 'Flame', 6, true)
on conflict (id) do nothing;

-- 3. Insert Starter Tags
insert into public.tags (id, name, slug)
values
    ('t0000000-0000-0000-0000-000000000001', 'Boba', 'boba'),
    ('t0000000-0000-0000-0000-000000000002', 'Python', 'python'),
    ('t0000000-0000-0000-0000-000000000003', 'Cat', 'cat'),
    ('t0000000-0000-0000-0000-000000000004', 'Pixel Art', 'pixel-art'),
    ('t0000000-0000-0000-0000-000000000005', 'Holo', 'holo'),
    ('t0000000-0000-0000-0000-000000000006', 'Coffee', 'coffee'),
    ('t0000000-0000-0000-0000-000000000007', 'Cyberpunk', 'cyberpunk'),
    ('t0000000-0000-0000-0000-000000000008', 'Frog', 'frog'),
    ('t0000000-0000-0000-0000-000000000009', 'Ghost', 'ghost'),
    ('t0000000-0000-0000-0000-000000000010', 'Vaporwave', 'vaporwave')
on conflict (id) do nothing;

-- 4. Insert Stickers (24 High-Quality Designs across all styles)
insert into public.stickers (id, name, slug, description, image_path, thumbnail_path, status, style, is_featured, track_inventory, stock_on_hand, low_stock_threshold, price)
values
    ('s0000000-0000-0000-0000-000000000001', 'Boba Ghost', 'boba-ghost', 'A friendly spooky specter sipping lavender taro milk tea with extra tapioca pearls.', '/stickers/boba-ghost.svg', '/stickers/boba-ghost.svg', 'active', 'Kawaii', true, true, 45, 10, 3.50),
    ('s0000000-0000-0000-0000-000000000002', 'Caffeinated Python', 'caffeinated-python', 'A cozy coiled python nursing an oversized espresso mug while running endless loops.', '/stickers/caffeinated-python.svg', '/stickers/caffeinated-python.svg', 'active', 'Neo-Brutal', true, true, 50, 10, 3.50),
    ('s0000000-0000-0000-0000-000000000003', 'Pixel Game Cart', 'pixel-game-cart', 'Golden era 16-bit transparent cartridge glowing with neon arcade energy.', '/stickers/pixel-game-cart.svg', '/stickers/pixel-game-cart.svg', 'active', 'Pixel Art', true, true, 30, 8, 3.50),
    ('s0000000-0000-0000-0000-000000000004', 'Sleepy Ramen Neko', 'sleepy-ramen-neko', 'A calico cat dozing off directly on top of a warm bowl of tonkotsu ramen with narutomaki.', '/stickers/sleepy-ramen-neko.svg', '/stickers/sleepy-ramen-neko.svg', 'active', 'Kawaii', true, true, 40, 10, 3.50),
    ('s0000000-0000-0000-0000-000000000005', 'Terminal Wizard', 'terminal-wizard', 'Pointy neon hat, glowing terminal prompt runes, and zero build warnings.', '/stickers/terminal-wizard.svg', '/stickers/terminal-wizard.svg', 'active', 'Neo-Brutal', true, true, 25, 5, 3.50),
    ('s0000000-0000-0000-0000-000000000006', 'Mushroom House Frog', 'mushroom-house-frog', 'A tiny green tree frog sitting happily under a spotted fly-agaric toadstool umbrella.', '/stickers/mushroom-house-frog.svg', '/stickers/mushroom-house-frog.svg', 'active', 'Kawaii', false, true, 60, 12, 3.50),
    ('s0000000-0000-0000-0000-000000000007', 'Cyberpunk Cassette', 'cyberpunk-cassette', 'Holographic magnetic tape ribbon with Japanese typography and synthwave chrome.', '/stickers/cyberpunk-cassette.svg', '/stickers/cyberpunk-cassette.svg', 'active', 'Holographic', true, true, 18, 5, 4.00),
    ('s0000000-0000-0000-0000-000000000008', 'This Is Fine Mug', 'this-is-fine-mug', 'A smiling ceramic coffee cup surrounded by cheerful, completely unhinged flames.', '/stickers/this-is-fine-mug.svg', '/stickers/this-is-fine-mug.svg', 'active', 'Neo-Brutal', true, true, 35, 10, 3.50),
    ('s0000000-0000-0000-0000-000000000009', 'Git Push Force Rocket', 'git-push-force-rocket', 'Dangerous retro red rocket firing hyperdrive exhaust. Live dangerously.', '/stickers/git-push-force-rocket.svg', '/stickers/git-push-force-rocket.svg', 'active', 'Retro', false, true, 22, 6, 3.50),
    ('s0000000-0000-0000-0000-000000000010', 'Matcha Onigiri', 'matcha-onigiri', 'A perfectly triangular rice ball wrapped in seaweed, dusting itself in emerald matcha powder.', '/stickers/matcha-onigiri.svg', '/stickers/matcha-onigiri.svg', 'active', 'Kawaii', false, true, 55, 15, 3.00),
    ('s0000000-0000-0000-0000-000000000011', 'Lofi Sunset Stereo', 'lofi-sunset-stereo', 'Vintage boombox emitting slow chill beats over a purple vaporwave horizon.', '/stickers/lofi-sunset-stereo.svg', '/stickers/lofi-sunset-stereo.svg', 'active', 'Retro', false, true, 28, 8, 3.50),
    ('s0000000-0000-0000-0000-000000000012', 'Retro Arcade Coin', 'retro-arcade-coin', 'Insert Coin to Continue. Minted in 1984 with gleaming 8-bit luster.', '/stickers/retro-arcade-coin.svg', '/stickers/retro-arcade-coin.svg', 'active', 'Pixel Art', false, true, 50, 10, 3.00),
    ('s0000000-0000-0000-0000-000000000013', 'Magic Potion Flask', 'magic-potion-flask', 'Heart-shaped glass vial bubbling with sparkling star-dust stamina elixir.', '/stickers/magic-potion-flask.svg', '/stickers/magic-potion-flask.svg', 'active', 'Kawaii', true, true, 32, 8, 3.50),
    ('s0000000-0000-0000-0000-000000000014', 'Cyber Hacker Cat', 'cyber-hacker-cat', 'Sphynx cat wearing glowing augmented-reality HUD visor and oversized mechanical keycaps.', '/stickers/cyber-hacker-cat.svg', '/stickers/cyber-hacker-cat.svg', 'active', 'Neo-Brutal', false, true, 20, 5, 4.00),
    ('s0000000-0000-0000-0000-000000000015', 'Space Donut Planet', 'space-donut-planet', 'Pink glazed pastry ring world floating through deep space surrounded by rainbow sugar sprinkles.', '/stickers/space-donut-planet.svg', '/stickers/space-donut-planet.svg', 'active', 'Kawaii', false, true, 42, 10, 3.50),
    ('s0000000-0000-0000-0000-000000000016', 'Dumpster Fire 2026', 'dumpster-fire-2026', 'Smiley green waste bin roaring with warm bright flames. We are coping admirably.', '/stickers/dumpster-fire-2026.svg', '/stickers/dumpster-fire-2026.svg', 'active', 'Neo-Brutal', true, true, 65, 12, 3.50),
    ('s0000000-0000-0000-0000-000000000017', 'Bao Bun Cloud', 'bao-bun-cloud', 'Fluffy steamed pork bun floating amongst pastel storm clouds, wearing a shy smile.', '/stickers/bao-bun-cloud.svg', '/stickers/bao-bun-cloud.svg', 'active', 'Kawaii', false, true, 38, 10, 3.00),
    ('s0000000-0000-0000-0000-000000000018', 'Synthwave Palm', 'synthwave-palm', 'Electric fuchsia and cyan palm tree against an infinite perspective grid sunset.', '/stickers/synthwave-palm.svg', '/stickers/synthwave-palm.svg', 'active', 'Retro', false, true, 25, 8, 3.50),
    ('s0000000-0000-0000-0000-000000000019', 'Octocat Tea Party', 'octocat-tea-party', 'Eight-legged cephalopod balancing teacups and pull-request approvals with serene poise.', '/stickers/octocat-tea-party.svg', '/stickers/octocat-tea-party.svg', 'active', 'Kawaii', false, true, 30, 8, 3.50),
    ('s0000000-0000-0000-0000-000000000020', '404 Brain Not Found', 'brain-not-found', 'Whimsical pixel art skull with an antenna and cute disconnected error dialog box.', '/stickers/brain-not-found.svg', '/stickers/brain-not-found.svg', 'active', 'Pixel Art', true, true, 48, 10, 3.50),
    ('s0000000-0000-0000-0000-000000000021', 'Holofoil Crystal Heart', 'holofoil-crystal-heart', 'Prismatic heart gemstone reflecting rainbow light flares from every facet.', '/stickers/holofoil-crystal-heart.svg', '/stickers/holofoil-crystal-heart.svg', 'active', 'Holographic', true, true, 15, 5, 4.00),
    ('s0000000-0000-0000-0000-000000000022', 'Strawberry Milk Carton', 'strawberry-milk-carton', 'Pastel pink drink carton with Japanese hiragana script and plump fresh berries.', '/stickers/strawberry-milk-carton.svg', '/stickers/strawberry-milk-carton.svg', 'active', 'Kawaii', true, true, 52, 10, 3.50),
    ('s0000000-0000-0000-0000-000000000023', 'Mechanical Keyboard Switch', 'mech-switch.svg', 'Tactile holy panda switch with transparent housing and golden spring bounce.', '/stickers/mech-switch.svg', '/stickers/mech-switch.svg', 'active', 'Neo-Brutal', false, true, 33, 8, 3.50),
    ('s0000000-0000-0000-0000-000000000024', 'Cosmic Jellyfish', 'cosmic-jellyfish', 'Bioluminescent deep-sea jellyfish drifting through nebular star clouds.', '/stickers/cosmic-jellyfish.svg', '/stickers/cosmic-jellyfish.svg', 'active', 'Holographic', false, true, 26, 6, 4.00)
on conflict (id) do nothing;

-- 5. Associate Stickers with Categories
insert into public.sticker_categories (sticker_id, category_id)
values
    -- Coding & Tech
    ('s0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001'),
    ('s0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000001'),
    ('s0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000001'),
    ('s0000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000001'),
    ('s0000000-0000-0000-0000-000000000019', 'c0000000-0000-0000-0000-000000000001'),
    ('s0000000-0000-0000-0000-000000000020', 'c0000000-0000-0000-0000-000000000001'),
    ('s0000000-0000-0000-0000-000000000023', 'c0000000-0000-0000-0000-000000000001'),

    -- Anime & Chibi
    ('s0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002'),
    ('s0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000002'),
    ('s0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000002'),
    ('s0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000002'),
    ('s0000000-0000-0000-0000-000000000017', 'c0000000-0000-0000-0000-000000000002'),
    ('s0000000-0000-0000-0000-000000000022', 'c0000000-0000-0000-0000-000000000002'),

    -- Aesthetic & Chill
    ('s0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000003'),
    ('s0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000003'),
    ('s0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000003'),
    ('s0000000-0000-0000-0000-000000000018', 'c0000000-0000-0000-0000-000000000003'),
    ('s0000000-0000-0000-0000-000000000021', 'c0000000-0000-0000-0000-000000000003'),
    ('s0000000-0000-0000-0000-000000000024', 'c0000000-0000-0000-0000-000000000003'),

    -- Retro Gaming
    ('s0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000004'),
    ('s0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000004'),

    -- Cute Animals
    ('s0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000005'),
    ('s0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000005'),

    -- Memes & Chaos
    ('s0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000006'),
    ('s0000000-0000-0000-0000-000000000016', 'c0000000-0000-0000-0000-000000000006')
on conflict do nothing;

-- 6. Insert App Settings
insert into public.app_settings (key, value)
values
    ('brand_name', '"STICKER VERSE"'),
    ('contact_info', '{"email": "hello@stickerverse.craft", "instagram": "@stickerverse.hq"}'),
    ('order_confirmation_message', '"Woohoo! Your pack order has landed in our studio. We will review the line items and begin high-definition production shortly."')
on conflict (key) do nothing;
