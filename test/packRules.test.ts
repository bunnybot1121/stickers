import { describe, it, expect } from 'vitest';
import { validatePack, isBonusUnlocked, getRemainingBaseCount, DEFAULT_PACK_RULE } from '../src/lib/packRules';
import { Sticker, PackSelectionState } from '../src/types';

describe('Pack Rules Engine', () => {
  const mockSticker = (id: string, name: string, status: 'active' | 'archived' = 'active', stock = 10): Sticker => ({
    id,
    name,
    slug: id,
    description: 'A test sticker',
    image_path: `/stickers/${id}.svg`,
    status,
    style: 'Kawaii',
    is_featured: false,
    track_inventory: true,
    stock_on_hand: stock,
    low_stock_threshold: 5,
    price: 3.5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const stickersMap = new Map<string, Sticker>();
  for (let i = 1; i <= 15; i++) {
    stickersMap.set(`s-${i}`, mockSticker(`s-${i}`, `Sticker ${i}`));
  }
  // Archived sticker
  stickersMap.set('s-archived', mockSticker('s-archived', 'Archived Sticker', 'archived'));
  // Out of stock sticker
  stickersMap.set('s-out-of-stock', mockSticker('s-out-of-stock', 'Out of Stock', 'active', 0));

  it('validates a correct 10 base + 2 bonus pack', () => {
    const selection: PackSelectionState = {
      baseStickerIds: ['s-1', 's-2', 's-3', 's-4', 's-5', 's-6', 's-7', 's-8', 's-9', 's-10'],
      bonusStickerIds: ['s-11', 's-12'],
    };

    const result = validatePack(selection, DEFAULT_PACK_RULE, stickersMap);
    expect(result.isValid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it('rejects pack with missing base items', () => {
    const selection: PackSelectionState = {
      baseStickerIds: ['s-1', 's-2', 's-3', 's-4', 's-5'], // only 5 base
      bonusStickerIds: ['s-11', 's-12'],
    };

    const result = validatePack(selection, DEFAULT_PACK_RULE, stickersMap);
    expect(result.isValid).toBe(false);
    expect(result.errorCode).toBe('PACK_INCOMPLETE');
    expect(result.errors[0]).toContain('5 more sticker');
  });

  it('rejects pack with too many base items', () => {
    const selection: PackSelectionState = {
      baseStickerIds: ['s-1', 's-2', 's-3', 's-4', 's-5', 's-6', 's-7', 's-8', 's-9', 's-10', 's-11'], // 11
      bonusStickerIds: ['s-12', 's-13'],
    };

    const result = validatePack(selection, DEFAULT_PACK_RULE, stickersMap);
    expect(result.isValid).toBe(false);
    expect(result.errorCode).toBe('PACK_INCOMPLETE');
  });

  it('rejects pack with missing bonus items', () => {
    const selection: PackSelectionState = {
      baseStickerIds: ['s-1', 's-2', 's-3', 's-4', 's-5', 's-6', 's-7', 's-8', 's-9', 's-10'],
      bonusStickerIds: ['s-11'], // only 1 bonus
    };

    const result = validatePack(selection, DEFAULT_PACK_RULE, stickersMap);
    expect(result.isValid).toBe(false);
    expect(result.errorCode).toBe('PACK_INCOMPLETE');
    expect(result.errors[0]).toContain('1 bonus sticker');
  });

  it('rejects duplicate stickers when duplicates are disallowed', () => {
    const selection: PackSelectionState = {
      baseStickerIds: ['s-1', 's-2', 's-3', 's-4', 's-5', 's-6', 's-7', 's-8', 's-9', 's-1'], // duplicate s-1
      bonusStickerIds: ['s-11', 's-12'],
    };

    const result = validatePack(selection, DEFAULT_PACK_RULE, stickersMap);
    expect(result.isValid).toBe(false);
    expect(result.errorCode).toBe('DUPLICATE_SELECTION');
  });

  it('rejects duplicate across base and bonus items', () => {
    const selection: PackSelectionState = {
      baseStickerIds: ['s-1', 's-2', 's-3', 's-4', 's-5', 's-6', 's-7', 's-8', 's-9', 's-10'],
      bonusStickerIds: ['s-1', 's-12'], // s-1 is in both base and bonus
    };

    const result = validatePack(selection, DEFAULT_PACK_RULE, stickersMap);
    expect(result.isValid).toBe(false);
    expect(result.errorCode).toBe('DUPLICATE_SELECTION');
  });

  it('rejects archived stickers', () => {
    const selection: PackSelectionState = {
      baseStickerIds: ['s-1', 's-2', 's-3', 's-4', 's-5', 's-6', 's-7', 's-8', 's-9', 's-archived'],
      bonusStickerIds: ['s-11', 's-12'],
    };

    const result = validatePack(selection, DEFAULT_PACK_RULE, stickersMap);
    expect(result.isValid).toBe(false);
    expect(result.errorCode).toBe('STICKER_UNAVAILABLE');
    expect(result.errors[0]).toContain('no longer active');
  });

  it('rejects out of stock stickers when inventory tracking is active', () => {
    const selection: PackSelectionState = {
      baseStickerIds: ['s-1', 's-2', 's-3', 's-4', 's-5', 's-6', 's-7', 's-8', 's-9', 's-out-of-stock'],
      bonusStickerIds: ['s-11', 's-12'],
    };

    const result = validatePack(selection, DEFAULT_PACK_RULE, stickersMap);
    expect(result.isValid).toBe(false);
    expect(result.errorCode).toBe('STICKER_UNAVAILABLE');
    expect(result.errors[0]).toContain('out of stock');
  });

  it('correctly tracks bonus unlock condition', () => {
    expect(isBonusUnlocked(['s-1', 's-2'])).toBe(false);
    expect(isBonusUnlocked(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'])).toBe(true);
    expect(getRemainingBaseCount(['1', '2', '3'])).toBe(7);
  });
});
