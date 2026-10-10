import { describe, it, expect } from 'vitest';
import {
  calculatePrintDemand,
  sanitizeCsvField,
  generatePrintQuantitiesCsv,
  generateOrderDetailsCsv,
  generateOrdersSummaryCsv,
} from '../src/lib/printStudio';
import { Order } from '../src/types';

describe('Print Studio Demand & Allocation', () => {
  const createMockOrder = (
    id: string,
    orderNumber: string,
    status: Order['status'],
    items: { id: string; stickerId: string; name: string; qty: number; role: 'base' | 'bonus' }[]
  ): Order => ({
    id,
    order_number: orderNumber,
    customer_name: 'Sticker Fan',
    customer_contact: 'fan@example.com',
    status,
    base_quantity: 10,
    bonus_quantity: 2,
    total_quantity: 12,
    submitted_at: '2026-10-10T12:00:00Z',
    updated_at: '2026-10-10T12:00:00Z',
    items: items.map((i) => ({
      id: i.id,
      order_id: id,
      sticker_id: i.stickerId,
      sticker_name_snapshot: i.name,
      image_path_snapshot: `/stickers/${i.stickerId}.svg`,
      item_role: i.role,
      quantity: i.qty,
      unit_price: 3.5,
      created_at: '2026-10-10T12:00:00Z',
    })),
  });

  it('aggregates print demand correctly across multiple orders', () => {
    // Order A: Python x 1, Cat x 1
    // Order B: Python x 1, Cart x 1
    // Order C: Python x 1, Cat x 1
    const orderA = createMockOrder('ord-a', 'ORD-001', 'submitted', [
      { id: 'item-1', stickerId: 'python', name: 'Python Power', qty: 1, role: 'base' },
      { id: 'item-2', stickerId: 'cat', name: 'Sleepy Cat', qty: 1, role: 'base' },
    ]);
    const orderB = createMockOrder('ord-b', 'ORD-002', 'submitted', [
      { id: 'item-3', stickerId: 'python', name: 'Python Power', qty: 1, role: 'base' },
      { id: 'item-4', stickerId: 'cart', name: 'Pixel Cart', qty: 1, role: 'base' },
    ]);
    const orderC = createMockOrder('ord-c', 'ORD-003', 'submitted', [
      { id: 'item-5', stickerId: 'python', name: 'Python Power', qty: 1, role: 'base' },
      { id: 'item-6', stickerId: 'cat', name: 'Sleepy Cat', qty: 1, role: 'bonus' },
    ]);

    const result = calculatePrintDemand([orderA, orderB, orderC]);

    expect(result.totalCopies).toBe(6);
    expect(result.distinctDesigns).toBe(3);

    const pythonDemand = result.demand.find((d) => d.stickerId === 'python');
    expect(pythonDemand?.quantityRequired).toBe(3);
    expect(pythonDemand?.contributingOrders.length).toBe(3);

    const catDemand = result.demand.find((d) => d.stickerId === 'cat');
    expect(catDemand?.quantityRequired).toBe(2);

    const cartDemand = result.demand.find((d) => d.stickerId === 'cart');
    expect(cartDemand?.quantityRequired).toBe(1);
  });

  it('excludes cancelled orders from print demand', () => {
    const activeOrder = createMockOrder('ord-1', 'ORD-001', 'ready_to_print', [
      { id: 'item-1', stickerId: 'python', name: 'Python Power', qty: 2, role: 'base' },
    ]);
    const cancelledOrder = createMockOrder('ord-2', 'ORD-002', 'cancelled', [
      { id: 'item-2', stickerId: 'python', name: 'Python Power', qty: 5, role: 'base' },
    ]);

    const result = calculatePrintDemand([activeOrder, cancelledOrder]);
    expect(result.totalCopies).toBe(2);
    expect(result.demand[0].quantityRequired).toBe(2);
  });

  it('prevents double-counting already allocated order items', () => {
    const order = createMockOrder('ord-1', 'ORD-001', 'ready_to_print', [
      { id: 'item-1', stickerId: 'python', name: 'Python Power', qty: 3, role: 'base' },
    ]);

    // Suppose item-1 has already been allocated 2 copies in a previous print batch
    const existingAllocations = new Map<string, number>();
    existingAllocations.set('item-1', 2);

    const result = calculatePrintDemand([order], existingAllocations);

    // Remaining unallocated demand should only be 1
    expect(result.totalCopies).toBe(1);
    expect(result.demand[0].quantityRequired).toBe(1);
  });

  it('sanitizes against spreadsheet formula injection in CSV exports', () => {
    // Formula characters: =, +, -, @, \t, \r
    expect(sanitizeCsvField('=SUM(A1:B10)')).toBe('"\'=SUM(A1:B10)"');
    expect(sanitizeCsvField('+123456')).toBe('"\'+123456"');
    expect(sanitizeCsvField('-cmd|...')).toBe('"\'-cmd|..."');
    expect(sanitizeCsvField('@alert')).toBe('"\'@alert"');
    expect(sanitizeCsvField('Normal Name')).toBe('"Normal Name"');
    expect(sanitizeCsvField('Quotes "Here"')).toBe('"Quotes ""Here"""');
  });

  it('generates valid Print Quantities CSV with proper headers', () => {
    const demand = [
      {
        stickerId: 'python-1',
        stickerName: 'Python Power',
        imagePath: '/stickers/python.svg',
        quantityRequired: 5,
        contributingOrders: [],
      },
    ];

    const csv = generatePrintQuantitiesCsv('PB-20261010-001', demand);
    expect(csv).toContain('batch_number,sticker_id,sticker_name,quantity_required,quantity_printed,image_path');
    expect(csv).toContain('"PB-20261010-001","python-1","Python Power","5","0"');
  });
});
