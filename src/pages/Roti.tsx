import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  DEFAULT_ROTI_LANG,
  ROTI_TEXTS,
  RotiForm,
  type RotiLang,
} from '../features/roti';
import SegmentedControl from '../ui/SegmentedControl/SegmentedControl';
import './Roti.scss';

const LANGUAGE_OPTIONS = [
  { label: 'English', value: 'en' },
  { label: 'Français', value: 'fr' },
];

export default function Roti() {
  // English by default; this page is the only one offering a language switch.
  const [lang, setLang] = useState<RotiLang>(DEFAULT_ROTI_LANG);
  const t = ROTI_TEXTS[lang].page;

  return (
    <div className="roti-page" lang={lang}>
      <div className="container">
        <div className="roti-page__language" aria-label={t.languageSwitch}>
          <SegmentedControl
            name="roti-language"
            options={LANGUAGE_OPTIONS}
            value={lang}
            onChange={(value) => setLang(value as RotiLang)}
          />
        </div>

        <header className="roti-page__header">
          <h1>{t.title}</h1>
          <p className="roti-page__subtitle">{t.subtitle}</p>
        </header>

        <section>
          <h2>{t.goalTitle}</h2>
          <p>{t.goal}</p>
        </section>

        <section>
          <h2>{t.howTitle}</h2>
          <ol>
            {t.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section>
          <h2>{t.furtherTitle}</h2>
          <p>{t.further}</p>
        </section>

        <section className="roti-page__vote">
          <h2>{t.voteTitle}</h2>
          <RotiForm
            source="page"
            lang={lang}
            submitLabel={t.voteSubmit}
            onSuccess={() => toast.success(ROTI_TEXTS[lang].form.successToast)}
          />
        </section>
      </div>
    </div>
  );
}
