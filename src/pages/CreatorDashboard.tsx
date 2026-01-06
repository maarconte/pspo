/**
 * Dashboard du créateur
 * Affiche l'historique des sessions créées et les statistiques globales
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Trophy, TrendingUp, Target } from 'lucide-react';
import { useSessionStore } from '../features/session/stores/useSessionStore';
import { useUserStore } from '../stores/useUserStore';
import { Button } from '@/components/ui/button';
import './CreatorDashboard/style.scss';

const CreatorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const {
    mySessions,
    sessionStatistics,
    loadCreatorSessions,
    isLoadingHistory,
  } = useSessionStore();

  // Charger l'historique au montage
  useEffect(() => {
    if (user) {
      loadCreatorSessions(user.uid);
    }
  }, [user, loadCreatorSessions]);

  /**
   * Formate une date
   */
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  /**
   * Navigue vers les détails d'une session
   */
  const viewSessionDetails = (sessionId: string) => {
    navigate(`/sessions/${sessionId}/results`);
  };

  if (isLoadingHistory) {
    return (
      <div className="creator-dashboard">
        <p>Chargement de votre historique...</p>
      </div>
    );
  }

  return (
    <div className="creator-dashboard">
      {/* En-tête */}
      <div className="creator-dashboard__header">
        <div>
          <h1>Mes Sessions</h1>
          <p>Gérez et analysez vos sessions de quiz</p>
        </div>
        <Button
          onClick={() => navigate('/session/create')}
        >
          <Plus size={20} />
          Nouvelle Session
        </Button>
      </div>

      {/* Statistiques globales */}
      {sessionStatistics && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card__icon">
              <Target size={32} />
            </div>
            <div className="stat-card__content">
              <div className="stat-card__value">
                {sessionStatistics.totalSessions}
              </div>
              <div className="stat-card__label">Sessions Créées</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card__icon">
              <Users size={32} />
            </div>
            <div className="stat-card__content">
              <div className="stat-card__value">
                {sessionStatistics.totalParticipants}
              </div>
              <div className="stat-card__label">Participants Totaux</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card__icon">
              <TrendingUp size={32} />
            </div>
            <div className="stat-card__content">
              <div className="stat-card__value">
                {sessionStatistics.averageParticipantsPerSession}
              </div>
              <div className="stat-card__label">Participants / Session</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card__icon">
              <Trophy size={32} />
            </div>
            <div className="stat-card__content">
              <div className="stat-card__value">
                {sessionStatistics.averageScore}
              </div>
              <div className="stat-card__label">Score Moyen</div>
            </div>
          </div>
        </div>
      )}

      {/* Liste des sessions */}
      <div className="sessions-section">
        <h2>Historique des Sessions</h2>

        {mySessions.length === 0 ? (
          <div className="empty-state">
            <Target size={64} />
            <h3>Aucune session créée</h3>
            <p>Créez votre première session de quiz collaborative</p>
          </div>
        ) : (
          <div className="sessions-list">
            {mySessions.map((session) => (
              <div
                key={session.sessionId}
                className="session-card"
                onClick={() => viewSessionDetails(session.sessionId)}
              >
                <div className="session-card__header">
                  <div className="session-code">{session.shareCode}</div>
                  <div className="session-date">
                    {formatDate(session.createdAt)}
                  </div>
                </div>

                <div className="session-card__stats">
                  <div className="stat">
                    <Users size={16} />
                    <span>{session.participantCount} participants</span>
                  </div>
                  <div className="stat">
                    <Target size={16} />
                    <span>{session.questions.length} questions</span>
                  </div>
                  <div className="stat">
                    <Trophy size={16} />
                    <span>{session.averageScore} pts moyen</span>
                  </div>
                </div>

                {/* Top 3 */}
                {session.finalLeaderboard.length > 0 && (
                  <div className="session-card__podium">
                    <div className="podium-label">Top 3 :</div>
                    <div className="podium-list">
                      {session.finalLeaderboard.slice(0, 3).map((entry, index) => (
                        <div key={entry.participantId} className="podium-entry">
                          <span className="rank">#{index + 1}</span>
                          <span className="name">{entry.displayName}</span>
                          <span className="score">{entry.score} pts</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Questions populaires */}
      {sessionStatistics && sessionStatistics.mostPopularQuestions.length > 0 && (
        <div className="popular-questions">
          <h2>Questions les Plus Utilisées</h2>
          <div className="questions-list">
            {sessionStatistics.mostPopularQuestions.map((question) => (
              <div key={question.questionId} className="question-item">
                <div className="question-text">{question.questionText}</div>
                <div className="question-count">
                  Utilisée {question.timesUsed} fois
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorDashboard;
