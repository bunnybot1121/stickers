import { PackRule, PackSelectionState, Sticker } from '../types';

export const DEFAULT_PACK_RULE: PackRule = {
  id: 'default-10-plus-2',
  name: '10 + 2 Collector Pack',
  base_quantity: 10,
  bonus_quantity: 2,
  bonus_mode: 'customer_choice',
  allow_duplicate_stickers: false,
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export interface PackValidationResult {
  isValid: boolean;
  errors: string[];
  errorCode?: 'PACK_INCOMPLETE' | 'DUPLICATE_SELECTION' | 'STICKER_UNAVAILABLE' | 'INVALID_STICKER' | 'VALIDATION_ERROR';
}

export function isBonusUnlocked(baseStickerIds: string[], rule: PackRule = DEFAULT_PACK_RULE): boolean {
  return baseStickerIds.length >= rule.base_quantity;
}

export function getRemainingBaseCount(baseStickerIds: string[], rule: PackRule = DEFAULT_PACK_RULE): number {
  return Math.max(0, rule.base_quantity - baseStickerIds.length);
}

export function getRemainingBonusCount(bonusStickerIds: string[], rule: PackRule = DEFAULT_PACK_RULE): number {
  return Math.max(0, rule.bonus_quantity - bonusStickerIds.length);
}

export function isPackComplete(selection: PackSelectionState, rule: PackRule = DEFAULT_PACK_RULE): boolean {
  return (
    selection.baseStickerIds.length === rule.base_quantity &&
    selection.bonusStickerIds.length === rule.bonus_quantity
  );
}

export function validatePack(
  selection: PackSelectionState,
  rule: PackRule = DEFAULT_PACK_RULE,
  stickersMap?: Map<string, Sticker>
): PackValidationResult {
  const errors: string[] = [];

  // 1. Check Base Quantity
  if (selection.baseStickerIds.length < rule.base_quantity) {
    const missing = rule.base_quantity - selection.baseStickerIds.length;
    errors.push(`Please choose ${missing} more sticker${missing > 1 ? 's' : ''} to complete your base pack.`);
    return { isValid: false, errors, errorCode: 'PACK_INCOMPLETE' };
  }

  if (selection.baseStickerIds.length > rule.base_quantity) {
    errors.push(`You have selected too many base stickers (limit is ${rule.base_quantity}).`);
    return { isValid: false, errors, errorCode: 'PACK_INCOMPLETE' };
  }

  // 2. Check Bonus Quantity
  if (selection.bonusStickerIds.length < rule.bonus_quantity) {
    const missing = rule.bonus_quantity - selection.bonusStickerIds.length;
    errors.push(`Please choose ${missing} bonus sticker${missing > 1 ? 's' : ''} to claim your +2 reward.`);
    return { isValid: false, errors, errorCode: 'PACK_INCOMPLETE' };
  }

  if (selection.bonusStickerIds.length > rule.bonus_quantity) {
    errors.push(`You have selected too many bonus stickers (limit is ${rule.bonus_quantity}).`);
    return { isValid: false, errors, errorCode: 'PACK_INCOMPLETE' };
  }

  // 3. Duplicate checks
  const allIds = [...selection.baseStickerIds, ...selection.bonusStickerIds];
  if (!rule.allow_duplicate_stickers) {
    const uniqueIds = new Set(allIds);
    if (uniqueIds.size !== allIds.length) {
      errors.push('Duplicate stickers are not permitted in this pack offer.');
      return { isValid: false, errors, errorCode: 'DUPLICATE_SELECTION' };
    }
  }

  // 4. Availability & status checks (if stickers catalogue map is provided)
  if (stickersMap) {
    for (const id of allIds) {
      const sticker = stickersMap.get(id);
      if (!sticker) {
        errors.push(`Sticker ID "${id}" could not be found in the active catalogue.`);
        return { isValid: false, errors, errorCode: 'INVALID_STICKER' };
      }

      if (sticker.status !== 'active') {
        errors.push(`Sticker "${sticker.name}" is no longer active or has been archived.`);
        return { isValid: false, errors, errorCode: 'STICKER_UNAVAILABLE' };
      }

      if (sticker.track_inventory && (sticker.stock_on_hand ?? 0) < 1) {
        errors.push(`Sticker "${sticker.name}" is currently out of stock.`);
        return { isValid: false, errors, errorCode: 'STICKER_UNAVAILABLE' };
      }
    }
  }

  return { isValid: true, errors: [] };
}
