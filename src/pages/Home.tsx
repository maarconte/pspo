import {  Select } from "../ui";
import { useQuestionsStore } from "../stores/useQuestionsStore";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
export default function Home() {
  const { formation, setFormation, questions } =
    useQuestionsStore();
  const navigate = useNavigate();
  return (
    <div className="h-100vh p-2 m-0">
      <div className="content">
        <h1 id="questionsTitle" className="text-center">
          Agile.training : {formation}
        </h1>

        <Card  className="w-full max-w-sm mx-auto">
          <CardHeader>
          <CardTitle>Instructions </CardTitle>
          </CardHeader>
          <CardContent>
          <Select
            name="formation"
            className="mb-2"
            value={formation}
            handleChange={(value: any) => {
              setFormation(value);
            }}
            label="Formation"
            options={[
              { label: "PSPO-I", value: "pspo-I" },
              // { label: "PSPO-II", value: "pspo-II" },
              { label: "PSM-I", value: "PSM-I" },
            ]}
          />
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
          <CardFooter className="flex-col gap-2">
          <Button
            onClick={() => navigate("/quizz")}
            disabled={questions.length === 0}
            variant="default"
          >
            Commencer
          </Button>
          </CardFooter>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
