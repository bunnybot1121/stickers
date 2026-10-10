import { describe, it, expect } from 'vitest';
import { canTransitionStatus, ALLOWED_STATUS_TRANSITIONS } from '../src/lib/orderWorkflow';

describe('Order Status Workflow Transitions', () => {
  it('allows valid forward transitions', () => {
    expect(canTransitionStatus('submitted', 'reviewed')).toBe(true);
    expect(canTransitionStatus('reviewed', 'ready_to_print')).toBe(true);
    expect(canTransitionStatus('ready_to_print', 'printing')).toBe(true);
    expect(canTransitionStatus('printing', 'printed')).toBe(true);
    expect(canTransitionStatus('printed', 'packed')).toBe(true);
    expect(canTransitionStatus('packed', 'completed')).toBe(true);
  });

  it('allows cancellation and on_hold from active statuses', () => {
    expect(canTransitionStatus('submitted', 'cancelled')).toBe(true);
    expect(canTransitionStatus('reviewed', 'on_hold')).toBe(true);
    expect(canTransitionStatus('ready_to_print', 'cancelled')).toBe(true);
    expect(canTransitionStatus('printing', 'on_hold')).toBe(true);
  });

  it('prohibits invalid backwards or illegal transitions', () => {
    expect(canTransitionStatus('completed', 'submitted')).toBe(false);
    expect(canTransitionStatus('cancelled', 'printing')).toBe(false);
    expect(canTransitionStatus('submitted', 'completed')).toBe(false); // cannot jump directly to completed
  });

  it('allows self transition (no-op)', () => {
    expect(canTransitionStatus('submitted', 'submitted')).toBe(true);
    expect(canTransitionStatus('printing', 'printing')).toBe(true);
  });
});
