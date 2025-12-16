/**
 * Hook personnalisé pour la synchronisation temps réel des sessions
 * Gère les listeners Firestore pour les mises à jour en temps réel
 */

import { useEffect } from 'react';
import { useSessionStore } from '../stores/useSessionStore';

export const useRealtimeSync = (sessionId: string | null) => {
	const { syncSession, syncParticipants, syncLeaderboard, activeSession } =
		useSessionStore();

	// Synchroniser la session
	useEffect(() => {
		if (!sessionId) return;

		const unsubscribe = syncSession(sessionId);
		return () => unsubscribe();
	}, [sessionId, syncSession]);

	// Synchroniser les participants
	useEffect(() => {
		if (!sessionId) return;

		const unsubscribe = syncParticipants(sessionId);
		return () => unsubscribe();
	}, [sessionId, syncParticipants]);

	// Synchroniser le classement (après chaque question)
	useEffect(() => {
		if (!sessionId || !activeSession) return;

		const questionIndex = activeSession.currentQuestionIndex;
		const unsubscribe = syncLeaderboard(sessionId, questionIndex);
		return () => unsubscribe();
	}, [sessionId, activeSession?.currentQuestionIndex, syncLeaderboard]);
};
