import { Layers } from "lucide-react";
import Button from "../ui/Button/Button";
import { Button_Style } from "../ui/Button/Button.types";
import QuestionsStats from "../features/admin/components/QuestionsStats/QuestionsStats";
import TableQuestions from "../features/admin/components/TableQuestions/TableQuestions";

export default function EditQuestions() {
  return (
    <div className="EditQuestions">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h1 className="text-center mb-0">Edit Questions</h1>
          <Button
            label="Admin modules"
            icon={<Layers size={16} />}
            style={Button_Style.OUTLINED}
            url="/admin/modules"
          />
        </div>
        <QuestionsStats />
      </div>
      <TableQuestions />
    </div>
  );
}
