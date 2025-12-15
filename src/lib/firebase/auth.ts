import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { app } from './config';

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Legacy export for backward compatibility
export const Providers = {
	google: googleProvider,
};
