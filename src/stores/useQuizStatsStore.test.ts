import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useQuizStatsStore } from './useQuizStatsStore';

describe('useQuizStatsStore', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		useQuizStatsStore.setState({
			isTracking: false,
			questionStartTime: null,
			currentQuestionId: null,
			questionStats: [],
			pausedAt: null,
		});
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('excludes paused time from the recorded question duration', () => {
		const { result } = renderHook(() => useQuizStatsStore());

		act(() => {
			result.current.startTracking();
			result.current.startQuestion(0);
		});

		act(() => {
			vi.advanceTimersByTime(5000); // 5s of active time
			result.current.pauseTracking();
		});

		act(() => {
			vi.advanceTimersByTime(10000); // 10s paused — should not count
			result.current.resumeTracking();
		});

		act(() => {
			vi.advanceTimersByTime(2000); // 2s more active time
			result.current.endQuestion({
				questionId: 'q1',
				isCorrect: true,
				userAnswer: 0,
				isBookmarked: false,
			});
		});

		const summary = result.current.getSummary();
		expect(summary.totalTimeMs).toBe(7000);
	});

	it('ignores a redundant pauseTracking call while already paused', () => {
		const { result } = renderHook(() => useQuizStatsStore());

		act(() => {
			result.current.startTracking();
			result.current.startQuestion(0);
		});

		act(() => {
			vi.advanceTimersByTime(1000);
			result.current.pauseTracking();
		});

		act(() => {
			vi.advanceTimersByTime(3000);
			result.current.pauseTracking(); // no-op: already paused
		});

		act(() => {
			result.current.resumeTracking();
			vi.advanceTimersByTime(1000);
			result.current.endQuestion({
				questionId: 'q1',
				isCorrect: true,
				userAnswer: 0,
				isBookmarked: false,
			});
		});

		// 1s active before pause + 1s active after resume = 2s;
		// the whole 4s paused window is excluded regardless of the repeated call.
		expect(result.current.getSummary().totalTimeMs).toBe(2000);
	});
});
