import "./style.scss";
import "./style-mobile.scss";

import { Button_Style, Button_Type } from "../Button/Button.types";
import { FC, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import Button from "../Button";
import { FeedbackProps } from "./Feedback.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "../Input";
import Modal from "../Modal";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { useUpdateDoc } from "../../utils/hooks/";

const Feedback: FC<FeedbackProps> = ({ question }) => {
  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState<string>("");
  const { data, error, handleUpdate } = useUpdateDoc({
    collectionName: "questions",
    docId: question.id,
  });

  const handleSubmitComment = () => {
    if (!comment) return;
    console.log(data);
    const comments = data?.comments ? [...data.comments] : [];
    handleUpdate({
      ...data,
      comments: [...comments, comment],
      isFlagged: true,
    });
    setShowModal(false);
    if (!error) {
      toast.success("The problem has been reported");
    }
  };

  const handleCommentChange = (e: any) => {
    setComment(e.target.value);
  };

  useEffect(() => {
    if (error) {
      toast.error("An error occurred while updating the question");
    }
  }, [error]);

  return (
    <div className="Feedback">
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="h5">Feedback</h3>
        <Button
          label="Report a problem"
          type={Button_Type.SECONDARY}
          style={Button_Style.OUTLINED}
          icon={
            <FontAwesomeIcon icon={faExclamationTriangle} color="#e41937" />
          }
          onClick={() => setShowModal(true)}
        />
      </div>
      <p>
        {question.feedback
          ? question.feedback
          : "No feedback for this question"}
      </p>
      <Modal
        isOpen={showModal}
        setIsClosed={setShowModal}
        onClose={() => setShowModal(false)}
        title="Report a problem"
        labelOnConfirm="Submit"
        onConfirm={() => handleSubmitComment()}
      >
        <p>
          If you believe this answer is inappropriate or should be reviewed,
          please let us know.
        </p>
        <Input
          type="textarea"
          placeholder="Please describe the issue"
          onChange={(e) => handleCommentChange(e)}
          name={"feedback-comment"}
        />
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default Feedback;
