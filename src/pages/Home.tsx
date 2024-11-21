import Button from "../components/Button";
import { Button_Type } from "../components/Button/Button.types";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="h-100vh p-2 m-0">
      <div className="content">
        <h1 id="questionsTitle" className="text-center">
          Teach Agile : PSPO
        </h1>
        <div className="card">
          <h2>Instructions </h2>
          <p>
            Number of questions <strong>80</strong>
          </p>
          <p>
            Has a time limit of <strong>60:00</strong>
          </p>
          <p>
            Must be finished in one sitting. You cannot save and finish later.
          </p>
          <p>
            Questions displayed per page <strong>1</strong>
          </p>
          <p>Will allow you to go back and change your answers.</p>
          <p>Will not let you finish with any questions unattempted.</p>
          <p>
            Has a pass mark of <strong>85% (12 errors maximum)</strong>
          </p>
          <Button
            label="Commencer"
            onClick={() => navigate("/quizz")}
            className="d-block w-100"
          />
        </div>
      </div>
    </div>
  );
}
