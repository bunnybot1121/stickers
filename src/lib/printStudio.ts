import { Order, OrderItem, PrintBatch } from '../types';

export interface AggregatedPrintDemand {
  stickerId: string;
  stickerName: string;
  imagePath: string;
  quantityRequired: number;
  contributingOrders: {
    orderId: string;
    orderNumber: string;
    quantity: number;
    itemRole: 'base' | 'bonus';
  }[];
}

/**
 * Escapes values for safe CSV output and defends against spreadsheet formula injection.
 * (Disallows executable formulas starting with =, +, -, @, \t, \r)
 */
export function sanitizeCsvField(val: unknown): string {
  if (val === null || val === undefined) return '""';
  let str = String(val).trim();

  // Guard against CSV formula injection
  const formulaChars = ['=', '+', '-', '@', '\t', '\r'];
  if (formulaChars.some((char) => str.startsWith(char))) {
    str = `'${str}`;
  }

  // Escape inner double quotes by doubling them
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * Calculates aggregated print demand across selected orders,
 * excluding cancelled orders and taking into account existing allocations.
 */
export function calculatePrintDemand(
  orders: Order[],
  existingAllocations: Map<string, number> = new Map() // order_item_id -> allocated_quantity
): {
  demand: AggregatedPrintDemand[];
  totalCopies: number;
  distinctDesigns: number;
} {
  const demandMap = new Map<string, AggregatedPrintDemand>();
  let totalCopies = 0;

  // Filter out cancelled orders
  const eligibleOrders = orders.filter((o) => o.status !== 'cancelled');

  for (const order of eligibleOrders) {
    if (!order.items) continue;

    for (const item of order.items) {
      const alreadyAllocated = existingAllocations.get(item.id) ?? 0;
      const unallocated = Math.max(0, item.quantity - alreadyAllocated);

      if (unallocated > 0) {
        totalCopies += unallocated;

        if (!demandMap.has(item.sticker_id)) {
          demandMap.set(item.sticker_id, {
            stickerId: item.sticker_id,
            stickerName: item.sticker_name_snapshot,
            imagePath: item.image_path_snapshot,
            quantityRequired: 0,
            contributingOrders: [],
          });
        }

        const record = demandMap.get(item.sticker_id)!;
        record.quantityRequired += unallocated;
        record.contributingOrders.push({
          orderId: order.id,
          orderNumber: order.order_number,
          quantity: unallocated,
          itemRole: item.item_role,
        });
      }
    }
  }

  const demand = Array.from(demandMap.values()).sort((a, b) => b.quantityRequired - a.quantityRequired);

  return {
    demand,
    totalCopies,
    distinctDesigns: demand.length,
  };
}

/**
 * Generates RFC 4180 compliant CSV for Print Quantities
 */
export function generatePrintQuantitiesCsv(
  batchNumber: string,
  demands: AggregatedPrintDemand[]
): string {
  const headers = ['batch_number', 'sticker_id', 'sticker_name', 'quantity_required', 'quantity_printed', 'image_path'];
  const rows = demands.map((d) => [
    sanitizeCsvField(batchNumber),
    sanitizeCsvField(d.stickerId),
    sanitizeCsvField(d.stickerName),
    sanitizeCsvField(d.quantityRequired),
    sanitizeCsvField(0), // initial printed count
    sanitizeCsvField(d.imagePath),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}

/**
 * Generates RFC 4180 compliant CSV for Order Details
 */
export function generateOrderDetailsCsv(orders: Order[]): string {
  const headers = [
    'order_number',
    'submitted_at',
    'customer_name',
    'customer_contact',
    'status',
    'sticker_id',
    'sticker_name',
    'item_role',
    'quantity',
  ];

  const rows: string[][] = [];

  for (const order of orders) {
    if (!order.items || order.items.length === 0) {
      rows.push([
        sanitizeCsvField(order.order_number),
        sanitizeCsvField(order.submitted_at),
        sanitizeCsvField(order.customer_name),
        sanitizeCsvField(order.customer_contact),
        sanitizeCsvField(order.status),
        sanitizeCsvField(''),
        sanitizeCsvField(''),
        sanitizeCsvField(''),
        sanitizeCsvField(0),
      ]);
    } else {
      for (const item of order.items) {
        rows.push([
          sanitizeCsvField(order.order_number),
          sanitizeCsvField(order.submitted_at),
          sanitizeCsvField(order.customer_name),
          sanitizeCsvField(order.customer_contact),
          sanitizeCsvField(order.status),
          sanitizeCsvField(item.sticker_id),
          sanitizeCsvField(item.sticker_name_snapshot),
          sanitizeCsvField(item.item_role),
          sanitizeCsvField(item.quantity),
        ]);
      }
    }
  }

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}

/**
 * Generates RFC 4180 compliant CSV for Orders Summary
 */
export function generateOrdersSummaryCsv(orders: Order[]): string {
  const headers = [
    'order_number',
    'submitted_at',
    'customer_name',
    'status',
    'base_quantity',
    'bonus_quantity',
    'total_quantity',
  ];

  const rows = orders.map((o) => [
    sanitizeCsvField(o.order_number),
    sanitizeCsvField(o.submitted_at),
    sanitizeCsvField(o.customer_name),
    sanitizeCsvField(o.status),
    sanitizeCsvField(o.base_quantity),
    sanitizeCsvField(o.bonus_quantity),
    sanitizeCsvField(o.total_quantity),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}
