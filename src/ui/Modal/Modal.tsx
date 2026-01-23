import "./style.scss";

import { Button_Style, Button_Type } from "../Button/Button.types";
import { FC, useEffect } from "react";

import Button from "../Button/Button";
import { X } from "lucide-react";

type ModalProps = {
  children?: React.ReactNode;
  type?: "info" | "success" | "error" | "warning";
  title?: string;
  isOpen: boolean;
  setIsClosed: (isOpen: boolean) => void;
  onClose: (event: React.MouseEvent) => void;
  onConfirm?: (event: React.MouseEvent) => void;
  labelOnConfirm?: string;
  labelOnCancel?: string;
  confirmButtonDisabled?: boolean;
  infoModal?: boolean;
  closeOnBackdropClick?: boolean;
};
const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  type = "info",
  children,
  onConfirm,
  labelOnConfirm,
  labelOnCancel,
  confirmButtonDisabled,
  infoModal = false,
  setIsClosed,
  closeOnBackdropClick,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose(event as unknown as React.MouseEvent);
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    // Cleanup the event listener when the component unmounts or `isOpen` changes
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleClose = (event: React.MouseEvent) => {
    onClose(event);
  };
  const handleConfirm = async (event: React.MouseEvent) => {
    if (onConfirm) {
      try {
        await onConfirm(event);
      } catch (error) {
        // Handle the error from onConfirm here
        console.error("Error during confirmation:", error);
      }
    } else {
      // setModalOpen(false);
      // onClose();
    }
  };
  return (
    <>
      {isOpen ? (
        <div>
          <div className="modal--backdrop" onClick={handleClose} />
          <div className={`modal modal--${type ? type : "info"} `}>
            <div className="modal__header">
              <h3 className="modal__header__title">{title}</h3>
              <button onClick={handleClose}>
                <X size={20} />
              </button>
            </div>
            <div className="modal__body">{children}</div>
            {!infoModal && (
              <div className="modal__footer">
                <Button
                  label={labelOnCancel ? labelOnCancel : "Cancel"}
                  style={Button_Style.OUTLINED}
                  onClick={handleClose}
                />
                <Button
                  label={labelOnConfirm ? labelOnConfirm : "Ok"}
                  onClick={(e) => {
                    handleConfirm(e);
                  }}
                  disabled={confirmButtonDisabled}
                  type={
                    type === "error"
                      ? Button_Type.ERROR
                      : type === "success"
                      ? Button_Type.SUCCESS
                      : Button_Type.PRIMARY
                  }
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
export default Modal;
