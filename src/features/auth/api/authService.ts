import {
	sendSignInLinkToEmail,
	isSignInWithEmailLink,
	signInWithEmailLink,
	signOut as firebaseSignOut,
	User
} from 'firebase/auth';
import { auth } from '../../../lib/firebase';

// Configuration pour le Magic Link
const actionCodeSettings = {
	// En production, inclure le base path /pspo/
	url: import.meta.env.PROD
		? 'https://maarconte.github.io/pspo/'
		: 'http://localhost:3000/auth/verify',
	handleCodeInApp: true,
};

export const authService = {
	/**
	 * Envoie un Magic Link à l'adresse email fournie
	 * @param email - Adresse email de l'utilisateur
	 * @returns Promise<void>
	 * @throws Error si l'email est invalide ou l'envoi échoue
	 */
	sendMagicLink: async (email: string): Promise<void> => {
		// Validation basique de l'email
		if (!email || !email.includes('@')) {
			throw new Error('Adresse email invalide');
		}

		try {
			await sendSignInLinkToEmail(auth, email, actionCodeSettings);
			// Note: On ne sauvegarde plus l'email localement pour des raisons de sécurité (PII dans localStorage)
		} catch (error: any) {
			console.error('Erreur lors de l\'envoi du Magic Link:', error);
			throw new Error(error.message || 'Échec de l\'envoi du lien de connexion');
		}
	},

	/**
	 * Vérifie si l'URL actuelle est un lien de connexion Magic Link
	 * @returns boolean
	 */
	isMagicLink: (): boolean => {
		return isSignInWithEmailLink(auth, window.location.href);
	},

	/**
	 * Complète la connexion avec le Magic Link
	 * @param email - Email de l'utilisateur
	 * @returns Promise<User>
	 * @throws Error si le lien est invalide ou expiré
	 */
	completeMagicLinkSignIn: async (email: string): Promise<User> => {
		if (!email) {
			throw new Error('Email manquant. Veuillez saisir votre adresse email.');
		}

		try {
			const result = await signInWithEmailLink(auth, email, window.location.href);
			return result.user;
		} catch (error: any) {
			console.error('Erreur lors de la vérification du Magic Link:', error);

			// Messages d'erreur personnalisés
			if (error.code === 'auth/invalid-action-code') {
				throw new Error('Le lien de connexion est invalide ou a expiré. Veuillez demander un nouveau lien.');
			} else if (error.code === 'auth/expired-action-code') {
				throw new Error('Le lien de connexion a expiré. Veuillez demander un nouveau lien.');
			}

			throw new Error(error.message || 'Échec de la connexion');
		}
	},

	/**
	 * Déconnecte l'utilisateur
	 */
	signOut: async (): Promise<void> => {
		await firebaseSignOut(auth);
	},

	/**
	 * Récupère l'utilisateur actuellement connecté
	 */
	getCurrentUser: (): User | null => {
		return auth.currentUser;
	},
};
