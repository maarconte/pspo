import "./InfoPopup.scss";

import { User, ChartLine, Bookmark } from "lucide-react";

import { Button } from "../../../../ui";
import { useInfoPopupStore } from "../../../../stores/useInfoPopupStore";

export function InfoPopup() {
  const isOpen = useInfoPopupStore((s) => s.isOpen);
  const dismiss = useInfoPopupStore((s) => s.dismiss);
  const isExpired = useInfoPopupStore((s) => s.isExpired);

  if (!isOpen || isExpired()) return null;

  return (
    <>
      <div className="info-popup__backdrop" onClick={dismiss} />
      <div className="info-popup" role="dialog" aria-modal="true" aria-labelledby="info-popup-title">

        <h2 id="info-popup-title" className="info-popup__title">
          Avez-vous vu ?
        </h2>
        <p className="info-popup__body">
          Maintenant vous pouvez vous connecter pour retrouver vos quizz
          terminés, vos erreurs, vos marque-pages et vos statistiques.

        </p>
                <div className="d-flex gap-1">
        <div className="info-popup__icon-wrapper">
          <User size={28} strokeWidth={1.8} className="info-popup__icon" />
        </div>

        <div className="info-popup__icon-wrapper">
          <Bookmark size={28} strokeWidth={1.8} className="info-popup__icon" />
          </div>
              <div className="info-popup__icon-wrapper">
          <ChartLine size={28} strokeWidth={1.8} className="info-popup__icon" />
        </div>
        </div>
          <p className="info-popup__highlight">
            Pratique pour voir votre progression&nbsp;!
          </p>
        <div className="info-popup__footer">
          <Button
            label="J'ai compris"
            onClick={dismiss}
          />
        </div>
      </div>
    </>
  );
}
