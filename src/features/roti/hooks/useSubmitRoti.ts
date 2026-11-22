import { useActionState } from 'react';
import { submitRoti } from '../api/roti.api';
import type { RotiScore, RotiSource } from '../types/roti.types';
import { isRotiScore } from '../utils/roti.utils';

export interface SubmitRotiState {
  status: 'idle' | 'success' | 'error';
  /** Error code; the form maps it to a translated message. */
  error?: 'noScore' | 'saveFailed';
}

/**
 * Form action state for a ROTI submission. The form must provide `score`
 * and optionally `comment`; `source` and `moduleId` are fixed by the caller.
 */
export const useSubmitRoti = (source: RotiSource, moduleId?: string | null) =>
  useActionState<SubmitRotiState, FormData>(async (_prev, formData) => {
    const score = Number(formData.get('score'));
    if (!isRotiScore(score)) {
      return { status: 'error', error: 'noScore' };
    }
    try {
      await submitRoti({
        score: score as RotiScore,
        comment: String(formData.get('comment') ?? ''),
        source,
        moduleId,
      });
      return { status: 'success' };
    } catch {
      return { status: 'error', error: 'saveFailed' };
    }
  }, { status: 'idle' });
