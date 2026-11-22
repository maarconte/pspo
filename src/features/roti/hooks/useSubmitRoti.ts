import { useActionState } from 'react';
import { RotiAlreadySubmittedError, submitRoti } from '../api/roti.api';
import { useRotiEligibility } from './useRotiEligibility';
import type { RotiScore, RotiSource } from '../types/roti.types';
import { isRotiScore } from '../utils/roti.utils';

export interface SubmitRotiState {
  status: 'idle' | 'success' | 'error';
  /** Error code; the form maps it to a translated message. */
  error?: 'noScore' | 'saveFailed' | 'alreadySubmitted';
}

/**
 * Form action state for a ROTI submission (monthly limit: see useRotiEligibility). The form must provide `score`
 * and optionally `comment`; `source` and `formation` are fixed by the caller.
 */
export const useSubmitRoti = (source: RotiSource, formation?: string | null) => {
  const { isExempt, canSubmit } = useRotiEligibility();

  return useActionState<SubmitRotiState, FormData>(async (_prev, formData) => {
    if (!canSubmit) {
      return { status: 'error', error: 'alreadySubmitted' };
    }
    const score = Number(formData.get('score'));
    if (!isRotiScore(score)) {
      return { status: 'error', error: 'noScore' };
    }
    try {
      await submitRoti({
        score: score as RotiScore,
        comment: String(formData.get('comment') ?? ''),
        source,
        formation,
        unlimited: isExempt,
      });
      return { status: 'success' };
    } catch (error) {
      if (error instanceof RotiAlreadySubmittedError) {
        return { status: 'error', error: 'alreadySubmitted' };
      }
      return { status: 'error', error: 'saveFailed' };
    }
  }, { status: 'idle' });
};
