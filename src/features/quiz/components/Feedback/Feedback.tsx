import "./style.scss";
import "./style-mobile.scss";

import { Button_Style, Button_Type } from "../../../../ui/Button/Button.types";
import { FC, useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";

import Button from "../../../../ui/Button/Button";
import { FeedbackProps } from "./Feedback.types";
import Input from "../../../../ui/Input/Input";
import Modal from "../../../../ui/Modal/Modal";
import { useUpdateDoc } from "../../../../utils/hooks/";

const Feedback: FC<FeedbackProps> = ({ question, showReportButton = true }) => {
  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState<string>("");
  const { data, handleUpdate, isUpdating, error } = useUpdateDoc({
    collectionName: "questions",
    docId: question.id,
  });

  const handleSubmitComment = async () => {
    if (!comment) return;

    // Use data from query if available, fallback to question prop to ensure we have initial details
    const currentData = data || question;
    const comments = currentData?.comments ? [...currentData.comments] : [];

    try {
      await handleUpdate({
        comments: [...comments, comment],
        isFlagged: true,
      });
      setShowModal(false);
      setComment("");
      toast.success("The problem has been reported");
    } catch (err) {
      console.error("Error reporting question:", err);
      toast.error("An error occurred while reporting the problem");
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
      <div className="feedback-box">
        <strong>Feedback: </strong>
        {question.feedback
          ? question.feedback
          : "No feedback for this question"}
      </div>
      {showReportButton && (
        <div className="d-flex justify-content-end align-items-center mt-1">
          <Button
            label="Report a problem"
            type={Button_Type.SECONDARY}
            style={Button_Style.OUTLINED}
            icon={
            <AlertTriangle size={16} color="#e41937"/>
          }
          onClick={() => setShowModal(true)}
        />
      </div>
      )}

      <Modal
        isOpen={showModal}
        setIsClosed={setShowModal}
        onClose={() => setShowModal(false)}
        title="Report a problem"
        labelOnConfirm="Submit"
        onConfirm={() => handleSubmitComment()}
        isConfirmLoading={isUpdating}
        confirmButtonDisabled={!comment}
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
    </div>
  );
};

export default Feedback;
