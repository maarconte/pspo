import { Modal } from "../../../../ui";
import RotiForm from "../RotiForm/RotiForm";
import { toast } from "react-toastify";
import { useRotiPromptStore } from "../../stores/useRotiPromptStore";

export const ROTI_PAGE_HREF = `${import.meta.env.BASE_URL}#/roti`;

/** End-of-quiz ROTI pop-up, mounted once at the app level. */
export default function RotiPrompt() {
  const isOpen = useRotiPromptStore((s) => s.isOpen);
  const close = useRotiPromptStore((s) => s.close);

  const handleSuccess = () => {
    close();
    toast.success("La note de votre ROTI est bien prise en compte, merci !");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      setIsClosed={close}
      title="ROTI !"
      hideButtons
      closeOnBackdropClick
    >
      <p>
        Prenons justement le temps de faire une petite{" "}
        <strong>rétrospective</strong> : un ROTI ! Tu ne connais pas ?{" "}
        <a href={ROTI_PAGE_HREF} target="_blank" rel="noopener noreferrer">
          Je t'explique ici ;)
        </a>
      </p>
      <RotiForm source="quiz" onSuccess={handleSuccess} />
    </Modal>
  );
}
