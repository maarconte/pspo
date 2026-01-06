/**
 * Formulaire pour rejoindre une session avec un code
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionParticipant } from '../../hooks/useSessionParticipant';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import Input from '../../../../ui/Input/Input';
import './style.scss';

const JoinSessionForm: React.FC = () => {
  const navigate = useNavigate();
  const { joinSession, isJoiningSession } = useSessionParticipant(null);

  const [shareCode, setShareCode] = useState('');
  const [displayName, setDisplayName] = useState('');

  /**
   * Gère la soumission du formulaire
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shareCode.trim()) {
      toast.error('Veuillez entrer un code de session');
      return;
    }

    if (!displayName.trim()) {
      toast.error('Veuillez entrer votre nom');
      return;
    }

    try {
      console.log('🔵 Tentative de rejoindre session:', shareCode.toUpperCase());
      const result = await joinSession(shareCode.toUpperCase(), displayName.trim());
      console.log('✅ Session rejointe:', result);
      toast.success('Session rejointe avec succès !');
      console.log('🔵 Redirection vers:', `/sessions/${result.sessionId}/waiting`);
      navigate(`/sessions/${result.sessionId}/waiting`);
    } catch (error: any) {
      console.error('❌ Erreur lors de la jonction:', error);
      toast.error(error.message || 'Impossible de rejoindre la session');
    }
  };

  /**
   * Formate le code en majuscules
   */
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length <= 6) {
      setShareCode(value);
    }
  };

  return (
    <div className="join-session-form">
      <div className="join-session-form__header">
        <h1>Rejoindre une Session</h1>
        <p>Entrez le code de session partagé par le créateur</p>
      </div>

      <form onSubmit={handleSubmit} className="join-session-form__form">
        <div className="form-group">
          <label htmlFor="shareCode">Code de Session</label>
          <Input
            id="shareCode"
            type="text"
            value={shareCode}
            onChange={handleCodeChange}
            placeholder="ABC123"
            className="code-input"
            maxLength={6}
            required
            name="shareCode"
          />
          <p className="form-hint">6 caractères alphanumériques</p>
        </div>

        <div className="form-group">
          <label htmlFor="displayName">Votre Nom</label>
          <Input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Entrez votre nom"
            maxLength={30}
            required
            name="displayName"
          />
        </div>

        <div className="form-actions">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
          >
            Annuler
          </Button>
          <Button
            disabled={isJoiningSession || !shareCode || !displayName}
          >
            {isJoiningSession ? 'Connexion...' : 'Rejoindre'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default JoinSessionForm;
