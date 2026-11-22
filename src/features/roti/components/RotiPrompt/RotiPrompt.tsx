import { Modal } from "../../../../ui";
import { useRotiEligibility } from "../../hooks/useRotiEligibility";
import { ROTI_TEXTS } from "../../i18n/roti.i18n";
import RotiForm from "../RotiForm/RotiForm";
import { toast } from "react-toastify";
import { useRotiPromptStore } from "../../stores/useRotiPromptStore";

// The pop-up is always English: only the ROTI page offers a language switch.
const t = ROTI_TEXTS.en;

export const ROTI_PAGE_HREF = `${import.meta.env.BASE_URL}#/roti`;

/** End-of-quiz ROTI pop-up, mounted once at the app level. */
export default function RotiPrompt() {
  const isOpen = useRotiPromptStore((s) => s.isOpen);
  const close = useRotiPromptStore((s) => s.close);
  const { canSubmit } = useRotiEligibility();

  const handleSuccess = () => {
    close();
    toast.success(t.form.successToast);
  };

  return (
    <Modal
      // Already rated this month: the pop-up never shows (admins/devs are exempt).
      isOpen={isOpen && canSubmit}
      onClose={close}
      setIsClosed={close}
      title={t.prompt.title}
      hideButtons
      closeOnBackdropClick
    >
      <p>
        {t.prompt.intro}{' '}
        <a href={ROTI_PAGE_HREF} target="_blank" rel="noopener noreferrer">
          {t.prompt.link}
        </a>
      </p>
      <RotiForm source="quiz" onSuccess={handleSuccess} />
    </Modal>
  );
}
