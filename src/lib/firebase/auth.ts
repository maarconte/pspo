import {
	getAuth,
	GoogleAuthProvider,
	setPersistence,
	browserSessionPersistence
} from 'firebase/auth';
import { app } from './config';

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Configure session persistence (data cleared when tab closes)
// This is more secure than localStorage as tokens are not persisted across browser sessions
setPersistence(auth, browserSessionPersistence).catch((error) => {
	console.error('Failed to set auth persistence:', error);
});

// Legacy export for backward compatibility
export const Providers = {
	google: googleProvider,
};
