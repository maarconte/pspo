import {
	getAuth,
	setPersistence,
	browserLocalPersistence,
	updateProfile,
	verifyBeforeUpdateEmail
} from 'firebase/auth';
import { app } from './config';

export const auth = getAuth(app);

// Local persistence: the session is shared across tabs and survives closing the
// browser, so links opened from outside the app (e.g. ticket notification emails)
// land on a logged-in user. The 30-minute idle timeout still limits the session.
setPersistence(auth, browserLocalPersistence).catch((error) => {
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
