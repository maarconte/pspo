import { useEffect, useState } from 'react';
import { subscribeToRoti } from '../api/roti.api';
import type { RotiStats } from '../types/roti.types';
import { computeRotiStats } from '../utils/roti.utils';

export const useRotiStats = () => {
  const [stats, setStats] = useState<RotiStats>(() => computeRotiStats([]));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToRoti(
      (entries) => {
        setStats(computeRotiStats(entries));
        setIsLoading(false);
      },
      (err) => {
        setError(err);
        setIsLoading(false);
      },
    );
    return () => unsubscribe();
  }, []);

  return { stats, isLoading, error };
};
