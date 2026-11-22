import { useEffect, useState } from 'react';
import { subscribeToRoti } from '../api/roti.api';
import type { RotiEntry } from '../types/roti.types';
import { computeRotiStats, listRotiFormations } from '../utils/roti.utils';

/**
 * Live ROTI stats. `formation` narrows them to one module; leave it out for
 * every rating (including those from the ROTI page, which have no module).
 */
export const useRotiStats = (formation?: string) => {
  const [entries, setEntries] = useState<RotiEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToRoti(
      (data) => {
        setEntries(data);
        setIsLoading(false);
      },
      (err) => {
        setError(err);
        setIsLoading(false);
      },
    );
    return () => unsubscribe();
  }, []);

  const stats = computeRotiStats(
    formation ? entries.filter((e) => e.formation === formation) : entries,
  );

  return { stats, formations: listRotiFormations(entries), isLoading, error };
};
