import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from './authService';
import { sendSignInLinkToEmail, signInWithEmailLink, signOut } from 'firebase/auth';

// Mock firebase/auth
vi.mock('firebase/auth', () => ({
	getAuth: vi.fn(),
	sendSignInLinkToEmail: vi.fn(),
	isSignInWithEmailLink: vi.fn(),
	signInWithEmailLink: vi.fn(),
	signOut: vi.fn(),
}));

// Mock the internal firebase config/auth export
vi.mock('../../../lib/firebase', () => ({
	auth: {},
}));

// Mock local storage
const localStorageMock = (() => {
	let store: Record<string, string> = {};
	return {
		getItem: vi.fn((key: string) => store[key] || null),
		setItem: vi.fn((key: string, value: string) => {
			store[key] = value.toString();
		}),
		removeItem: vi.fn((key: string) => {
			delete store[key];
		}),
		clear: vi.fn(() => {
			store = {};
		}),
	};
})();

Object.defineProperty(window, 'localStorage', {
	value: localStorageMock,
});

describe('authService', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		localStorageMock.clear();
	});

	describe('sendMagicLink', () => {
		it('should send sign-in link and NOT store email in localStorage', async () => {
			const email = 'test@example.com';
			await authService.sendMagicLink(email);
			expect(sendSignInLinkToEmail).toHaveBeenCalledWith(expect.anything(), email, expect.anything());
			expect(localStorageMock.setItem).not.toHaveBeenCalled();
		});
	});

	describe('completeMagicLinkSignIn', () => {
		it('should sign in with provided email', async () => {
			const email = 'test@example.com';
			// Mock successful sign in
			(signInWithEmailLink as any).mockResolvedValue({ user: { email, uid: '123' } });

			await authService.completeMagicLinkSignIn(email);
			expect(signInWithEmailLink).toHaveBeenCalledWith(expect.anything(), email, expect.anything());
			// It should not try to access localStorage
			expect(localStorageMock.getItem).not.toHaveBeenCalled();
			expect(localStorageMock.removeItem).not.toHaveBeenCalled();
		});

		it('should throw error if email is missing (empty string)', async () => {
			await expect(authService.completeMagicLinkSignIn('')).rejects.toThrow('Email manquant');
			expect(localStorageMock.getItem).not.toHaveBeenCalled();
		});

		it('should throw error if email is missing (undefined via cast)', async () => {
			await expect(authService.completeMagicLinkSignIn(undefined as any)).rejects.toThrow('Email manquant');
			expect(localStorageMock.getItem).not.toHaveBeenCalled();
		});
	});

	describe('signOut', () => {
		it('should sign out and NOT try to remove email from localStorage', async () => {
			await authService.signOut();
			expect(signOut).toHaveBeenCalled();
			expect(localStorageMock.removeItem).not.toHaveBeenCalled();
		});
	});
});
