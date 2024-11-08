import Button from "../components/Button";
import { Button_Style } from "../components/Button/Button.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ModalEditQuestion from "../components/ModalEditQuestion";
import QuestionsStats from "../components/QuestionsStats";
import React from "react";
import TableQuestions from "../components/TableQuestions";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
export default function EditQuestions() {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  return (
    <div className="EditQuestions">
      <div className="container">
        <h1 className="text-center">Edit Questions</h1>
        <div className="d-flex gap-05 justify-content-end mb-1">
          <Button
            style={Button_Style.OUTLINED}
            onClick={() => setIsAddModalOpen(true)}
            label="Import questions"
            icon={<FontAwesomeIcon icon={faUpload} />}
            disabled
          />
          <Button
            onClick={() => setIsAddModalOpen(true)}
            label="Add a question"
            icon={<FontAwesomeIcon icon={faPlus} />}
          />
        </div>
        <QuestionsStats />

        <ModalEditQuestion
          isOpen={isAddModalOpen}
          setIsOpen={setIsAddModalOpen}
        />
        <TableQuestions />
      </div>
    </div>
  );
}
