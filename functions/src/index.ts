import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

admin.initializeApp();

function buildEmailHtml(link: string): string {
	return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Votre lien de connexion — Study Group</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f8;font-family:'Libre Franklin',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td style="padding:40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;margin:0 auto;">

          <!-- Header -->
          <tr>
            <td style="background-color:#5236ab;border-radius:12px 12px 0 0;padding:32px 40px;text-align:center;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">Study Group</p>
              <p style="margin:6px 0 0;font-size:12px;font-weight:400;color:rgba(255,255,255,0.7);letter-spacing:0.5px;text-transform:uppercase;">Certification Scrum</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#ffffff;padding:40px 40px 32px;">
              <p style="margin:0 0 8px;font-size:16px;color:#1a1a2e;font-weight:600;">Bonjour,</p>
              <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#4a4a6a;">
                Vous avez demandé un lien pour vous connecter à <strong>Study Group</strong>. Cliquez sur le bouton ci-dessous pour accéder à votre espace.
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto 28px;">
                <tr>
                  <td style="border-radius:30px;background-color:#5236ab;">
                    <a href="${link}" target="_blank" style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:30px;letter-spacing:0.2px;">Se connecter →</a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 6px;font-size:13px;color:#8888a8;text-align:center;">Ce lien est valable pendant <strong>1 heure</strong>.</p>
              <p style="margin:0;font-size:13px;color:#8888a8;text-align:center;">Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :</p>
              <p style="margin:8px 0 0;font-size:11px;color:#aaaacc;text-align:center;word-break:break-all;">${link}</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="background-color:#ffffff;padding:0 40px;">
              <hr style="border:none;border-top:1px solid #ebebf5;margin:0;">
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8f8fc;border-radius:0 0 12px 12px;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;color:#aaaacc;">
                Si vous n'avez pas demandé ce lien, ignorez simplement cet email.
              </p>
              <p style="margin:0;font-size:12px;color:#ccccdd;">© Study Group — Agile Training</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export const sendCustomMagicLink = functions
	.runWith({ secrets: ['SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE', 'SMTP_USER', 'SMTP_PASS'] })
	.https.onCall(async (data, _context) => {
		const { email, continueUrl } = data;

		if (!email || typeof email !== 'string' || !email.includes('@')) {
			throw new functions.https.HttpsError('invalid-argument', 'Email invalide');
		}
		if (!continueUrl || typeof continueUrl !== 'string') {
			throw new functions.https.HttpsError('invalid-argument', 'continueUrl manquant');
		}

		let link: string;
		try {
			link = await admin.auth().generateSignInWithEmailLink(email, {
				url: continueUrl,
				handleCodeInApp: true,
			});
		} catch (error: any) {
			functions.logger.error('Erreur génération magic link:', error);
			throw new functions.https.HttpsError('internal', 'Impossible de générer le lien de connexion');
		}

		const transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: Number(process.env.SMTP_PORT ?? '587'),
			secure: process.env.SMTP_SECURE === 'true',
			auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
		});

		try {
			await transporter.sendMail({
				from: `"Study Group" <${process.env.SMTP_USER}>`,
				to: email,
				subject: 'Votre lien de connexion — Study Group',
				html: buildEmailHtml(link),
			});
		} catch (error: any) {
			functions.logger.error('Erreur envoi email:', error);
			throw new functions.https.HttpsError('internal', 'Impossible d\'envoyer l\'email de connexion');
		}

		functions.logger.info(`Magic link envoyé à ${email}`);
		return { success: true };
	});

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
			'Erreur lors de l\'attribution du rôle'
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

/**
 * Cloud Function pour supprimer un utilisateur et toutes ses données
 * Réservée aux utilisateurs avec le rôle "dev"
 */
export const deleteUser = functions.https.onCall(async (data, context) => {
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
			'Seuls les développeurs peuvent supprimer des utilisateurs'
		);
	}

	const { userId } = data;

	if (!userId || typeof userId !== 'string') {
		throw new functions.https.HttpsError(
			'invalid-argument',
			'userId est requis'
		);
	}

	try {
		const userDocRef = admin.firestore().collection('users').doc(userId);

		// 1. Supprimer les données Firestore récursivement (sessions, stats, etc.)
		await admin.firestore().recursiveDelete(userDocRef);

		// 2. Supprimer l'utilisateur de Firebase Auth
		await admin.auth().deleteUser(userId);

		functions.logger.info(`Utilisateur ${userId} et toutes ses données supprimés par ${context.auth.uid}`);

		return {
			success: true,
			message: `Utilisateur supprimé avec succès`
		};
	} catch (error: any) {
		functions.logger.error('Erreur lors de la suppression de l\'utilisateur:', error);
		throw new functions.https.HttpsError(
			'internal',
			'Erreur lors de la suppression'
		);
	}
});
