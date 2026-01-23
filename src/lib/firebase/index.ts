import { GoogleAuthProvider } from "firebase/auth";

// Centralized Firebase exports
export * from './config';
export * from './auth';
export * from './firestore';
export const GoogleAuthProviders = { google: new GoogleAuthProvider() };

