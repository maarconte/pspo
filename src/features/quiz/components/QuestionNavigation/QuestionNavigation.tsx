import "./style.scss";

import { Button } from "@/components/ui/button";
import { useQuestionsStore } from "../../../../stores/useQuestionsStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
type Props = {
  setCurrentQuestion: (index: number) => void;
  currentQuestion: number;
};

export default function QuestionNavigation({
  setCurrentQuestion,
  currentQuestion,
}: Props) {
  const { userAnswers } = useQuestionsStore();
  const isQuestionAnswered = (index: number) => {
    return userAnswers.some((answer) => answer?.question === index);
  };

  const isBookmarked = (index: number) => {
    return userAnswers.some(
      (answer) => answer?.question === index && answer?.isBookmarked
    );
  };

  return (
    <div>
      <Tabs>
        <TabsList>
          <TabsTrigger value="allQuestions">All Questions</TabsTrigger>
          <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
        </TabsList>
        <TabsContent value="allQuestions">
          <div className="QuestionNavigation">
            {Array.from({ length: 80 }, (_, i) => (
              <Button
                key={i}
                variant={currentQuestion === i ? "default" : "outline"}
                size="sm"
          onClick={() => setCurrentQuestion(i)}
          className={`QuestionNavigation__button ${
            isQuestionAnswered(i) ? "answered" : ""
          } ${
            isBookmarked(i) ? "bookmarked" : ""
          }`}
          disabled={currentQuestion === i}
        >
          {i + 1}
        </Button>
      ))}
    </div>
    </TabsContent>
    <TabsContent value="bookmarked">
    <div className="QuestionNavigation">

            {
              userAnswers.map((answer) => (
                <Button
                  key={answer.question}
                  variant={currentQuestion === answer.question ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentQuestion(answer.question)}
                  className={`QuestionNavigation__button ${
                    isQuestionAnswered(answer.question) ? "answered" : ""
                  } ${
                    isBookmarked(answer.question) ? "bookmarked" : ""
                  }`}
                  disabled={currentQuestion === answer.question}
                >
                  {answer.question + 1}
                </Button>
              ))
            }
    </div>
    </TabsContent>
    </Tabs>
    </div>
  );
}
