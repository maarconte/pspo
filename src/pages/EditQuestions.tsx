import Button from "../components/Button";
import FileUploader from "../components/FileUploader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ModalEditQuestion from "../components/ModalEditQuestion";
import Papa from "papaparse";
import QuestionsStats from "../components/QuestionsStats";
import TableQuestions from "../components/TableQuestions";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useAddDoc } from "../utils/hooks";
import { useState } from "react";

export default function EditQuestions() {
  const [csvData, setCsvData] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { handleAdd } = useAddDoc("questions");
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
    <div className="EditQuestions">
      <div className="container">
        <h1 className="text-center">Edit Questions</h1>
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
        </div>
        <QuestionsStats />
        <ModalEditQuestion
          isOpen={isAddModalOpen}
          setIsOpen={setIsAddModalOpen}
        />
      </div>
      <TableQuestions />
    </div>
  );
}
