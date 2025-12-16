/**
 * Page pour rejoindre une session
 */

import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import JoinSessionForm from '../features/session/components/JoinSessionForm/JoinSessionForm';

const JoinSessionPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');

  // Si un code est fourni dans l'URL, on pourrait pré-remplir le formulaire
  useEffect(() => {
    if (code) {
      // Le formulaire pourrait être pré-rempli avec ce code
      console.log('Code de session depuis URL:', code);
    }
  }, [code]);

  return (
    <div className="join-session-page">
      <JoinSessionForm />
    </div>
  );
};

export default JoinSessionPage;
