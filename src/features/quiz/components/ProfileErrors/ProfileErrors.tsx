import React, { FC, useState, useMemo } from "react";
import "./ProfileErrors.scss";
import { Nav } from "rsuite";
import { ChevronDown, Check, X, XCircle } from "lucide-react";
import { useQuestionsStore } from "../../../../stores/useQuestionsStore";
import { QuizSessionStat } from "../../../../utils/types";
import Feedback from "../Feedback";

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

  const renderCorrectness = (question: any, userAnswer: any, index: number) => {
    const isTF = question.answerType === "TF";
    const label = isTF ? (index === 0 ? "True" : "False") : question.answers[index];

    const isUserChoice = isTF
      ? (userAnswer === true && index === 0) || (userAnswer === false && index === 1)
      : Array.isArray(userAnswer) ? userAnswer.includes(index) : userAnswer === index;

    const isCorrect = isTF
      ? (question.answer === true && index === 0) || (question.answer === false && index === 1)
      : Array.isArray(question.answer) ? question.answer.includes(index) : question.answer === index;

    let className = "answer-row";
    if (isCorrect) className += " correct";
    else if (isUserChoice) className += " incorrect-selection";

    return (
      <div key={index} className={className}>
        <div className="status-indicator">
          {isCorrect && <Check size={18} className="text-success" />}
          {isUserChoice && !isCorrect && <X size={18} className="text-danger" />}
        </div>
        <span>{label}</span>
      </div>
    );
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
                  <p className="question-text">{question.title}</p>
                  <div className="answers-list">
                    {Array.from({ length: answersCount }).map((_, idx) => renderCorrectness(question, detail.userAnswer, idx))}
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
