import { Category, Sticker, Tag, PackRule, Order } from '../types';

export const SEED_PACK_RULE: PackRule = {
  id: 'a0000000-0000-0000-0000-000000000001',
  name: '10 + 2 Collector Pack',
  base_quantity: 10,
  bonus_quantity: 2,
  bonus_mode: 'customer_choice',
  allow_duplicate_stickers: false,
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const SEED_CATEGORIES: Category[] = [
  {
    id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Coding & Tech',
    slug: 'coding-tech',
    description: 'Dev jokes, terminal vibes, escape keys, and caffeinated engineering',
    icon_name: 'Code',
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c0000000-0000-0000-0000-000000000002',
    name: 'Anime & Manga',
    slug: 'anime-chibi',
    description: 'Zenitsu lightning, Luffy, JDM touge anime, and cyberpunk aesthetics',
    icon_name: 'Sparkles',
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c0000000-0000-0000-0000-000000000003',
    name: 'Motorsport & Speed',
    slug: 'motorsport-speed',
    description: 'Formula 1, Porsche GT3 RS, Supra MK4, Miura, and racing brakes',
    icon_name: 'Zap',
    sort_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c0000000-0000-0000-0000-000000000004',
    name: 'Retro Gaming & 80s',
    slug: 'retro-gaming',
    description: 'Pac-Man ghosts, 80s synthwave cassette, arcade setups, and Awesome Mix',
    icon_name: 'Gamepad2',
    sort_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c0000000-0000-0000-0000-000000000005',
    name: 'Pop Culture & Comics',
    slug: 'pop-culture',
    description: 'Spider-Man, The Boys, GTA Wasted, Jake the Dog, and Kick Buttowski',
    icon_name: 'Flame',
    sort_order: 5,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c0000000-0000-0000-0000-000000000006',
    name: 'Aesthetic & Memes',
    slug: 'memes-chaos',
    description: 'Duck You, Squidward coffee, pure caffeine IV, vintage stamps, and mood badges',
    icon_name: 'Coffee',
    sort_order: 6,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const SEED_STICKERS: Sticker[] = [];

// Initial starter orders for demonstration
export const SEED_ORDERS: Order[] = [];
