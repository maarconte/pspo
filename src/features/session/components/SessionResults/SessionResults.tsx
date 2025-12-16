/**
 * Écran de résultats finaux de la session
 * Affiche le podium, le classement complet et les statistiques
 */

import { useNavigate } from 'react-router-dom';
import { Trophy, Users, Clock, Target } from 'lucide-react';
import { SessionData, LeaderboardEntry } from '../../types/session.types';
import LeaderboardDisplay from '../LeaderboardDisplay/LeaderboardDisplay';
import Button from '../../../../ui/Button/Button';
import { Button_Style } from '../../../../ui/Button/Button.types';
import './style.scss';

interface SessionResultsProps {
  session: SessionData;
  leaderboard: LeaderboardEntry[];
  myParticipantId?: string | null;
  isCreator?: boolean;
}

const SessionResults: React.FC<SessionResultsProps> = ({
  session,
  leaderboard,
  myParticipantId,
  isCreator = false,
}) => {
  const navigate = useNavigate();

  /**
   * Calcule le score moyen
   */
  const getAverageScore = () => {
    if (leaderboard.length === 0) return 0;
    const total = leaderboard.reduce((sum, entry) => sum + entry.score, 0);
    return Math.round(total / leaderboard.length);
  };

  /**
   * Trouve la position du participant actuel
   */
  const getMyRank = () => {
    if (!myParticipantId) return null;
    const entry = leaderboard.find((e) => e.participantId === myParticipantId);
    return entry?.rank || null;
  };

  const myRank = getMyRank();

  return (
    <div className="session-results">
      {/* En-tête */}
      <div className="session-results__header">
        <h1>Session Terminée !</h1>
        <p>Voici les résultats finaux</p>
      </div>

      {/* Statistiques de la session */}
      <div className="session-stats">
        <div className="stat-card">
          <Users size={32} />
          <div className="stat-value">{session.participantCount}</div>
          <div className="stat-label">Participants</div>
        </div>

        <div className="stat-card">
          <Target size={32} />
          <div className="stat-value">{session.questions.length}</div>
          <div className="stat-label">Questions</div>
        </div>

        <div className="stat-card">
          <Trophy size={32} />
          <div className="stat-value">{getAverageScore()}</div>
          <div className="stat-label">Score Moyen</div>
        </div>

        <div className="stat-card">
          <Clock size={32} />
          <div className="stat-value">
            {Math.floor(session.totalDuration / 60)}:{String(session.totalDuration % 60).padStart(2, '0')}
          </div>
          <div className="stat-label">Durée</div>
        </div>
      </div>

      {/* Position personnelle */}
      {myRank && (
        <div className="my-result">
          <h3>Votre Performance</h3>
          <div className="my-result__content">
            <div className="rank-badge">
              <span className="rank-number">#{myRank}</span>
              <span className="rank-label">
                {myRank === 1 ? '🏆 Champion !' : myRank === 2 ? '🥈 Excellent !' : myRank === 3 ? '🥉 Bravo !' : 'Bien joué !'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Classement complet */}
      <LeaderboardDisplay
        leaderboard={leaderboard}
        myParticipantId={myParticipantId}
        showPodium={true}
      />

      {/* Actions */}
      <div className="session-results__actions">
        {isCreator ? (
          <>
            <Button
              label="Voir l'Historique"
              style={Button_Style.OUTLINED}
              onClick={() => navigate('/dashboard/sessions')}
            />
            <Button
              label="Nouvelle Session"
              style={Button_Style.SOLID}
              onClick={() => navigate('/session/create')}
            />
          </>
        ) : (
          <Button
            label="Retour à l'Accueil"
            style={Button_Style.SOLID}
            onClick={() => navigate('/')}
          />
        )}
      </div>
    </div>
  );
};

export default SessionResults;
