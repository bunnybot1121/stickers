import { describe, it, expect, beforeEach } from 'vitest';
import { storeService } from '../src/services/storeService';

describe('StoreService Sticker Upload and Management', () => {
  beforeEach(async () => {
    await storeService.deleteAllStickers();
  });

  it('successfully saves a new sticker with image data URL', async () => {
    const saved = await storeService.saveSticker({
      name: 'Test Matcha Cat',
      description: 'A cute test cat sticker',
      image_path: 'data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADwAQCdASoBAAEAAkA4JaQAA3AA/vuUAAA=',
      style: 'Kawaii',
      stock_on_hand: 25,
      price: 3.5,
    });

    expect(saved).toBeDefined();
    expect(saved.id).toBeDefined();
    expect(saved.name).toBe('Test Matcha Cat');
    expect(saved.slug).toBe('test-matcha-cat');

    const all = await storeService.getStickers({ status: 'all' });
    expect(all.length).toBe(1);
    expect(all[0].name).toBe('Test Matcha Cat');
  });

  it('updates an existing sticker without duplicating', async () => {
    const first = await storeService.saveSticker({
      name: 'Initial Sticker',
      price: 3.0,
    });

    const updated = await storeService.saveSticker({
      id: first.id,
      name: 'Updated Sticker Name',
      price: 4.5,
    });

    expect(updated.id).toBe(first.id);
    expect(updated.name).toBe('Updated Sticker Name');

    const all = await storeService.getStickers({ status: 'all' });
    expect(all.length).toBe(1);
    expect(all[0].name).toBe('Updated Sticker Name');
  });
});
