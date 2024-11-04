import Button from "../components/Button";
import { Button_Type } from "../components/Button/Button.types";
export default function Home() {
  return (
    <div className="h-100vh p-2 m-0">
      <div className="content">
        <h1 id="questionsTitle" className="text-center">
          Teach Agile : PSPO I
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
            type={Button_Type.LINK}
            url="/quizz"
            className="btn-primary"
          />
        </div>
      </div>
    </div>
  );
}
