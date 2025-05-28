import QuestionsStats from "../components/QuestionsStats";
import TableQuestions from "../components/TableQuestions";

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
