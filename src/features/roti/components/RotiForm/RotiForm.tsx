import './style.scss';

import { useEffect, useId, useState } from 'react';
import { Button } from '../../../../ui';
import { useSubmitRoti } from '../../hooks/useSubmitRoti';
import {
  ROTI_COMMENT_MAX_LENGTH,
  ROTI_SCORES,
  ROTI_SCORE_LABELS,
  type RotiScore,
  type RotiSource,
} from '../../types/roti.types';
import { canComment } from '../../utils/roti.utils';

interface RotiFormProps {
  source: RotiSource;
  moduleId?: string | null;
  onSuccess?: () => void;
  submitLabel?: string;
}

/** 5-step gauge (required) + optional comment for scores <= 3. */
export default function RotiForm({
  source,
  moduleId,
  onSuccess,
  submitLabel = 'Valider',
}: RotiFormProps) {
  const [score, setScore] = useState<RotiScore | null>(null);
  const [state, formAction, isPending] = useSubmitRoti(source, moduleId);
  const groupId = useId();

  useEffect(() => {
    if (state.status === 'success') onSuccess?.();
  }, [state.status, onSuccess]);

  return (
    <form action={formAction} className="roti-form">
      <fieldset className="roti-form__gauge">
        <legend className="visually-hidden">Note du ROTI</legend>
        <div className="roti-form__steps">
          {ROTI_SCORES.map((value) => (
            <label
              key={value}
              data-score={value}
              className={`roti-form__step ${score !== null && value <= score ? 'is-filled' : ''}`}
            >
              <input
                type="radio"
                name="score"
                value={value}
                checked={score === value}
                onChange={() => setScore(value)}
                aria-describedby={`${groupId}-legend`}
              />
              <span>{value}</span>
            </label>
          ))}
        </div>
        <div id={`${groupId}-legend`} className="roti-form__legend">
          <span>{ROTI_SCORE_LABELS[1]}</span>
          <span>{ROTI_SCORE_LABELS[5]}</span>
        </div>
      </fieldset>

      {canComment(score) && (
        <label className="roti-form__comment">
          <span>Commentaire (facultatif)</span>
          <textarea
            name="comment"
            rows={3}
            maxLength={ROTI_COMMENT_MAX_LENGTH}
            placeholder="Qu'est-ce qui aurait pu être mieux ?"
          />
        </label>
      )}

      {state.status === 'error' && (
        <p className="roti-form__error" role="alert">
          {state.error}
        </p>
      )}

      <Button
        label={submitLabel}
        buttonType="submit"
        disabled={score === null}
        isLoader={isPending}
      />
    </form>
  );
}
