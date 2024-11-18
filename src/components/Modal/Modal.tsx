import "./style.scss";

import { Button_Style, Button_Type } from "../Button/Button.types";
import { FC, useState } from "react";

import Button from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

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
  const handleClose = (event: React.MouseEvent) => {
    setIsClosed(false);
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
          <div
            className="modal--backdrop"
            onClick={closeOnBackdropClick ? handleClose : undefined}
          />
          <div className={`modal modal--${type ? type : "info"} `}>
            <div className="modal__header">
              <h3 className="modal__header__title">{title}</h3>
              <button onClick={handleClose}>
                <FontAwesomeIcon icon={faXmark} />
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
