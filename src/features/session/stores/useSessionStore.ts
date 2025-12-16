/**
 * Store Zustand pour la gestion des sessions de quiz collaboratives
 */

import { create } from 'zustand';
import {
	collection,
	doc,
	onSnapshot,
	query,
	Unsubscribe,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import {
	SessionData,
	SessionStatus,
	ParticipantData,
	QuestionData,
	Answer,
	LeaderboardEntry,
	SessionHistory,
	CreatorStatistics,
} from '../types/session.types';
import * as sessionService from '../api/sessionService';

interface SessionStore {
	// Session active
	activeSession: SessionData | null;
	participants: Map<string, ParticipantData>;
	currentLeaderboard: LeaderboardEntry[];

	// Participation personnelle
	myParticipantId: string | null;
	myAnswers: Answer[];
	myScore: number;
	myRank: number;

	// Historique créateur
	mySessions: SessionHistory[];
	sessionStatistics: CreatorStatistics | null;

	// Loading states
	isCreatingSession: boolean;
	isJoiningSession: boolean;
	isLoadingHistory: boolean;

	// Actions de gestion de session
	createSession: (
		creatorId: string,
		creatorEmail: string,
		questions: QuestionData[]
	) => Promise<{ sessionId: string; shareCode: string; participantId: string }>;

	joinSession: (
		shareCode: string,
		displayName: string,
		userId?: string | null
	) => Promise<{ sessionId: string; participantId: string }>;

	startSession: (sessionId: string) => Promise<void>;

	submitAnswer: (
		sessionId: string,
		participantId: string,
		questionId: string,
		answer: string
	) => Promise<number>;

	nextQuestion: (sessionId: string) => Promise<void>;

	endSession: (sessionId: string) => Promise<void>;

	leaveSession: () => void;

	// Actions de synchronisation temps réel
	syncSession: (sessionId: string) => Unsubscribe;
	syncParticipants: (sessionId: string) => Unsubscribe;
	syncLeaderboard: (sessionId: string, questionIndex: number) => Unsubscribe;

	// Actions historique
	loadCreatorSessions: (creatorId: string) => Promise<void>;
	calculateStatistics: () => void;

	// Actions internes
	setActiveSession: (session: SessionData | null) => void;
	setParticipants: (participants: Map<string, ParticipantData>) => void;
	setCurrentLeaderboard: (leaderboard: LeaderboardEntry[]) => void;
	setMyParticipantId: (participantId: string | null) => void;
	updateMyScore: (score: number) => void;
	updateMyRank: (rank: number) => void;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
	// État initial
	activeSession: null,
	participants: new Map(),
	currentLeaderboard: [],
	myParticipantId: null,
	myAnswers: [],
	myScore: 0,
	myRank: 0,
	mySessions: [],
	sessionStatistics: null,
	isCreatingSession: false,
	isJoiningSession: false,
	isLoadingHistory: false,

	// Créer une session
	createSession: async (creatorId, creatorEmail, questions) => {
		set({ isCreatingSession: true });
		try {
			const result = await sessionService.createSession(
				creatorId,
				creatorEmail,
				questions
			);
			return result;
		} finally {
			set({ isCreatingSession: false });
		}
	},

	// Rejoindre une session
	joinSession: async (shareCode, displayName, userId = null) => {
		set({ isJoiningSession: true });
		try {
			const result = await sessionService.joinSession(
				shareCode,
				displayName,
				userId
			);
			set({ myParticipantId: result.participantId });
			return result;
		} finally {
			set({ isJoiningSession: false });
		}
	},

	// Démarrer une session
	startSession: async (sessionId) => {
		await sessionService.startSession(sessionId);
	},

	// Soumettre une réponse
	submitAnswer: async (sessionId, participantId, questionId, answer) => {
		const { activeSession } = get();
		if (!activeSession) {
			throw new Error('Aucune session active');
		}

		const currentQuestion = activeSession.questions[activeSession.currentQuestionIndex];
		const score = await sessionService.submitAnswer(
			sessionId,
			participantId,
			questionId,
			answer,
			currentQuestion.correctAnswer
		);

		// Mettre à jour le score local
		set((state) => ({
			myScore: state.myScore + score,
			myAnswers: [
				...state.myAnswers,
				{
					questionId,
					answer,
					isCorrect: answer === currentQuestion.correctAnswer,
					responseTime: 0,
					answeredAt: new Date(),
					score,
				},
			],
		}));

		return score;
	},

	// Question suivante
	nextQuestion: async (sessionId) => {
		const { activeSession } = get();
		if (!activeSession) return;

		// Mettre à jour le classement avant de passer à la question suivante
		await sessionService.updateLeaderboard(
			sessionId,
			activeSession.currentQuestionIndex
		);

		await sessionService.nextQuestion(sessionId);
	},

	// Terminer la session
	endSession: async (sessionId) => {
		await sessionService.endSession(sessionId);
	},

	// Quitter la session
	leaveSession: () => {
		set({
			activeSession: null,
			participants: new Map(),
			currentLeaderboard: [],
			myParticipantId: null,
			myAnswers: [],
			myScore: 0,
			myRank: 0,
		});
	},

	// Synchroniser la session en temps réel
	syncSession: (sessionId) => {
		const sessionRef = doc(db, 'sessions', sessionId);

		return onSnapshot(sessionRef, (snapshot) => {
			if (snapshot.exists()) {
				const data = snapshot.data();
				const session: SessionData = {
					sessionId: snapshot.id,
					shareCode: data.shareCode,
					creatorId: data.creatorId,
					creatorEmail: data.creatorEmail,
					status: data.status as SessionStatus,
					createdAt: data.createdAt?.toDate() || new Date(),
					startedAt: data.startedAt?.toDate() || null,
					endedAt: data.endedAt?.toDate() || null,
					totalDuration: data.totalDuration || 0,
					questions: data.questions || [],
					currentQuestionIndex: data.currentQuestionIndex || 0,
					participantCount: data.participantCount || 0,
				};
				set({ activeSession: session });
			}
		});
	},

	// Synchroniser les participants en temps réel
	syncParticipants: (sessionId) => {
		const participantsRef = collection(db, `sessions/${sessionId}/participants`);

		return onSnapshot(participantsRef, (snapshot) => {
			const participantsMap = new Map<string, ParticipantData>();

			snapshot.docs.forEach((doc) => {
				const data = doc.data();
				participantsMap.set(doc.id, {
					participantId: doc.id,
					userId: data.userId || null,
					displayName: data.displayName,
					joinedAt: data.joinedAt?.toDate() || new Date(),
					isCreator: data.isCreator || false,
					score: data.score || 0,
					answers: data.answers || [],
				});
			});

			set({ participants: participantsMap });

			// Mettre à jour le score et rang personnel
			const { myParticipantId } = get();
			if (myParticipantId) {
				const myData = participantsMap.get(myParticipantId);
				if (myData) {
					set({ myScore: myData.score });
				}
			}
		});
	},

	// Synchroniser le classement en temps réel
	syncLeaderboard: (sessionId, questionIndex) => {
		const leaderboardRef = doc(
			db,
			`sessions/${sessionId}/leaderboard/${questionIndex}`
		);

		return onSnapshot(leaderboardRef, (snapshot) => {
			if (snapshot.exists()) {
				const data = snapshot.data();
				const leaderboard: LeaderboardEntry[] = data.rankings || [];
				set({ currentLeaderboard: leaderboard });

				// Mettre à jour le rang personnel
				const { myParticipantId } = get();
				if (myParticipantId) {
					const myEntry = leaderboard.find(
						(entry) => entry.participantId === myParticipantId
					);
					if (myEntry) {
						set({ myRank: myEntry.rank });
					}
				}
			}
		});
	},

	// Charger l'historique des sessions du créateur
	loadCreatorSessions: async (creatorId) => {
		set({ isLoadingHistory: true });
		try {
			const sessions = await sessionService.getCreatorSessions(creatorId);
			set({ mySessions: sessions });
			get().calculateStatistics();
		} finally {
			set({ isLoadingHistory: false });
		}
	},

	// Calculer les statistiques globales
	calculateStatistics: () => {
		const { mySessions } = get();

		if (mySessions.length === 0) {
			set({ sessionStatistics: null });
			return;
		}

		const totalSessions = mySessions.length;
		const totalParticipants = mySessions.reduce(
			(sum, session) => sum + session.participantCount,
			0
		);
		const averageParticipantsPerSession = totalParticipants / totalSessions;
		const averageScore =
			mySessions.reduce((sum, session) => sum + session.averageScore, 0) /
			totalSessions;

		// Questions les plus utilisées
		const questionUsage = new Map<string, { text: string; count: number }>();
		mySessions.forEach((session) => {
			session.questions.forEach((q) => {
				const existing = questionUsage.get(q.questionId);
				if (existing) {
					existing.count++;
				} else {
					questionUsage.set(q.questionId, {
						text: q.questionText,
						count: 1,
					});
				}
			});
		});

		const mostPopularQuestions = Array.from(questionUsage.entries())
			.sort((a, b) => b[1].count - a[1].count)
			.slice(0, 5)
			.map(([questionId, data]) => ({
				questionId,
				questionText: data.text,
				timesUsed: data.count,
			}));

		const statistics: CreatorStatistics = {
			totalSessions,
			totalParticipants,
			averageParticipantsPerSession: Math.round(averageParticipantsPerSession * 10) / 10,
			averageScore: Math.round(averageScore),
			averageCompletionRate:
				mySessions.reduce((sum, session) => sum + session.completionRate, 0) /
				totalSessions,
			mostPopularQuestions,
		};

		set({ sessionStatistics: statistics });
	},

	// Actions internes
	setActiveSession: (session) => set({ activeSession: session }),
	setParticipants: (participants) => set({ participants }),
	setCurrentLeaderboard: (leaderboard) => set({ currentLeaderboard: leaderboard }),
	setMyParticipantId: (participantId) => set({ myParticipantId: participantId }),
	updateMyScore: (score) => set({ myScore: score }),
	updateMyRank: (rank) => set({ myRank: rank }),
}));
