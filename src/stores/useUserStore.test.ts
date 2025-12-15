import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUserStore } from './useUserStore';
import type { User } from 'firebase/auth';

// Mock Firebase auth
vi.mock('../firebase', () => ({
	auth: {
		currentUser: null,
		onAuthStateChanged: vi.fn((callback) => {
			// Immediately call with null user
			callback(null);
			// Return unsubscribe function
			return vi.fn();
		}),
	},
}));

describe('useUserStore', () => {
	beforeEach(() => {
		// Reset store before each test
		useUserStore.setState({
			user: null,
		});
		vi.clearAllMocks();
	});

	it('should have null user initially', () => {
		const { result } = renderHook(() => useUserStore());
		expect(result.current.user).toBeNull();
	});

	it('should set user', () => {
		const { result } = renderHook(() => useUserStore());
		const mockUser = {
			uid: 'test-uid',
			email: 'test@example.com',
			displayName: 'Test User',
		} as User;

		act(() => {
			result.current.setUser(mockUser);
		});

		expect(result.current.user).toEqual(mockUser);
	});

	it('should clear user when set to null', () => {
		const { result } = renderHook(() => useUserStore());
		const mockUser = {
			uid: 'test-uid',
			email: 'test@example.com',
		} as User;

		act(() => {
			result.current.setUser(mockUser);
		});

		expect(result.current.user).toEqual(mockUser);

		act(() => {
			result.current.setUser(null);
		});

		expect(result.current.user).toBeNull();
	});
});
