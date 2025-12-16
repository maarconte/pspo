/**
 * Composant SessionCreator
 * Permet au créateur de sélectionner des questions et créer une session
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionCreator } from '../../hooks/useSessionCreator';
import { useRealtimeSync } from '../../hooks/useRealtimeSync';
import { QuestionData } from '../../types/session.types';
import { toast } from 'react-toastify';
import Button from '../../../../ui/Button/Button';
import { Button_Style } from '../../../../ui/Button/Button.types';
import ShareSessionModal from '../ShareSessionModal/ShareSessionModal';
import './style.scss';

interface SessionCreatorProps {
  availableQuestions: QuestionData[];
}

const SessionCreator: React.FC<SessionCreatorProps> = ({ availableQuestions }) => {
  const navigate = useNavigate();
  const { createSession, isCreatingSession, shareCode, shareLink, sessionId } =
    useSessionCreator();

  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);

  // Synchroniser la session une fois créée
  useRealtimeSync(sessionId);

  /**
   * Toggle sélection d'une question
   */
  const toggleQuestion = (questionId: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  /**
   * Sélectionner toutes les questions
   */
  const selectAll = () => {
    setSelectedQuestions(availableQuestions.map((q) => q.questionId));
  };

  /**
   * Désélectionner toutes les questions
   */
  const deselectAll = () => {
    setSelectedQuestions([]);
  };

  /**
   * Créer la session avec les questions sélectionnées
   */
  const handleCreateSession = async () => {
    if (selectedQuestions.length === 0) {
      toast.error('Veuillez sélectionner au moins une question');
      return;
    }

    try {
      const questions = availableQuestions.filter((q) =>
        selectedQuestions.includes(q.questionId)
      );

      await createSession(questions);
      setShowShareModal(true);
      toast.success('Session créée avec succès !');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la création de la session');
    }
  };

  /**
   * Fermer le modal et aller à la waiting room
   */
  const handleCloseModal = () => {
    setShowShareModal(false);
    if (sessionId) {
      navigate(`/session/${sessionId}/waiting`);
    }
  };

  return (
    <div className="session-creator">
      <div className="session-creator__header">
        <h1>Créer une Session de Quiz</h1>
        <p className="subtitle">
          Sélectionnez les questions pour votre session collaborative
        </p>
      </div>

      <div className="session-creator__actions">
        <Button
          label={`${selectedQuestions.length} question${
            selectedQuestions.length > 1 ? 's' : ''
          } sélectionnée${selectedQuestions.length > 1 ? 's' : ''}`}
          style={Button_Style.OUTLINED}
          disabled
        />
        <div className="session-creator__actions-group">
          <Button
            label="Tout sélectionner"
            style={Button_Style.LINK}
            onClick={selectAll}
          />
          <Button
            label="Tout désélectionner"
            style={Button_Style.LINK}
            onClick={deselectAll}
          />
        </div>
      </div>

      <div className="session-creator__questions">
        {availableQuestions.map((question) => (
          <div
            key={question.questionId}
            className={`question-card ${
              selectedQuestions.includes(question.questionId) ? 'selected' : ''
            }`}
            onClick={() => toggleQuestion(question.questionId)}
          >
            <div className="question-card__checkbox">
              <input
                type="checkbox"
                checked={selectedQuestions.includes(question.questionId)}
                onChange={() => {}}
              />
            </div>
            <div className="question-card__content">
              <h3>{question.questionText}</h3>
              <div className="question-card__meta">
                <span>{question.options.length} options</span>
                <span>•</span>
                <span>{question.timeLimit}s</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="session-creator__footer">
        <Button
          label="Annuler"
          style={Button_Style.OUTLINED}
          onClick={() => navigate(-1)}
        />
        <Button
          label={isCreatingSession ? 'Création...' : 'Créer la Session'}
          style={Button_Style.SOLID}
          onClick={handleCreateSession}
          disabled={isCreatingSession || selectedQuestions.length === 0}
        />
      </div>

      {showShareModal && shareCode && shareLink && (
        <ShareSessionModal
          shareCode={shareCode}
          shareLink={shareLink}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default SessionCreator;
