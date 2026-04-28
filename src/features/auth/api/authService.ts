import {
	isSignInWithEmailLink,
	signInWithEmailLink,
	signOut as firebaseSignOut,
	User
} from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth } from '../../../lib/firebase';

export const authService = {
	sendMagicLink: async (email: string): Promise<void> => {
		if (!email || !email.includes('@')) {
			throw new Error('Invalid email address');
		}

		const continueUrl = import.meta.env.PROD
			? 'https://maarconte.github.io/pspo/'
			: 'http://localhost:3000/';

		try {
			const functions = getFunctions();
			const sendCustomMagicLink = httpsCallable(functions, 'sendCustomMagicLink');
			await sendCustomMagicLink({ email, continueUrl });
			window.localStorage.setItem('emailForSignIn', email);
		} catch (error: any) {
			console.error('Error sending Magic Link:', error);
			throw new Error(error.message || 'Failed to send sign-in link');
		}
	},

	isMagicLink: (url?: string): boolean => {
		return isSignInWithEmailLink(auth, url ?? window.location.href);
	},

	completeMagicLinkSignIn: async (email?: string, url?: string): Promise<User> => {
		// Get saved email if not provided
		let userEmail = email;
		if (!userEmail) {
			userEmail = window.localStorage.getItem('emailForSignIn') || undefined;
		}

		if (!userEmail) {
			throw new Error('Missing email. Please enter your email address.');
		}

		try {
			const result = await signInWithEmailLink(auth, userEmail, url ?? window.location.href);
			// Clean up saved email
			window.localStorage.removeItem('emailForSignIn');
			return result.user;
		} catch (error: any) {
			console.error('Error verifying Magic Link:', error);

			// Custom error messages
			if (error.code === 'auth/invalid-action-code') {
				throw new Error('The sign-in link is invalid or has expired. Please request a new link.');
			} else if (error.code === 'auth/expired-action-code') {
				throw new Error('The sign-in link has expired. Please request a new link.');
			}

			throw new Error(error.message || 'Authentication failed');
		}
	},

	/**
	 * Signs out the user
	 */
	signOut: async (): Promise<void> => {
		await firebaseSignOut(auth);
		// Clean up saved email just in case
		window.localStorage.removeItem('emailForSignIn');
	},

	/**
	 * Gets the currently signed-in user
	 */
	getCurrentUser: (): User | null => {
		return auth.currentUser;
	},

	/**
	 * Gets the saved email for sign-in
	 */
	getSavedEmail: (): string | null => {
		return window.localStorage.getItem('emailForSignIn');
	},
};
