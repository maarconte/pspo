/**
 * Affichage du classement en temps réel
 * Avec podium pour le top 3 et liste complète
 */

import { Trophy, Medal, Award } from 'lucide-react';
import { LeaderboardEntry } from '../../types/session.types';
import './style.scss';

interface LeaderboardDisplayProps {
  leaderboard: LeaderboardEntry[];
  myParticipantId?: string | null;
  showPodium?: boolean;
}

const LeaderboardDisplay: React.FC<LeaderboardDisplayProps> = ({
  leaderboard,
  myParticipantId,
  showPodium = true,
}) => {
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  /**
   * Obtient l'icône pour le rang
   */
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy size={32} className="rank-icon gold" />;
      case 2:
        return <Medal size={32} className="rank-icon silver" />;
      case 3:
        return <Award size={32} className="rank-icon bronze" />;
      default:
        return null;
    }
  };

  /**
   * Obtient la classe CSS pour le rang
   */
  const getRankClass = (rank: number) => {
    switch (rank) {
      case 1:
        return 'gold';
      case 2:
        return 'silver';
      case 3:
        return 'bronze';
      default:
        return '';
    }
  };

  return (
    <div className="leaderboard-display">
      <div className="leaderboard-display__header">
        <h2>Classement</h2>
        <p>{leaderboard.length} participant{leaderboard.length > 1 ? 's' : ''}</p>
      </div>

      {/* Podium pour le top 3 */}
      {showPodium && top3.length > 0 && (
        <div className="podium">
          {/* 2ème place */}
          {top3[1] && (
            <div className="podium__place second">
              <div className="podium__rank">2</div>
              <div className="podium__avatar">
                {top3[1].displayName.charAt(0).toUpperCase()}
              </div>
              <div className="podium__name">{top3[1].displayName}</div>
              <div className="podium__score">{top3[1].score} pts</div>
              {getRankIcon(2)}
            </div>
          )}

          {/* 1ère place */}
          {top3[0] && (
            <div className="podium__place first">
              <div className="podium__rank">1</div>
              <div className="podium__avatar">
                {top3[0].displayName.charAt(0).toUpperCase()}
              </div>
              <div className="podium__name">{top3[0].displayName}</div>
              <div className="podium__score">{top3[0].score} pts</div>
              {getRankIcon(1)}
            </div>
          )}

          {/* 3ème place */}
          {top3[2] && (
            <div className="podium__place third">
              <div className="podium__rank">3</div>
              <div className="podium__avatar">
                {top3[2].displayName.charAt(0).toUpperCase()}
              </div>
              <div className="podium__name">{top3[2].displayName}</div>
              <div className="podium__score">{top3[2].score} pts</div>
              {getRankIcon(3)}
            </div>
          )}
        </div>
      )}

      {/* Liste complète */}
      <div className="leaderboard-list">
        {leaderboard.map((entry, index) => (
          <div
            key={entry.participantId}
            className={`leaderboard-item ${getRankClass(entry.rank)} ${
              entry.participantId === myParticipantId ? 'me' : ''
            }`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="leaderboard-item__rank">
              {entry.rank <= 3 ? getRankIcon(entry.rank) : `#${entry.rank}`}
            </div>
            <div className="leaderboard-item__avatar">
              {entry.displayName.charAt(0).toUpperCase()}
            </div>
            <div className="leaderboard-item__info">
              <div className="name">
                {entry.displayName}
                {entry.participantId === myParticipantId && (
                  <span className="badge">Vous</span>
                )}
              </div>
              <div className="score">{entry.score} points</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardDisplay;
