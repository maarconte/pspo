import { useUserRole } from '../../auth/hooks/useUserRole';
import { useUserStore } from '../../auth/stores/useAuthStore';
import { useRotiLimitStore } from '../stores/useRotiLimitStore';
import { getRotiMonthKey } from '../utils/roti.utils';

const ANONYMOUS_KEY = 'anon';

/** One ROTI per month and per user (signed in or not); admins and devs are exempt. */
export const useRotiEligibility = () => {
  const user = useUserStore((s) => s.user);
  const { isAdmin, loading } = useUserRole();
  const userKey = user?.uid ?? ANONYMOUS_KEY;
  const monthKey = getRotiMonthKey();
  const lastSubmitted = useRotiLimitStore((s) => s.lastSubmitted[userKey]);
  const markSubmittedInStore = useRotiLimitStore((s) => s.markSubmitted);

  return {
    isExempt: isAdmin,
    /** Role still loading for a signed-in user: exemption not known yet. */
    isLoading: !!user && loading,
    canSubmit: isAdmin || lastSubmitted !== monthKey,
    markSubmitted: () => markSubmittedInStore(userKey, monthKey),
  };
};
