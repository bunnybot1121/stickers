import { OrderStatus } from '../types';

export const ALLOWED_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  submitted: ['reviewed', 'ready_to_print', 'cancelled', 'on_hold'],
  reviewed: ['ready_to_print', 'cancelled', 'on_hold'],
  ready_to_print: ['printing', 'cancelled', 'on_hold'],
  printing: ['printed', 'cancelled', 'on_hold'],
  printed: ['packed', 'cancelled', 'on_hold'],
  packed: ['completed', 'cancelled', 'on_hold'],
  on_hold: ['submitted', 'reviewed', 'ready_to_print', 'cancelled'],
  completed: [],
  cancelled: [],
};

export function canTransitionStatus(currentStatus: OrderStatus, targetStatus: OrderStatus): boolean {
  if (currentStatus === targetStatus) return true;
  const allowed = ALLOWED_STATUS_TRANSITIONS[currentStatus] ?? [];
  return allowed.includes(targetStatus);
}

export const STATUS_LABELS: Record<OrderStatus, { label: string; bg: string; text: string; border: string }> = {
  submitted: { label: 'Submitted', bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-500' },
  reviewed: { label: 'Reviewed', bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-500' },
  ready_to_print: { label: 'Ready to Print', bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500' },
  printing: { label: 'Printing', bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-500' },
  printed: { label: 'Printed', bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-500' },
  packed: { label: 'Packed', bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-500' },
  completed: { label: 'Completed', bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-600' },
  cancelled: { label: 'Cancelled', bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-500' },
  on_hold: { label: 'On Hold', bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-500' },
};
