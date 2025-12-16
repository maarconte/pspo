/**
 * Page de création de session
 * Permet de sélectionner une formation et créer une session avec 80 questions aléatoires
 */

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { QuestionData } from '../features/session/types/session.types';
import { useUserStore } from '../stores/useUserStore';
import { useNavigate } from 'react-router-dom';
import { useSessionCreator } from '../features/session/hooks/useSessionCreator';
import { Select, Button } from '../ui';
import { Button_Style } from '../ui/Button/Button.types';
import ShareSessionModal from '../features/session/components/ShareSessionModal/ShareSessionModal';
import { toast } from 'react-toastify';

const CreateSessionPage: React.FC = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const { createSession, isCreatingSession, shareCode, shareLink, sessionId } = useSessionCreator();

  const [formation, setFormation] = useState('pspo-I');
  const [allQuestions, setAllQuestions] = useState<QuestionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);

  // Rediriger si non authentifié
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Charger toutes les questions de la formation sélectionnée
  useEffect(() => {
    const loadQuestions = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const questionsRef = collection(db, 'questions');
        console.log('questionsRef', questionsRef);
        const q = query(questionsRef, where('type', '==', formation));
        const snapshot = await getDocs(q);

        const loadedQuestions: QuestionData[] = snapshot.docs.map((doc) => {
          const data = doc.data();

          // Log de la première question pour voir la structure
          if (snapshot.docs.indexOf(doc) === 0) {
            console.log('Structure brute Firestore:', data);
          }

          // Validation : answerType est obligatoire
          if (!data.answerType) {
            console.error('Question sans answerType:', doc.id, data);
            throw new Error(`La question ${doc.id} n'a pas de champ answerType`);
          }

          // Convertir la réponse en string selon le type
          let correctAnswerString: string;
          if (typeof data.answer === 'number') {
            // Si c'est un index, prendre la réponse correspondante
            correctAnswerString = data.answers[data.answer] || '';
          } else if (Array.isArray(data.answer)) {
            // Si c'est un tableau d'index, prendre les réponses correspondantes
            correctAnswerString = data.answer.map((idx: number) => data.answers[idx]).join(', ');
          } else if (typeof data.answer === 'boolean') {
            correctAnswerString = data.answer ? 'True' : 'False';
          } else {
            correctAnswerString = String(data.answer);
          }

          // Pour les questions TF, forcer les options à True/False
          const options = data.answerType === 'TF'
            ? ['True', 'False']
            : (data.answers || []);

          return {
            questionId: doc.id,
            questionText: data.title || '',
            options: options,
            correctAnswer: correctAnswerString,
            answerType: data.answerType, // Obligatoire : M, S, ou TF
            feedback: data.feedback || '', // Feedback optionnel
          };
        });

        console.log('Questions chargées:', loadedQuestions.length);
        console.log('Première question transformée:', loadedQuestions[0]);
        setAllQuestions(loadedQuestions);
      } catch (error) {
        console.error('Erreur lors du chargement des questions:', error);
        toast.error('Erreur lors du chargement des questions');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [user, formation]);

  /**
   * Sélectionne 80 questions aléatoires
   */
  const getRandomQuestions = (questions: QuestionData[], count: number = 80): QuestionData[] => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, questions.length));
  };

  /**
   * Crée la session avec 80 questions aléatoires
   */
  const handleCreateSession = async () => {
    if (allQuestions.length === 0) {
      toast.error('Aucune question disponible pour cette formation');
      return;
    }

    if (allQuestions.length < 80) {
      toast.warning(`Seulement ${allQuestions.length} questions disponibles (moins de 80)`);
    }

    try {
      const selectedQuestions = getRandomQuestions(allQuestions, 80);
      await createSession(user!.uid, user!.email || '', selectedQuestions);
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

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Chargement des questions...</p>
      </div>
    );
  }

  return (
    <div className="h-100vh p-2 m-0">
      <div className="content">
        <h1 className="text-center">Créer une Session Collaborative</h1>

        <div className="card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
          <h2>Configuration de la Session</h2>

          <Select
            name="formation"
            className="mb-2"
            value={formation}
            handleChange={(value: any) => {
              setFormation(value);
            }}
            label="Formation"
            options={[
              { label: "PSPO-I", value: "pspo-I" },
              { label: "PSM-I", value: "PSM-I" },
            ]}
          />

          <div style={{ marginBottom: '1rem' }}>
            <p>
              <strong>Nombre de questions :</strong> 80 (sélection aléatoire)
            </p>
            <p>
              <strong>Questions disponibles :</strong> {allQuestions.length}
            </p>
          </div>

          {allQuestions.length === 0 ? (
            <div style={{ padding: '1rem', background: '#fff3cd', borderRadius: '8px', marginBottom: '1rem' }}>
              <p style={{ margin: 0, color: '#856404' }}>
                Aucune question disponible pour cette formation.
                Veuillez d'abord créer des questions dans l'interface admin.
              </p>
            </div>
          ) : allQuestions.length < 80 ? (
            <div style={{ padding: '1rem', background: '#fff3cd', borderRadius: '8px', marginBottom: '1rem' }}>
              <p style={{ margin: 0, color: '#856404' }}>
                Attention : Seulement {allQuestions.length} questions disponibles (moins de 80).
              </p>
            </div>
          ) : null}

          <Button
            label={isCreatingSession ? 'Création...' : 'Créer la Session'}
            style={Button_Style.SOLID}
            onClick={handleCreateSession}
            disabled={isCreatingSession || allQuestions.length === 0}
            className="d-block w-100 mb-1"
          />

          <Button
            label="Annuler"
            style={Button_Style.OUTLINED}
            onClick={() => navigate('/dashboard/sessions')}
            className="d-block w-100"
            disabled={isCreatingSession}
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
    </div>
  );
};

export default CreateSessionPage;
