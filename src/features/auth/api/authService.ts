import {
	signInWithPopup,
	signOut as firebaseSignOut,
	User
} from 'firebase/auth';
import { auth, googleProvider } from '../../../lib/firebase';

export const authService = {
	signInWithGoogle: async (): Promise<User> => {
		const result = await signInWithPopup(auth, googleProvider);
		return result.user;
	},

	signOut: async (): Promise<void> => {
		await firebaseSignOut(auth);
	},

	getCurrentUser: (): User | null => {
		return auth.currentUser;
	},
};
