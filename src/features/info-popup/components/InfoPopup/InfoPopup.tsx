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
          Did you know?
        </h2>
        <p className="info-popup__body">
          You can now log in to find your completed quizzes, mistakes, bookmarks, and statistics.
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
          Track your progress easily!
        </p>
        <div className="info-popup__footer">
          <Button
            label="Got it"
            onClick={dismiss}
          />
        </div>
      </div>
    </>
  );
}
