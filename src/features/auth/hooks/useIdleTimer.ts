import { useEffect, useRef, useCallback } from 'react';

interface UseIdleTimerOptions {
	timeout: number; // milliseconds
	onIdle: () => void;
	events?: string[];
}

/**
 * Hook to detect user inactivity
 * @param timeout - Time in milliseconds before considering user idle
 * @param onIdle - Callback function to execute when user becomes idle
 * @param events - Array of events to listen for user activity
 */
export const useIdleTimer = ({
	timeout,
	onIdle,
	events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'],
}: UseIdleTimerOptions) => {
	const timeoutId = useRef<ReturnType<typeof setTimeout> | undefined>();

	const resetTimer = useCallback(() => {
		if (timeoutId.current !== undefined) {
			clearTimeout(timeoutId.current);
		}

		timeoutId.current = setTimeout(() => {
			onIdle();
		}, timeout);
	}, [timeout, onIdle]);

	useEffect(() => {
		// Set initial timer
		resetTimer();

		// Add event listeners for user activity
		events.forEach((event) => {
			window.addEventListener(event, resetTimer);
		});

		// Cleanup on unmount
		return () => {
			if (timeoutId.current !== undefined) {
				clearTimeout(timeoutId.current);
			}
			events.forEach((event) => {
				window.removeEventListener(event, resetTimer);
			});
		};
	}, [events, resetTimer]);

	return { resetTimer };
};
