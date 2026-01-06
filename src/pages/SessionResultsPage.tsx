/**
 * Page de résultats d'une session
 * Affiche les résultats finaux d'une session terminée
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSessionStore } from '../features/session/stores/useSessionStore';
import SessionResults from '../features/session/components/SessionResults/SessionResults';
import { Loader2 } from 'lucide-react';

const SessionResultsPage: React.FC = () => {
	const { sessionId } = useParams<{ sessionId: string }>();
	const navigate = useNavigate();

	const {
		activeSession,
		currentLeaderboard,
		myParticipantId,
		isLoadingHistory,
		loadSessionById,
	} = useSessionStore();

	const [error, setError] = useState<string | null>(null);

	// Charger la session au montage
	useEffect(() => {
		const loadSession = async () => {
			if (!sessionId) {
				setError('ID de session manquant');
				return;
			}

			try {
				await loadSessionById(sessionId);
			} catch (err: any) {
				console.error('Error loading session:', err);
				setError(err.message || 'Impossible de charger la session');
			}
		};

		loadSession();
	}, [sessionId, loadSessionById]);

	// État de chargement
	if (isLoadingHistory) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
				<Loader2 className="w-12 h-12 animate-spin text-primary" />
				<p className="text-muted-foreground">Chargement des résultats...</p>
			</div>
		);
	}

	// Gestion des erreurs
	if (error) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
				<h2 className="text-2xl font-bold text-destructive">Erreur</h2>
				<p className="text-muted-foreground">{error}</p>
				<button
					onClick={() => navigate('/sessions')}
					className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
				>
					Retour au dashboard
				</button>
			</div>
		);
	}

	// Session non trouvée
	if (!activeSession) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
				<h2 className="text-2xl font-bold">Session introuvable</h2>
				<p className="text-muted-foreground">
					Cette session n'existe pas ou a été supprimée.
				</p>
				<button
					onClick={() => navigate('/sessions')}
					className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
				>
					Retour au dashboard
				</button>
			</div>
		);
	}

	// Afficher les résultats
	return (
		<SessionResults
			session={activeSession}
			leaderboard={currentLeaderboard}
			myParticipantId={myParticipantId}
			isCreator={true}
		/>
	);
};

export default SessionResultsPage;
