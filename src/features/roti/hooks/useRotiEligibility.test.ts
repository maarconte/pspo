import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const auth = vi.hoisted(() => ({
  user: null as { uid: string } | null,
  role: { isAdmin: false, loading: false },
}));

vi.mock('../../auth/stores/useAuthStore', () => ({
  useUserStore: (selector: (s: { user: unknown }) => unknown) => selector({ user: auth.user }),
}));
vi.mock('../../auth/hooks/useUserRole', () => ({ useUserRole: () => auth.role }));

import { useRotiLimitStore } from '../stores/useRotiLimitStore';
import { useRotiEligibility } from './useRotiEligibility';

describe('useRotiEligibility', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-22T10:00:00Z'));
    auth.user = null;
    auth.role = { isAdmin: false, loading: false };
    useRotiLimitStore.setState({ lastSubmitted: {} });
  });
  afterEach(() => vi.useRealTimers());

  it('lets an anonymous visitor submit once, then blocks until next month', () => {
    const { result } = renderHook(() => useRotiEligibility());
    expect(result.current.canSubmit).toBe(true);

    act(() => result.current.markSubmitted());
    expect(result.current.canSubmit).toBe(false);

    vi.setSystemTime(new Date('2026-12-01T00:00:00Z'));
    const next = renderHook(() => useRotiEligibility());
    expect(next.result.current.canSubmit).toBe(true);
  });

  it('tracks each signed-in user separately from visitors', () => {
    auth.user = { uid: 'u1' };
    const u1 = renderHook(() => useRotiEligibility());
    act(() => u1.result.current.markSubmitted());
    expect(u1.result.current.canSubmit).toBe(false);

    auth.user = { uid: 'u2' };
    expect(renderHook(() => useRotiEligibility()).result.current.canSubmit).toBe(true);

    auth.user = null;
    expect(renderHook(() => useRotiEligibility()).result.current.canSubmit).toBe(true);
  });

  it('never blocks admins and devs', () => {
    auth.user = { uid: 'admin' };
    auth.role = { isAdmin: true, loading: false };
    const { result } = renderHook(() => useRotiEligibility());
    act(() => result.current.markSubmitted());
    expect(result.current.isExempt).toBe(true);
    expect(result.current.canSubmit).toBe(true);
  });

  it('reports loading only for a signed-in user whose role is pending', () => {
    auth.role = { isAdmin: false, loading: true };
    expect(renderHook(() => useRotiEligibility()).result.current.isLoading).toBe(false);
    auth.user = { uid: 'u1' };
    expect(renderHook(() => useRotiEligibility()).result.current.isLoading).toBe(true);
  });
});
