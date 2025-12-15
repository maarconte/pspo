import QuestionsStats from "../features/admin/components/QuestionsStats/QuestionsStats";
import TableQuestions from "../features/admin/components/TableQuestions/TableQuestions";

export default function EditQuestions() {
  return (
    <div className="EditQuestions">
      <div className="container">
        <h1 className="text-center mb-2">Edit Questions</h1>
        <QuestionsStats />
      </div>
      <TableQuestions />
    </div>
  );
}
