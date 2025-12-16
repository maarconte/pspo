/**
 * Types et interfaces pour le système de sessions collaboratives de quiz
 */

/**
 * Statut d'une session de quiz
 */
export enum SessionStatus {
	WAITING = 'waiting',   // En attente de participants
	ACTIVE = 'active',     // Session en cours
	COMPLETED = 'completed' // Session terminée
}

/**
 * Données d'une question de quiz
 */
export interface QuestionData {
	questionId: string;
	questionText: string;
	options: string[];
	correctAnswer: string;
	answerType: string; // 'M' (multiple), 'S' (single), 'TF' (true/false)
	feedback?: string; // Feedback optionnel pour la question
}

/**
 * Réponse d'un participant à une question
 */
export interface Answer {
	questionId: string;
	answer: string;
	isCorrect: boolean;
	responseTime: number; // en secondes
	answeredAt: Date;
	score: number; // Score obtenu pour cette réponse
}

/**
 * Données d'un participant à une session
 */
export interface ParticipantData {
	participantId: string;
	userId: string | null; // null si participant anonyme
	displayName: string;
	joinedAt: Date;
	isCreator: boolean;
	score: number; // Score total cumulé
	answers: Answer[];
}

/**
 * Entrée dans le classement
 */
export interface LeaderboardEntry {
	participantId: string;
	displayName: string;
	score: number;
	rank: number;
	totalResponseTime: number; // Pour départage en cas d'égalité
}

/**
 * Données complètes d'une session de quiz
 */
export interface SessionData {
	sessionId: string;
	shareCode: string; // Code unique de 6 caractères pour rejoindre
	creatorId: string;
	creatorEmail: string;
	status: SessionStatus;
	createdAt: Date;
	startedAt: Date | null;
	endedAt: Date | null;
	totalDuration: number; // en secondes
	questions: QuestionData[];
	currentQuestionIndex: number;
	participantCount: number;
}

/**
 * Historique d'une session pour le créateur
 */
export interface SessionHistory {
	sessionId: string;
	shareCode: string;
	createdAt: Date;
	participantCount: number;
	averageScore: number;
	completionRate: number; // Pourcentage de participants ayant terminé
	questions: QuestionData[];
	finalLeaderboard: LeaderboardEntry[];
}

/**
 * Statistiques globales du créateur
 */
export interface CreatorStatistics {
	totalSessions: number;
	totalParticipants: number;
	averageParticipantsPerSession: number;
	averageScore: number;
	averageCompletionRate: number;
	mostPopularQuestions: Array<{
		questionId: string;
		questionText: string;
		timesUsed: number;
	}>;
}

/**
 * Données de progression pour graphiques
 */
export interface ProgressionData {
	sessionId: string;
	date: Date;
	averageScore: number;
	participantCount: number;
}
