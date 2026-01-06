/**
 * Salle d'attente - Affiche les participants qui rejoignent en temps réel
 * Le créateur peut démarrer la session depuis cet écran
 */

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Play } from 'lucide-react';
import { useSessionStore } from '../../stores/useSessionStore';
import { useSessionCreator } from '../../hooks/useSessionCreator';
import { useRealtimeSync } from '../../hooks/useRealtimeSync';
import { SessionStatus } from '../../types/session.types';
import { Button } from '@/components/ui/button';
import './style.scss';

const WaitingRoom: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { activeSession, participants } = useSessionStore();
  const { isCreator, canStartSession, startSession } = useSessionCreator();

  console.log('WaitingRoom - sessionId:', sessionId);
  console.log('WaitingRoom - activeSession:', activeSession);
  console.log('WaitingRoom - participants:', participants.size);

  // Synchroniser en temps réel
  useRealtimeSync(sessionId || null);

  // Rediriger vers la session active si elle démarre
  useEffect(() => {
    if (activeSession?.status === SessionStatus.ACTIVE) {
      navigate(`/sessions/${sessionId}`);
    }
  }, [activeSession?.status, sessionId, navigate]);

  /**
   * Démarre la session
   */
  const handleStartSession = async () => {
    try {
      await startSession();
    } catch (error: any) {
      console.error('Erreur lors du démarrage:', error);
    }
  };

  if (!activeSession) {
    return (
      <div className="waiting-room">
        <p>Chargement de la session...</p>
        <p style={{ fontSize: '0.875rem', color: '#666' }}>
          Session ID: {sessionId}
        </p>
      </div>
    );
  }

  const participantsList = Array.from(participants.values());

  return (
    <div className="waiting-room">
      <div className="waiting-room__header">
        <h1>Salle d'Attente</h1>
        <div className="waiting-room__code">
          <span className="label">Code de session :</span>
          <span className="code">{activeSession.shareCode}</span>
        </div>
      </div>

      <div className="waiting-room__content">
        <div className="waiting-room__info">
          <Users size={48} />
          <h2>
            {participantsList.length} Participant{participantsList.length > 1 ? 's' : ''}
          </h2>
          <p>En attente du démarrage de la session...</p>
        </div>

        <div className="waiting-room__participants">
          {participantsList.map((participant) => (
            <div
              key={participant.participantId}
              className={`participant-card ${
                participant.isCreator ? 'creator' : ''
              }`}
            >
              <div className="participant-card__avatar">
                {participant.displayName.charAt(0).toUpperCase()}
              </div>
              <div className="participant-card__info">
                <span className="name">{participant.displayName}</span>
                {participant.isCreator && (
                  <span className="badge">Créateur</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isCreator && (
        <div className="waiting-room__footer">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/sessions')}
          >
            Annuler
          </Button>
          <Button
            onClick={handleStartSession}
            disabled={!canStartSession}
          >
            <Play size={20} className="mr-2" />
            Démarrer la Session
          </Button>
        </div>
      )}

      {!isCreator && (
        <div className="waiting-room__footer">
          <p className="waiting-message">
            En attente que le créateur démarre la session...
          </p>
        </div>
      )}
    </div>
  );
};

export default WaitingRoom;
