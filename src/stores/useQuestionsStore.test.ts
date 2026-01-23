import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useQuestionsStore } from './useQuestionsStore';
import type { Question } from '../utils/types';

describe('useQuestionsStore', () => {
	beforeEach(() => {
		// Reset store before each test
		useQuestionsStore.setState({
			questions: [],
			allQuestions: [],
			score: 0,
			userAnswers: [],
			formation: 'pspo-I',
			isLoading: false,
			error: null,
		});
	});

	it('should have correct initial state', () => {
		const { result } = renderHook(() => useQuestionsStore());

		expect(result.current.questions).toEqual([]);
		expect(result.current.allQuestions).toEqual([]);
		expect(result.current.score).toBe(0);
		expect(result.current.userAnswers).toEqual([]);
		expect(result.current.formation).toBe('pspo-I');
		expect(result.current.isLoading).toBe(false);
		expect(result.current.error).toBeNull();
	});

	it('should set score', () => {
		const { result } = renderHook(() => useQuestionsStore());

		act(() => {
			result.current.setScore(75);
		});

		expect(result.current.score).toBe(75);
	});

	it('should set user answers', () => {
		const { result } = renderHook(() => useQuestionsStore());
		const answers = [
			{ question: 0, answer: 1, isBookmarked: false },
			{ question: 1, answer: 2, isBookmarked: true },
		];

		act(() => {
			result.current.setUserAnswers(answers);
		});

		expect(result.current.userAnswers).toEqual(answers);
	});

	it('should set user answers with function', () => {
		const { result } = renderHook(() => useQuestionsStore());
		const initialAnswers = [{ question: 0, answer: 1, isBookmarked: false }];

		act(() => {
			result.current.setUserAnswers(initialAnswers);
		});

		act(() => {
			result.current.setUserAnswers((prev) => [
				...prev,
				{ question: 1, answer: 2, isBookmarked: false },
			]);
		});

		expect(result.current.userAnswers).toHaveLength(2);
	});

	it('should load questions and filter by formation', () => {
		const { result } = renderHook(() => useQuestionsStore());
		const mockQuestions: Question[] = [
			{ id: '1', title: 'Q1', type: 'pspo-I', answer: 0, answerType: 'S', answers: [] } as Question,
			{ id: '2', title: 'Q2', type: 'pspo-I', answer: 1, answerType: 'S', answers: [] } as Question,
			{ id: '3', title: 'Q3', type: 'PSM-I', answer: 0, answerType: 'S', answers: [] } as Question,
		];

		act(() => {
			result.current.loadQuestions(mockQuestions);
		});

		expect(result.current.allQuestions).toEqual(mockQuestions);
		expect(result.current.questions).toHaveLength(2);
		expect(result.current.questions.every((q) => q.type === 'pspo-I')).toBe(true);
	});

	it('should reload questions when formation changes', () => {
		const { result } = renderHook(() => useQuestionsStore());
		const mockQuestions: Question[] = [
			{ id: '1', title: 'Q1', type: 'pspo-I', answer: 0, answerType: 'S', answers: [] } as Question,
			{ id: '2', title: 'Q2', type: 'PSM-I', answer: 1, answerType: 'S', answers: [] } as Question,
			{ id: '3', title: 'Q3', type: 'PSM-I', answer: 0, answerType: 'S', answers: [] } as Question,
		];

		act(() => {
			result.current.loadQuestions(mockQuestions);
		});

		expect(result.current.questions).toHaveLength(1);
		expect(result.current.questions[0].type).toBe('pspo-I');

		act(() => {
			result.current.setFormation('PSM-I');
		});

		expect(result.current.formation).toBe('PSM-I');
		expect(result.current.questions).toHaveLength(2);
		expect(result.current.questions.every((q) => q.type === 'PSM-I')).toBe(true);
	});

	it('should limit questions to 80', () => {
		const { result } = renderHook(() => useQuestionsStore());
		const mockQuestions: Question[] = Array.from({ length: 100 }, (_, i) => ({
			id: `${i}`,
			title: `Q${i}`,
			type: 'pspo-I',
			answer: 0,
			answerType: 'S',
			answers: [],
		})) as Question[];

		act(() => {
			result.current.loadQuestions(mockQuestions);
		});

		expect(result.current.questions).toHaveLength(80);
		expect(result.current.allQuestions).toHaveLength(100);
	});

	it('should set loading state', () => {
		const { result } = renderHook(() => useQuestionsStore());

		act(() => {
			result.current.setLoading(true);
		});

		expect(result.current.isLoading).toBe(true);

		act(() => {
			result.current.setLoading(false);
		});

		expect(result.current.isLoading).toBe(false);
	});

	it('should set error', () => {
		const { result } = renderHook(() => useQuestionsStore());
		const errorMessage = 'Failed to load questions';

		act(() => {
			result.current.setError(errorMessage);
		});

		expect(result.current.error).toBe(errorMessage);
	});
});
