import {
	getAuth,
	setPersistence,
	browserSessionPersistence,
	updateProfile,
	verifyBeforeUpdateEmail
} from 'firebase/auth';
import { app } from './config';

export const auth = getAuth(app);

// Configure session persistence (data cleared when tab closes)
// This is more secure than localStorage as tokens are not persisted across browser sessions
setPersistence(auth, browserSessionPersistence).catch((error) => {
	console.error('Failed to set auth persistence:', error);
});

export const updateUserDisplayName = async (newName: string) => {
	if (!auth.currentUser) throw new Error("No user logged in");
	await updateProfile(auth.currentUser, { displayName: newName });
	return auth.currentUser;
};

export const verifyAndUpdateUserEmail = async (newEmail: string) => {
	if (!auth.currentUser) throw new Error("No user logged in");
	await verifyBeforeUpdateEmail(auth.currentUser, newEmail);
	return auth.currentUser;
};
