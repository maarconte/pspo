import './style.scss';

import { useEffect, useId, useState } from 'react';
import { Button } from '../../../../ui';
import { useRotiEligibility } from '../../hooks/useRotiEligibility';
import { useSubmitRoti } from '../../hooks/useSubmitRoti';
import {
  ROTI_COMMENT_MAX_LENGTH,
  ROTI_SCORES,
  type RotiScore,
  type RotiSource,
} from '../../types/roti.types';
import { DEFAULT_ROTI_LANG, ROTI_TEXTS, type RotiLang } from '../../i18n/roti.i18n';
import { canComment } from '../../utils/roti.utils';

interface RotiFormProps {
  source: RotiSource;
  /** Formation of the quiz that was just completed, when there is one. */
  formation?: string | null;
  onSuccess?: () => void;
  lang?: RotiLang;
  submitLabel?: string;
}

/** 5-step gauge (required) + optional comment for scores <= 3. */
export default function RotiForm({
  source,
  formation,
  onSuccess,
  lang = DEFAULT_ROTI_LANG,
  submitLabel,
}: RotiFormProps) {
  const t = ROTI_TEXTS[lang].form;
  const [score, setScore] = useState<RotiScore | null>(null);
  const [state, formAction, isPending] = useSubmitRoti(source, formation);
  const groupId = useId();
  const { canSubmit, isLoading, markSubmitted } = useRotiEligibility();

  useEffect(() => {
    // Marked here (not in the action) so the form is still mounted to call
    // onSuccess before it switches to the "already submitted" message.
    if (state.status === 'success') {
      markSubmitted();
      onSuccess?.();
    } else if (state.error === 'alreadySubmitted') {
      markSubmitted();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (!canSubmit) {
    return <p className="roti-form__done">{t.alreadySubmitted}</p>;
  }

  return (
    <form action={formAction} className="roti-form">
      <fieldset className="roti-form__gauge">
        <legend className="visually-hidden">{t.ratingGroup}</legend>
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
          <span>{t.lowLabel}</span>
          <span>{t.highLabel}</span>
        </div>
      </fieldset>

      {canComment(score) && (
        <label className="roti-form__comment">
          <span>{t.commentLabel}</span>
          <textarea
            name="comment"
            rows={3}
            maxLength={ROTI_COMMENT_MAX_LENGTH}
            placeholder={t.commentPlaceholder}
          />
        </label>
      )}

      {state.status === 'error' && (
        <p className="roti-form__error" role="alert">
          {state.error && t.errors[state.error]}
        </p>
      )}

      <Button
        label={submitLabel ?? t.submit}
        buttonType="submit"
        disabled={score === null || isLoading}
        isLoader={isPending}
      />
    </form>
  );
}
