import { FC, useState, useMemo } from "react";
import "./ProfileErrors.scss";
import { Nav } from "rsuite";
import { ChevronDown, Check } from "lucide-react";
import { useQuestionsStore } from "../../../../stores/useQuestionsStore";
import { QuizSessionStat } from "../../../../utils/types";
import Feedback from "../Feedback";
import QuestionAnswer from "../QuestionAnswer/QuestionAnswer";
import { getInputType, isUserChoice, getAnswerStatus, getAnswerLabel } from "../../utils/answerUtils";

interface ProfileErrorsProps {
  history: QuizSessionStat[];
}

const ProfileErrors: FC<ProfileErrorsProps> = ({ history }) => {
  const allQuestions = useQuestionsStore((s) => s.allQuestions);

  // Only consider sessions with errors (where user actually replied) in their details
  const sessionsWithErrors = useMemo(() => {
    return history.filter(session =>
      session.details?.some(d => d.isCorrect === false && d.userAnswer !== null)
    );
  }, [history]);

  const [activeSessionId, setActiveSessionId] = useState<string | undefined>(
    sessionsWithErrors[0]?.id
  );

  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const activeSession = useMemo(() =>
    sessionsWithErrors.find(s => s.id === activeSessionId)
  , [sessionsWithErrors, activeSessionId]);

  const errorDetails = useMemo(() =>
    activeSession?.details?.filter(d => d.isCorrect === false && d.userAnswer !== null) || []
  , [activeSession]);

  const getQuestionData = (id: string) => {
    return allQuestions.find(q => q.id === id);
  };

  if (sessionsWithErrors.length === 0) {
    return (
      <div className="profile-errors-section">
        <h2 className="errors-title h4">Mes erreurs</h2>
        <div className="empty-state">
          <Check size={48} className="text-success" />
          <p>Félicitations ! Vous n'avez fait aucune erreur dans vos sessions récentes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-errors-section">
      <h2 className="errors-title h4">Mes erreurs</h2>

      <Nav
        appearance="subtle"
        activeKey={activeSessionId}
        onSelect={(key) => {
          setActiveSessionId(key);
          setExpandedQuestionId(null);
        }}
        className="mb-4"
      >
        {sessionsWithErrors.map((session) => {
          const date = new Date(session.timestamp).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short"
          });
          return (
            <Nav.Item key={session.id} eventKey={session.id}>
              Sess. {date}
            </Nav.Item>
          );
        })}
      </Nav>

      <div className="errors-accordion">
        {errorDetails.map((detail) => {
          const question = getQuestionData(detail.questionId);
          if (!question) return null;

          const isOpen = expandedQuestionId === detail.questionId;
          const answersCount = question.answerType === "TF" ? 2 : (question.answers?.length || 0);

          return (
            <div key={detail.questionId} className={`accordion-item ${isOpen ? 'open' : ''}`}>
              <div
                className="accordion-header"
                onClick={() => setExpandedQuestionId(isOpen ? null : detail.questionId)}
              >
                <h3 className="question-title">{question.title}</h3>
                <ChevronDown size={20} className="chevron" />
              </div>

              {isOpen && (
                <div className="accordion-content">
                  <div className="answers-list">
                    {Array.from({ length: answersCount }).map((_, idx) => (
                      <QuestionAnswer
                        key={idx}
                        id={`${detail.questionId}-${idx}`}
                        name={detail.questionId}
                        type={getInputType(question.answerType)}
                        label={getAnswerLabel(question, idx)}
                        checked={isUserChoice(question, detail.userAnswer, idx)}
                        onChange={() => {}}
                        isReadOnly
                        status={getAnswerStatus(question, detail.userAnswer, idx)}
                      />
                    ))}
                  </div>
                  {question.feedback && (
                    <Feedback question={question} showReportButton={false} />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileErrors;
