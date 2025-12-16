/**
 * Service Firebase pour la gestion des sessions de quiz collaboratives
 */

import {
	collection,
	doc,
	setDoc,
	getDoc,
	getDocs,
	updateDoc,
	query,
	where,
	serverTimestamp,
	increment,
	arrayUnion,
	Timestamp,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import {
	SessionData,
	SessionStatus,
	QuestionData,
	ParticipantData,
	Answer,
	LeaderboardEntry,
} from '../types/session.types';

/**
 * Génère un code de session unique de 6 caractères alphanumériques
 */
export const generateShareCode = (): string => {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	return Array.from({ length: 6 }, () =>
		chars[Math.floor(Math.random() * chars.length)]
	).join('');
};

/**
 * Vérifie si un code de session existe déjà
 */
const isShareCodeUnique = async (shareCode: string): Promise<boolean> => {
	const sessionsRef = collection(db, 'sessions');
	const q = query(sessionsRef, where('shareCode', '==', shareCode));
	const snapshot = await getDocs(q);
	return snapshot.empty;
};

/**
 * Génère un code de session unique (vérifie l'unicité)
 */
export const generateUniqueShareCode = async (): Promise<string> => {
	let shareCode = generateShareCode();
	let attempts = 0;
	const maxAttempts = 10;

	while (!(await isShareCodeUnique(shareCode)) && attempts < maxAttempts) {
		shareCode = generateShareCode();
		attempts++;
	}

	if (attempts >= maxAttempts) {
		throw new Error('Impossible de générer un code unique');
	}

	return shareCode;
};

/**
 * Génère le lien de partage complet pour une session
 */
export const generateShareLink = (shareCode: string): string => {
	const baseUrl = window.location.origin;
	return `${baseUrl}/session/join?code=${shareCode}`;
};

/**
 * Crée une nouvelle session de quiz
 */
export const createSession = async (
	creatorId: string,
	creatorEmail: string,
	questions: QuestionData[]
): Promise<{ sessionId: string; shareCode: string }> => {
	if (!questions || questions.length === 0) {
		throw new Error('Au moins une question est requise');
	}

	if (!creatorId) {
		throw new Error('ID créateur requis');
	}

	console.log('Creating session with:', {
		creatorId,
		creatorEmail,
		questionsCount: questions.length,
	});

	// Valider et nettoyer les questions
	const cleanedQuestions = questions.map((q, index) => {
		if (!q.questionId || !q.questionText || !q.options || !q.correctAnswer || !q.answerType) {
			console.error(`Question ${index} invalide:`, q);
			throw new Error(`Question ${index} a des champs manquants`);
		}
		return {
			questionId: q.questionId,
			questionText: q.questionText,
			options: q.options,
			correctAnswer: q.correctAnswer,
			answerType: q.answerType, // M, S, ou TF
			feedback: q.feedback || '', // Feedback optionnel
		};
	});

	const shareCode = await generateUniqueShareCode();
	const sessionRef = doc(collection(db, 'sessions'));

	const sessionData = {
		sessionId: sessionRef.id,
		shareCode,
		creatorId,
		creatorEmail: creatorEmail || 'anonymous',
		status: SessionStatus.WAITING,
		createdAt: serverTimestamp(),
		startedAt: null,
		endedAt: null,
		totalDuration: 0,
		questions: cleanedQuestions,
		currentQuestionIndex: 0,
		participantCount: 0,
	};

	console.log('Session data to save:', sessionData);

	await setDoc(sessionRef, sessionData);

	// Créer le participant créateur
	const creatorParticipantRef = doc(
		collection(db, `sessions/${sessionRef.id}/participants`)
	);
	await setDoc(creatorParticipantRef, {
		participantId: creatorParticipantRef.id,
		userId: creatorId,
		displayName: creatorEmail ? creatorEmail.split('@')[0] : 'Créateur',
		joinedAt: serverTimestamp(),
		isCreator: true,
		score: 0,
		answers: [],
	});

	// Incrémenter le compteur de participants
	await updateDoc(sessionRef, {
		participantCount: increment(1),
	});

	return {
		sessionId: sessionRef.id,
		shareCode,
		participantId: creatorParticipantRef.id // Retourner l'ID du participant créateur
	};
};

/**
 * Récupère une session par son code de partage
 */
export const getSessionByShareCode = async (
	shareCode: string
): Promise<{ sessionId: string; sessionData: any } | null> => {
	const sessionsRef = collection(db, 'sessions');
	const q = query(sessionsRef, where('shareCode', '==', shareCode.toUpperCase()));
	const snapshot = await getDocs(q);

	if (snapshot.empty) {
		return null;
	}

	const sessionDoc = snapshot.docs[0];
	return {
		sessionId: sessionDoc.id,
		sessionData: sessionDoc.data(),
	};
};

/**
 * Permet à un participant de rejoindre une session
 */
export const joinSession = async (
	shareCode: string,
	displayName: string,
	userId: string | null = null
): Promise<{ sessionId: string; participantId: string }> => {
	const sessionInfo = await getSessionByShareCode(shareCode);

	if (!sessionInfo) {
		throw new Error('Code de session invalide');
	}

	const { sessionId, sessionData } = sessionInfo;

	// Vérifier le statut de la session
	if (sessionData.status === SessionStatus.COMPLETED) {
		throw new Error('Cette session est terminée');
	}

	// Créer le participant
	const participantRef = doc(collection(db, `sessions/${sessionId}/participants`));
	await setDoc(participantRef, {
		participantId: participantRef.id,
		userId,
		displayName,
		joinedAt: serverTimestamp(),
		isCreator: false,
		score: 0,
		answers: [],
	});

	// Incrémenter le compteur de participants
	await updateDoc(doc(db, 'sessions', sessionId), {
		participantCount: increment(1),
	});

	return { sessionId, participantId: participantRef.id };
};

/**
 * Démarre une session (créateur uniquement)
 */
export const startSession = async (sessionId: string): Promise<void> => {
	const sessionRef = doc(db, 'sessions', sessionId);
	await updateDoc(sessionRef, {
		status: SessionStatus.ACTIVE,
		startedAt: serverTimestamp(),
	});
};

/**
 * Calcule le score d'une réponse (sans bonus de rapidité)
 * Score de base : 1000 points si correct
 */
export const calculateScore = (
	isCorrect: boolean
): number => {
	if (!isCorrect) return 0;
	return 1000; // Score fixe sans bonus de temps
};

/**
 * Soumet la réponse d'un participant
 */
export const submitAnswer = async (
	sessionId: string,
	participantId: string,
	questionId: string,
	answer: string,
	correctAnswer: string
): Promise<number> => {
	const isCorrect = answer === correctAnswer;
	const score = calculateScore(isCorrect);

	const participantRef = doc(
		db,
		`sessions/${sessionId}/participants/${participantId}`
	);

	const answerData: Answer = {
		questionId,
		answer,
		isCorrect,
		responseTime: 0, // Pas de temps car pas de timer
		answeredAt: new Date(),
		score,
	};

	await updateDoc(participantRef, {
		answers: arrayUnion(answerData),
		score: increment(score),
	});

	return score;
};

/**
 * Met à jour le classement après une question
 */
export const updateLeaderboard = async (
	sessionId: string,
	questionIndex: number
): Promise<LeaderboardEntry[]> => {
	const participantsRef = collection(db, `sessions/${sessionId}/participants`);
	const snapshot = await getDocs(participantsRef);

	const rankings: LeaderboardEntry[] = snapshot.docs
		.map((doc) => {
			const data = doc.data();
			const totalResponseTime = data.answers.reduce(
				(sum: number, ans: Answer) => sum + ans.responseTime,
				0
			);
			return {
				participantId: doc.id,
				displayName: data.displayName,
				score: data.score || 0,
				rank: 0,
				totalResponseTime,
			};
		})
		.sort((a, b) => {
			// Tri par score décroissant
			if (b.score !== a.score) return b.score - a.score;
			// En cas d'égalité, tri par temps de réponse croissant
			return a.totalResponseTime - b.totalResponseTime;
		})
		.map((entry, index) => ({ ...entry, rank: index + 1 }));

	// Sauvegarder le classement
	await setDoc(doc(db, `sessions/${sessionId}/leaderboard/${questionIndex}`), {
		rankings,
		updatedAt: serverTimestamp(),
	});

	return rankings;
};

/**
 * Passe à la question suivante
 */
export const nextQuestion = async (sessionId: string): Promise<void> => {
	const sessionRef = doc(db, 'sessions', sessionId);
	await updateDoc(sessionRef, {
		currentQuestionIndex: increment(1),
	});
};

/**
 * Termine une session
 */
export const endSession = async (sessionId: string): Promise<void> => {
	const sessionRef = doc(db, 'sessions', sessionId);
	const sessionSnap = await getDoc(sessionRef);

	if (!sessionSnap.exists()) {
		throw new Error('Session introuvable');
	}

	const sessionData = sessionSnap.data();
	const startedAt = sessionData.startedAt?.toDate();
	const totalDuration = startedAt
		? Math.floor((Date.now() - startedAt.getTime()) / 1000)
		: 0;

	await updateDoc(sessionRef, {
		status: SessionStatus.COMPLETED,
		endedAt: serverTimestamp(),
		totalDuration,
	});

	// Calculer le classement final
	const finalLeaderboard = await updateLeaderboard(
		sessionId,
		sessionData.questions.length
	);

	// Sauvegarder dans l'historique du créateur
	await saveSessionHistory(sessionId, sessionData, finalLeaderboard);
};

/**
 * Sauvegarde l'historique de session pour le créateur
 */
const saveSessionHistory = async (
	sessionId: string,
	sessionData: any,
	finalLeaderboard: LeaderboardEntry[]
): Promise<void> => {
	const creatorId = sessionData.creatorId;
	const participantCount = sessionData.participantCount || 0;

	// Calculer le score moyen
	const averageScore =
		finalLeaderboard.length > 0
			? finalLeaderboard.reduce((sum, entry) => sum + entry.score, 0) /
			finalLeaderboard.length
			: 0;

	// Calculer le taux de complétion (participants ayant répondu à toutes les questions)
	const participantsRef = collection(db, `sessions/${sessionId}/participants`);
	const participantsSnap = await getDocs(participantsRef);
	const totalQuestions = sessionData.questions.length;
	const completedCount = participantsSnap.docs.filter(
		(doc) => doc.data().answers.length === totalQuestions
	).length;
	const completionRate =
		participantCount > 0 ? (completedCount / participantCount) * 100 : 0;

	const historyData = {
		sessionId,
		shareCode: sessionData.shareCode,
		createdAt: sessionData.createdAt,
		participantCount,
		averageScore: Math.round(averageScore),
		completionRate: Math.round(completionRate),
		questions: sessionData.questions,
		finalLeaderboard,
	};

	await setDoc(
		doc(db, `users/${creatorId}/createdSessions/${sessionId}`),
		historyData
	);
};

/**
 * Récupère l'historique des sessions d'un créateur
 */
export const getCreatorSessions = async (
	creatorId: string
): Promise<any[]> => {
	const sessionsRef = collection(db, `users/${creatorId}/createdSessions`);
	const snapshot = await getDocs(sessionsRef);

	return snapshot.docs.map((doc) => ({
		...doc.data(),
		createdAt: doc.data().createdAt?.toDate(),
	}));
};
