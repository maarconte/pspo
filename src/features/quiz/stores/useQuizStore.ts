import { toast } from "react-toastify";
import { create } from "zustand";
import { Question, UserAnswer } from "../../../utils/types";

interface QuestionsState {
	questions: Question[];
	allQuestions: Question[];
	score: number;
	userAnswers: UserAnswer[];
	formation: string;
	isLoading: boolean;
	error: string | null;

	// Actions
	setScore: (score: number) => void;
	setUserAnswers: (answers: UserAnswer[] | ((prev: UserAnswer[]) => UserAnswer[])) => void;
	setFormation: (formation: string) => void;
	setQuestions: (questions: Question[]) => void;
	setAllQuestions: (questions: Question[]) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	loadQuestions: (data: Question[]) => void;
	refetch: () => void;
}

export const useQuestionsStore = create<QuestionsState>((set, get) => ({
	questions: [],
	allQuestions: [],
	score: 0,
	userAnswers: [],
	formation: "pspo-I",
	isLoading: false,
	error: null,

	setScore: (score) => set({ score }),

	setUserAnswers: (answers) => {
		if (typeof answers === "function") {
			set((state) => ({ userAnswers: answers(state.userAnswers) }));
		} else {
			set({ userAnswers: answers });
		}
	},

	setFormation: (formation) => {
		set({ formation });
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
		const { formation } = get();

		// Filter questions by formation type
		const selectedQuestionsByType = data.filter(
			(question) => question.type === formation
		);

		if (selectedQuestionsByType.length > 0) {
			// Shuffle and select 80 random questions
			const shuffled = [...selectedQuestionsByType].sort(() => Math.random() - 0.5);
			const selected = shuffled.slice(0, 80);
			set({ questions: selected, allQuestions: data });
		} else {
			set({ questions: [], allQuestions: data });
		}
	},

	refetch: () => {
		// This will be called from components that use useFetchFirebase
		// The actual refetch logic is handled by the hook
	},
}));
