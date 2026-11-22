import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RotiLimitState {
  /** Month key of the last ROTI submitted, per user (uid or "anon"). */
  lastSubmitted: Record<string, string>;
  markSubmitted: (userKey: string, monthKey: string) => void;
}

/**
 * Client-side memory of the monthly limit. It is the only guard for anonymous
 * visitors (best effort), and a fast path for signed-in users, whose limit is
 * also enforced by Firestore rules.
 */
export const useRotiLimitStore = create<RotiLimitState>()(
  persist(
    (set) => ({
      lastSubmitted: {},
      markSubmitted: (userKey, monthKey) =>
        set((s) => ({ lastSubmitted: { ...s.lastSubmitted, [userKey]: monthKey } })),
    }),
    { name: 'roti-limit' },
  ),
);
