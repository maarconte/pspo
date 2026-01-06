/**
 * Hook personnalisé pour les créateurs de sessions
 * Gère la création, le démarrage, la navigation et la fin de session
 */

import { useState, useCallback, useEffect } from 'react';
import { useSessionStore } from '../stores/useSessionStore';
import { useUserStore } from '../../../stores/useUserStore';
import { QuestionData } from '../types/session.types';
import * as sessionService from '../api/sessionService';

export const useSessionCreator = () => {
	const { user } = useUserStore();
	const {
		createSession: createSessionAction,
		startSession,
		nextQuestion,
		endSession,
		activeSession,
		participants,
		isCreatingSession,
		setMyParticipantId,
	} = useSessionStore();

	const [sessionId, setSessionId] = useState<string | null>(null);
	const [shareCode, setShareCode] = useState<string>('');
	const [shareLink, setShareLink] = useState<string>('');

	/**
	 * Crée une nouvelle session de quiz
	 */
	const handleCreateSession = useCallback(
		async (creatorId: string, creatorEmail: string, questions: QuestionData[]) => {
			const result = await createSessionAction(creatorId, creatorEmail, questions);

			// Définir le participantId du créateur dans le store
			setMyParticipantId(result.participantId);

			setSessionId(result.sessionId);
			setShareCode(result.shareCode);
			setShareLink(`${window.location.origin}/sessions/join?code=${result.shareCode}`);

			return result;
		},
		[createSessionAction, setMyParticipantId]
	);

	/**
	 * Démarre la session (passe de WAITING à ACTIVE)
	 */
	const handleStartSession = useCallback(async () => {
		const currentSessionId = activeSession?.sessionId;
		if (!currentSessionId) {
			throw new Error('Aucune session active');
		}

		await startSession(currentSessionId);
	}, [activeSession, startSession]);

	/**
	 * Passe à la question suivante et met à jour le classement
	 */
	const handleNextQuestion = useCallback(async () => {
		const currentSessionId = activeSession?.sessionId;
		if (!currentSessionId) {
			throw new Error('Aucune session active');
		}

		await nextQuestion(currentSessionId);
	}, [activeSession, nextQuestion]);

	/**
	 * Termine la session et sauvegarde l'historique
	 */
	const handleEndSession = useCallback(async () => {
		const currentSessionId = activeSession?.sessionId;
		if (!currentSessionId) {
			throw new Error('Aucune session active');
		}

		await endSession(currentSessionId);
	}, [activeSession, endSession]);

	/**
	 * Vérifie si l'utilisateur actuel est le créateur
	 */
	const isCreator = useCallback(() => {
		return user && activeSession?.creatorId === user.uid;
	}, [user, activeSession]);

	/**
	 * Récupère le nombre de participants
	 */
	const getParticipantCount = useCallback(() => {
		return participants.size;
	}, [participants]);

	/**
	 * Vérifie si la session peut démarrer (au moins 1 participant)
	 */
	const canStartSession = useCallback(() => {
		return participants.size > 0;
	}, [participants]);

	return {
		// État
		shareCode,
		shareLink,
		sessionId,
		isCreatingSession,
		isCreator: isCreator(),
		participantCount: getParticipantCount(),
		canStartSession: canStartSession(),

		// Actions
		createSession: handleCreateSession,
		startSession: handleStartSession,
		nextQuestion: handleNextQuestion,
		endSession: handleEndSession,
	};
};
