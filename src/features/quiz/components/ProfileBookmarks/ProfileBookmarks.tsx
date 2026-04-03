import React, { FC, useState, useMemo } from "react";
import "./ProfileBookmarks.scss";
import { Nav } from "rsuite";
import { Bookmark, ChevronDown, Check, X, BookmarkX } from "lucide-react";
import { useQuestionsStore } from "../../../../stores/useQuestionsStore";
import { QuizSessionStat, QuestionStat } from "../../../../utils/types";
import { updateQuizSession } from "../../../../lib/firebase/stats";
import Modal from "../../../../ui/Modal/Modal";
import { useUserStore } from "../../../../stores/useUserStore";

interface ProfileBookmarksProps {
  history: QuizSessionStat[];
  onUpdate: () => void;
}

const ProfileBookmarks: FC<ProfileBookmarksProps> = ({ history, onUpdate }) => {
  const user = useUserStore((s) => s.user);
  const allQuestions = useQuestionsStore((s) => s.allQuestions);

  // Only consider sessions with bookmarked questions in their details
  const sessionsWithBookmarks = useMemo(() => {
    return history.filter(session =>
      session.details?.some(d => d.isBookmarked)
    );
  }, [history]);

  const [activeSessionId, setActiveSessionId] = useState<string | undefined>(
    sessionsWithBookmarks[0]?.id
  );

  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{sessionId: string, questionId: string} | null>(null);

  const activeSession = useMemo(() =>
    sessionsWithBookmarks.find(s => s.id === activeSessionId)
  , [sessionsWithBookmarks, activeSessionId]);

  const bookmarkedDetails = useMemo(() =>
    activeSession?.details?.filter(d => d.isBookmarked) || []
  , [activeSession]);

  const handleDeleteClick = (sessionId: string, questionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPendingDelete({ sessionId, questionId });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDelete || !user) return;

    try {
      const sessionToUpdate = history.find(s => s.id === pendingDelete.sessionId);
      if (!sessionToUpdate) return;

      const newDetails = sessionToUpdate.details.map(d =>
        d.questionId === pendingDelete.questionId ? { ...d, isBookmarked: false } : d
      );

      await updateQuizSession(user.uid, pendingDelete.sessionId, { details: newDetails });

      setIsDeleteModalOpen(false);
      setPendingDelete(null);
      onUpdate(); // Refresh history from parent
    } catch (error) {
      console.error("Error updating bookmark:", error);
    }
  };

  const getQuestionData = (id: string) => {
    return allQuestions.find(q => q.id === id);
  };

  const renderCorrectness = (question: any, userAnswer: any, index: number) => {
    // Handle True/False (TF) questions logic
    const isTF = question.answerType === "TF";
    const label = isTF ? (index === 0 ? "True" : "False") : question.answers[index];

    // For TF: index 0 is true, index 1 is false
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

  if (sessionsWithBookmarks.length === 0) {
    return (
      <div className="profile-bookmarks-section">
        <h2 className="bookmarks-title h4">Mes marques pages</h2>
        <div className="empty-state">
          <BookmarkX size={48} className="text-muted" />
          <p>Vous n'avez pas encore de marque-page dans vos sessions précédentes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-bookmarks-section">
      <h2 className="bookmarks-title h4">Mes marques pages</h2>

      <Nav
        appearance="subtle"
        activeKey={activeSessionId}
        onSelect={(key) => {
          setActiveSessionId(key);
          setExpandedQuestionId(null); // Close accordion on tab change
        }}
        className="mb-4"
      >
        {sessionsWithBookmarks.map((session, idx) => {
          console.log(session);
          const date = new Date(session.timestamp).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short"
          });
          return (
            <Nav.Item key={session.id} eventKey={session.id}>
               {date}
            </Nav.Item>
          );
        })}
      </Nav>

      <div className="bookmarks-accordion">
        {bookmarkedDetails.map((detail) => {
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
                <Bookmark
                  size={20}
                  fill="#f6b223"
                  className="bookmark-icon"
                  onClick={(e) => handleDeleteClick(activeSessionId!, detail.questionId, e)}
                />
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
                    <div className="feedback-box">
                      <strong>Feedback :</strong> {question.feedback}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        setIsClosed={setIsDeleteModalOpen}
        title="Supprimer le marque page"
        labelOnConfirm="Supprimer"
        labelOnCancel="Annuler"
        onConfirm={confirmDelete}
        type="warning"
      >
        <p>Voulez-vous supprimer ce marque page ?</p>
      </Modal>
    </div>
  );
};

export default ProfileBookmarks;
