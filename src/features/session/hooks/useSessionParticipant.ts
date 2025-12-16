/**
 * Hook personnalisé pour les participants de sessions
 * Gère la participation, les réponses et le suivi du score
 */

import { useState, useCallback, useEffect } from 'react';
import { useSessionStore } from '../stores/useSessionStore';
import { useUserStore } from '../../../stores/useUserStore';

export const useSessionParticipant = (sessionId: string | null) => {
	const { user } = useUserStore();
	const {
		joinSession,
		submitAnswer,
		leaveSession,
		myParticipantId,
		myScore,
		myRank,
		myAnswers,
		activeSession,
		isJoiningSession,
	} = useSessionStore();

	/**
	 * Rejoint une session avec un code
	 */
	const handleJoinSession = useCallback(
		async (shareCode: string, displayName: string) => {
			const result = await joinSession(shareCode, displayName, user?.uid || null);
			return result;
		},
		[joinSession, user]
	);

	/**
	 * Soumet une réponse à la question actuelle (peut être changée)
	 */
	const handleSubmitAnswer = useCallback(
		async (questionId: string, answer: string) => {
			if (!sessionId || !myParticipantId) {
				throw new Error('Vous devez rejoindre une session');
			}

			const score = await submitAnswer(
				sessionId,
				myParticipantId,
				questionId,
				answer
			);

			return score;
		},
		[sessionId, myParticipantId, submitAnswer]
	);

	/**
	 * Quitte la session actuelle
	 */
	const handleLeaveSession = useCallback(() => {
		leaveSession();
	}, [leaveSession]);

	/**
	 * Récupère la question actuelle
	 */
	const getCurrentQuestion = useCallback(() => {
		if (!activeSession) return null;
		return activeSession.questions[activeSession.currentQuestionIndex];
	}, [activeSession]);

	/**
	 * Vérifie si c'est la dernière question
	 */
	const isLastQuestion = useCallback(() => {
		if (!activeSession) return false;
		return (
			activeSession.currentQuestionIndex ===
			activeSession.questions.length - 1
		);
	}, [activeSession]);

	return {
		// État
		myParticipantId,
		myScore,
		myRank,
		myAnswers,
		isJoiningSession,
		currentQuestion: getCurrentQuestion(),
		isLastQuestion: isLastQuestion(),

		// Actions
		joinSession: handleJoinSession,
		submitAnswer: handleSubmitAnswer,
		leaveSession: handleLeaveSession,
	};
};
