import React, { useState } from "react";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useAddDoc, useDeleteDoc } from "../../../utils/hooks";

import Button from "../../Button";
import { Button_Type } from "../../Button/Button.types";
import FileUploader from "../../FileUploader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../../Modal";
import ModalEditQuestion from "../../ModalEditQuestion";
import Papa from "papaparse";
import { Question } from "../../../utils/types";
import { QuestionsContext } from "../../../utils/context";
import { toast } from "react-toastify";

interface TableActionsProps {
  selectedQuestions: Question[];
  selectedQuestion?: Question;
  setSelectedQuestions?: React.Dispatch<React.SetStateAction<Question[]>>;
  setSelectedQuestion?: React.Dispatch<
    React.SetStateAction<Question | undefined>
  >;
  setIsSelectAll?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSelectNone?: React.Dispatch<React.SetStateAction<boolean>>;
}
const TableActions: React.FC<TableActionsProps> = ({
  selectedQuestions,
  selectedQuestion,
  setSelectedQuestions,
  setSelectedQuestion,
  setIsSelectAll,
  setIsSelectNone,
}) => {
  const [csvData, setCsvData] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { handleAdd } = useAddDoc("questions");
  const { handleDelete } = useDeleteDoc("questions");
  const { allQuestions, refetch } = React.useContext(QuestionsContext);
  const handleDeleteAll = () => {
    if (!selectedQuestions || selectedQuestions.length === 0) return;
    if (!setSelectedQuestions || !setIsSelectAll || !setIsSelectNone) return;

    selectedQuestions.forEach((question: Question) => {
      handleDelete(question.id);
    });
    setSelectedQuestions([]);
    setIsSelectAll(false);
    setIsSelectNone(false);
    refetch();
  };

  const handleFileUpload = (file: any) => {
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result: any) => {
          //parse data so that answers is an array. each item is separated by a /
          result.data = result.data.map((item: any) => {
            const keys = Object.keys(item);
            const answerListKeys = keys.filter((key) =>
              key.startsWith("answerList")
            );

            if (answerListKeys.length > 0) {
              item.answers = answerListKeys
                .map((key) => item[key])
                .filter((answer: string) => answer !== "");
              // remove the answerList keys from the item
              answerListKeys.forEach((key) => delete item[key]);
            }
            if (item.answerType === "S") {
              if (!isNaN(Number(item.answer))) {
                item.answer = Number(item.answer);
              }
              return item;
            }
            if (item.answerType === "M") {
              item.answer = item.answer.split(",").map((answer: string) => {
                answer = answer.trim();
                // transform answer to number if possible
                if (!isNaN(Number(answer))) {
                  return Number(answer);
                }
                return answer;
              });
            }
            return item;
          });

          console.log("Parsed CSV Data:", result.data);
          setCsvData(result.data); // Store the parsed data
          // Add validation or processing logic here
        },
        error: (error: any) => {
          console.error("Error parsing CSV file:", error);
        },
      });
    }
  };

  const addAllQuestions = () => {
    if (!csvData) return;
    try {
      csvData?.forEach((question) => {
        handleAdd(question);
        setCsvData([]);
      });
      toast.success("The questions have been added");
    } catch (error) {
      toast.error(
        "An error occurred while adding the questions. Please try again."
      );
      console.log(error);
    }
  };
  return (
    <div className="d-flex gap-05 justify-content-end mb-1">
      <FileUploader handleFile={handleFileUpload} />
      {csvData.length > 0 && (
        <Button
          label={`Add ${csvData.length} questions`}
          onClick={addAllQuestions}
          icon={<FontAwesomeIcon icon={faPlus} />}
        />
      )}
      <Button
        onClick={() => setIsAddModalOpen(true)}
        label="Add a question"
        icon={<FontAwesomeIcon icon={faPlus} />}
      />

      {selectedQuestions.length > 0 && (
        <Button
          onClick={() => setIsDeleteModalOpen(true)}
          label="Delete"
          type={Button_Type.ERROR}
          icon={<FontAwesomeIcon icon={faTrash} />}
        />
      )}

      <ModalEditQuestion
        isOpen={isAddModalOpen}
        setIsOpen={setIsAddModalOpen}
      />

      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          setIsClosed={setIsDeleteModalOpen}
          title="Delete question(s)"
          onConfirm={() => {
            if (
              !setSelectedQuestions ||
              !setIsSelectAll ||
              !setIsSelectNone ||
              !setSelectedQuestion
            )
              return;

            if (selectedQuestion) {
              handleDelete(selectedQuestion.id);
              selectedQuestion && setSelectedQuestion(undefined);
            } else {
              handleDeleteAll();
              setSelectedQuestions([]);
              setIsSelectAll(false);
              setIsSelectNone(false);
            }
            setIsDeleteModalOpen(false);
            refetch();
          }}
          labelOnConfirm="Delete"
          onClose={() => setIsDeleteModalOpen(false)}
          type="error"
        >
          <div>
            <p>Are you sure you want to delete this question?</p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TableActions;
