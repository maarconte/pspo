import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

/**
 * Cloud Function pour attribuer un rôle à un utilisateur
 * Réservée aux utilisateurs avec le rôle "dev"
 */
export const setUserRole = functions.https.onCall(async (data, context) => {
	// Vérifier que l'utilisateur est authentifié
	if (!context.auth) {
		throw new functions.https.HttpsError(
			'unauthenticated',
			'Vous devez être connecté pour effectuer cette action'
		);
	}

	// Vérifier que l'appelant est un dev
	if (context.auth.token.role !== 'dev') {
		throw new functions.https.HttpsError(
			'permission-denied',
			'Seuls les développeurs peuvent attribuer des rôles'
		);
	}

	const { userId, role } = data;

	// Valider les paramètres
	if (!userId || typeof userId !== 'string') {
		throw new functions.https.HttpsError(
			'invalid-argument',
			'userId est requis et doit être une chaîne de caractères'
		);
	}

	if (!role || !['dev', 'admin', 'client'].includes(role)) {
		throw new functions.https.HttpsError(
			'invalid-argument',
			'Le rôle doit être "dev", "admin" ou "client"'
		);
	}

	try {
		// Définir le custom claim
		await admin.auth().setCustomUserClaims(userId, { role });

		// Mettre à jour le document utilisateur dans Firestore
		await admin.firestore().collection('users').doc(userId).set(
			{
				role,
				updatedAt: admin.firestore.FieldValue.serverTimestamp(),
			},
			{ merge: true }
		);

		functions.logger.info(`Rôle "${role}" attribué à l'utilisateur ${userId}`);

		return {
			success: true,
			message: `Rôle "${role}" attribué avec succès`
		};
	} catch (error: any) {
		functions.logger.error('Erreur lors de l\'attribution du rôle:', error);
		throw new functions.https.HttpsError(
			'internal',
			'Erreur lors de l\'attribution du rôle: ' + error.message
		);
	}
});

/**
 * Trigger automatique lors de la création d'un utilisateur
 * Attribue le rôle "client" par défaut
 */
export const onUserCreated = functions.auth.user().onCreate(async (user) => {
	try {
		// Attribuer le rôle "client" par défaut
		await admin.auth().setCustomUserClaims(user.uid, { role: 'client' });

		// Créer le document utilisateur dans Firestore
		await admin.firestore().collection('users').doc(user.uid).set({
			email: user.email,
			role: 'client',
			createdAt: admin.firestore.FieldValue.serverTimestamp(),
			updatedAt: admin.firestore.FieldValue.serverTimestamp(),
		});

		functions.logger.info(`Utilisateur ${user.uid} créé avec le rôle "client"`);
	} catch (error: any) {
		functions.logger.error('Erreur lors de la création de l\'utilisateur:', error);
		// Ne pas throw pour ne pas bloquer la création de l'utilisateur
	}
});
