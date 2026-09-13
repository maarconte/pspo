import { toast } from "react-toastify";
import { create } from "zustand";
import { Question, UserAnswer } from "../utils/types";

export interface QuizConfig {
	questionCount: number;
	durationMinutes: number;
	minSuccessPercent: number;
}

export const DEFAULT_QUIZ_CONFIG: QuizConfig = {
	questionCount: 80,
	durationMinutes: 60,
	minSuccessPercent: 85,
};

interface QuestionsState {
	questions: Question[];
	allQuestions: Question[];
	score: number;
	userAnswers: UserAnswer[];
	formation: string;
	isLoading: boolean;
	error: string | null;
	totalTimeSpent: number;
	quizConfig: QuizConfig;

	// Actions
	setTotalTimeSpent: (time: number) => void;
	setScore: (score: number) => void;
	setUserAnswers: (answers: UserAnswer[] | ((prev: UserAnswer[]) => UserAnswer[])) => void;
	setFormation: (formation: string) => void;
	setQuestions: (questions: Question[]) => void;
	setAllQuestions: (questions: Question[]) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	setQuizConfig: (config: QuizConfig) => void;
	loadQuestions: (data: Question[]) => void;
	refetch: () => void;
	setAnswer: (index: number, answer: UserAnswer['answer']) => void;
	toggleBookmark: (index: number) => void;
	calculateScore: () => number;
	getSuccessPercentage: () => number;
	startNewExam: () => void;
}

export const useQuestionsStore = create<QuestionsState>((set, get) => ({
	questions: [],
	allQuestions: [],
	score: 0,
	userAnswers: [],
	formation: "pspo-I",
	isLoading: false,
	error: null,
	totalTimeSpent: 0,
	quizConfig: DEFAULT_QUIZ_CONFIG,

	setTotalTimeSpent: (time) => set({ totalTimeSpent: time }),
	setScore: (score) => set({ score }),
	setQuizConfig: (config) => set({ quizConfig: config }),

	setUserAnswers: (answers) => {
		if (typeof answers === "function") {
			set((state) => ({ userAnswers: answers(state.userAnswers) }));
		} else {
			set({ userAnswers: answers });
		}
	},

	setFormation: (formation) => {
		set({ formation, questions: [] });
		// Reload questions when formation changes
		const { allQuestions } = get();
		if (allQuestions.length > 0) {
			get().loadQuestions(allQuestions);
		}
	},

	setQuestions: (questions) => set({ questions }),

	setAllQuestions: (questions) => set({ allQuestions: questions }),

	setLoading: (loading) => set({ isLoading: loading }),

	setError: (error) => set({ error }),

	loadQuestions: (data) => {
		const { formation, questions, quizConfig } = get();

		// Filter questions by formation type
		const selectedQuestionsByType = data.filter(
			(question) => question.type === formation
		);

		let newQuestions = questions;
		if (questions.length === 0) {
			if (selectedQuestionsByType.length > 0) {
				// Shuffle and select the module's configured question count initially
				const shuffled = [...selectedQuestionsByType].sort(() => Math.random() - 0.5);
				newQuestions = shuffled.slice(0, quizConfig.questionCount);
			}
		} else {
			// Update existing quiz questions with new values from data to avoid shuffling during background sync
			newQuestions = questions.map((q) => {
				const updatedQ = data.find((newQ) => newQ.id === q.id);
				return updatedQ || q;
			});
		}

		set({ questions: newQuestions, allQuestions: data });
	},

	refetch: () => {
		// This will be called from components that use useFetchFirebase
		// The actual refetch logic is handled by the hook
	},

	setAnswer: (index, answer) => {
		set((state) => {
			const newUserAnswers = [...state.userAnswers];
			newUserAnswers[index] = {
				...newUserAnswers[index],
				question: index,
				answer,
			};
			return { userAnswers: newUserAnswers };
		});
	},

	toggleBookmark: (index) => {
		set((state) => {
			const newUserAnswers = [...state.userAnswers];
			newUserAnswers[index] = {
				...newUserAnswers[index],
				question: index,
				isBookmarked: !newUserAnswers[index]?.isBookmarked,
			};
			return { userAnswers: newUserAnswers };
		});
	},

	calculateScore: () => {
		const { userAnswers, questions } = get();
		let currentScore = 0;
		userAnswers?.forEach((userAnswer) => {
			if (!userAnswer || !questions?.[userAnswer.question]) return;
			const question = questions[userAnswer.question];
			const correctAnswer = question?.answer;
			const userAnswerValue = userAnswer?.answer;

			if (Array.isArray(correctAnswer) && Array.isArray(userAnswerValue)) {
				if (correctAnswer.length === userAnswerValue.length) {
					const sortedCorrect = [...correctAnswer].sort();
					const sortedUser = [...userAnswerValue].sort();
					if (sortedCorrect.every((val, idx) => val === sortedUser[idx])) {
						currentScore++;
					}
				}
			} else if (correctAnswer === userAnswerValue) {
				currentScore++;
			}
		});
		return currentScore;
	},

	getSuccessPercentage: () => {
		const score = get().calculateScore();
		const userAnswers = get().userAnswers;
		const answeredCount = userAnswers.filter((a) => a?.answer !== undefined).length;
		
		if (answeredCount === 0) return 0;
		
		const percentage = Math.round((score / answeredCount) * 100);
		return Math.min(100, percentage);
	},

	startNewExam: () => {
		const { allQuestions, formation, quizConfig } = get();
		const selectedQuestionsByType = allQuestions.filter(q => q.type === formation);

		let newQuestions: Question[] = [];
		if (selectedQuestionsByType.length > 0) {
			const shuffled = [...selectedQuestionsByType].sort(() => Math.random() - 0.5);
			newQuestions = shuffled.slice(0, quizConfig.questionCount);
		}

		set({
			questions: newQuestions,
			userAnswers: [],
			score: 0,
			totalTimeSpent: 0,
		});
	},
}));
