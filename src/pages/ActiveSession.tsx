import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSessionStore } from '../features/session/stores/useSessionStore';
import { useSessionParticipant } from '../features/session/hooks/useSessionParticipant';
import { useRealtimeSync } from '../features/session/hooks/useRealtimeSync';
import { SessionStatus } from '../features/session/types/session.types';
import QuestionDisplay from '../features/session/components/QuestionDisplay/QuestionDisplay';
import SessionResults from '../features/session/components/SessionResults/SessionResults';
import SessionScore from '../features/session/components/SessionScore/SessionScore';
import Counter from '../features/quiz/components/Counter/Counter';
import QuestionNavigation from '../features/quiz/components/QuestionNavigation/QuestionNavigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { toast } from 'react-toastify';
import './ActiveSession/style.scss';
import { BookIcon, CheckIcon, EyeIcon, EyeOffIcon } from 'lucide-react';

const ActiveSessionPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();

  const { activeSession, currentLeaderboard, myParticipantId } = useSessionStore();
  const { submitAnswer } = useSessionParticipant(sessionId || null);

  const [showAnswer, setShowAnswer] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [open, setOpen] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Array<{
    question: number;
    answer: string | string[];
    isBookmarked?: boolean;
  }>>([]);

  // Synchroniser en temps réel
  useRealtimeSync(sessionId || null);

  // Réinitialiser showAnswer et timeSpent quand la question change
  useEffect(() => {
    if (!isFinished) {
      setShowAnswer(false);
    }
    setTimeSpent(0);
  }, [currentQuestionIndex, isFinished]);

  // Timer
  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (!isPaused) {
      intervalId = setInterval(() => {
        setTimeSpent((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [isPaused, currentQuestionIndex]);

  /**
   * Soumet une réponse
   */
  const handleAnswer = async (answer: string) => {
    const currentQuestion = activeSession?.questions[currentQuestionIndex];
    if (!currentQuestion) return;

    try {
      await submitAnswer(currentQuestion.questionId, answer);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la soumission');
    }
  };

  /**
   * Navigation vers question précédente
   */
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  /**
   * Navigation vers question suivante
   */
  const handleNextQuestion = () => {
    if (!activeSession) return;

    if (currentQuestionIndex < activeSession.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  /**
   * Termine le quiz pour cet utilisateur
   */
  const handleFinish = () => {
    setIsFinished(true);
    setShowAnswer(true);
    setIsPaused(true);
    toast.success('Quiz terminé ! Toutes les réponses sont maintenant visibles.');
  };

  if (!activeSession) {
    return (
      <div className="active-session">
        <p>Chargement de la session...</p>
      </div>
    );
  }

  const currentQuestion = activeSession.questions[currentQuestionIndex];
  if (!currentQuestion) {
    return (
      <div className="active-session">
        <p>Question introuvable...</p>
      </div>
    );
  }

  // Session terminée - afficher les résultats
  if (activeSession.status === SessionStatus.COMPLETED) {
    return (
      <SessionResults
        session={activeSession}
        leaderboard={currentLeaderboard}
        myParticipantId={myParticipantId}
        isCreator={false}
      />
    );
  }

  const isOnLastQuestion = currentQuestionIndex === activeSession.questions.length - 1;

  return (
    <div className="active-session">
      <div className="container">
        {/* Header */}
        <h1 className="text-center">Session Collaborative - {activeSession.shareCode}</h1>
        <div className="flex justify-between items-center mb-2">
          <Counter
            isPaused={isPaused}
            setIsPaused={setIsPaused}
            finishQuizz={handleFinish}
          />

          {showAnswer && <SessionScore userAnswers={userAnswers} />}

          <div className="flex gap-2 ">
            {isFinished ? (
              <Button
                            onClick={() => {
                  setCurrentQuestionIndex(0);
                  setShowAnswer(false);
                  setIsFinished(false);
                  setIsPaused(false);
                  window.location.reload();
                }}
                  variant="outline"
              >
                Restart
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAnswer(!showAnswer)}
                  >
                  {showAnswer ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                  {showAnswer ? "Hide the answer" : "Show the answer"}
                </Button>

                  <Button
                      variant="outline"
                  onClick={handleFinish}
                  >
                    <CheckIcon size={16} />
                    Finish
                  </Button>
                  <Button
                      variant="outline"
                  onClick={() => setOpen(true)}
                  >
                    <BookIcon size={16} />
                    See all questions
                </Button>
              </div>
            )}
          </div>
        </div>


        {/* Question */}
        <QuestionDisplay
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={activeSession.questions.length}
          onAnswer={handleAnswer}
          showAnswer={showAnswer}
          currentQuestionIndex={currentQuestionIndex}
          onAnswersChange={setUserAnswers}
        />

        {/* Navigation */}
        <div className="flex justify-between mt-2">
          <Button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            >
              Previous
          </Button>
          <Button
            disabled={isOnLastQuestion}
            onClick={handleNextQuestion}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Sheet de pagination */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-80">
          <QuestionNavigation
            setCurrentQuestion={setCurrentQuestionIndex}
            currentQuestion={currentQuestionIndex}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ActiveSessionPage;
