import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

const SMTP_SECRETS = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE', 'SMTP_USER', 'SMTP_PASS'];
const SUPPORT_URL = 'https://maarconte.github.io/pspo/#/support';
const MAX_EXCERPT_LENGTH = 300;

const STATUS_LABELS: Record<string, string> = {
	todo: 'À faire',
	in_progress: 'En cours',
	done: 'Terminé',
};

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function truncate(value: string, max: number): string {
	return value.length > max ? `${value.slice(0, max).trimEnd()}…` : value;
}

async function getAuthorEmail(authorId: string | undefined): Promise<string | null> {
	if (!authorId) return null;
	try {
		const user = await admin.auth().getUser(authorId);
		return user.email ?? null;
	} catch (error) {
		functions.logger.warn(`Auteur ${authorId} introuvable, notification ignorée`, error);
		return null;
	}
}

function buildTicketEmailHtml(heading: string, bodyHtml: string): string {
	return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f8;font-family:'Libre Franklin',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td style="padding:40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;margin:0 auto;">
          <tr>
            <td style="background-color:#5236ab;border-radius:12px 12px 0 0;padding:32px 40px;text-align:center;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">Study Group</p>
              <p style="margin:6px 0 0;font-size:12px;font-weight:400;color:rgba(255,255,255,0.7);letter-spacing:0.5px;text-transform:uppercase;">Support</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#ffffff;padding:40px 40px 32px;">
              <p style="margin:0 0 8px;font-size:16px;color:#1a1a2e;font-weight:600;">${escapeHtml(heading)}</p>
              ${bodyHtml}
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:28px auto 0;">
                <tr>
                  <td style="border-radius:30px;background-color:#5236ab;">
                    <a href="${SUPPORT_URL}" target="_blank" style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:30px;">Voir mon ticket →</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8f8fc;border-radius:0 0 12px 12px;padding:24px 40px;text-align:center;">
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

async function sendTicketEmail(to: string, subject: string, heading: string, bodyHtml: string): Promise<void> {
	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: Number(process.env.SMTP_PORT ?? '587'),
		secure: process.env.SMTP_SECURE === 'true',
		auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
	});

	try {
		await transporter.sendMail({
			from: `"Study Group" <${process.env.SMTP_USER}>`,
			to,
			subject,
			html: buildTicketEmailHtml(heading, bodyHtml),
		});
		functions.logger.info(`Notification ticket envoyée à ${to}: ${subject}`);
	} catch (error) {
		// On ne relance pas : un échec SMTP ne doit pas provoquer de retry en boucle
		functions.logger.error('Erreur envoi notification ticket:', error);
	}
}

const paragraph = (html: string) =>
	`<p style="margin:0;font-size:15px;line-height:1.6;color:#4a4a6a;">${html}</p>`;

/**
 * Prévient l'auteur d'un ticket quand son statut change, sauf s'il l'a
 * changé lui-même.
 */
export const onTicketStatusChanged = functions
	.runWith({ secrets: SMTP_SECRETS })
	.firestore.document('tickets/{ticketId}')
	.onUpdate(async (change) => {
		const before = change.before.data();
		const after = change.after.data();

		if (before.status === after.status) return;
		if (after.updatedBy && after.updatedBy === after.authorId) return;

		const email = await getAuthorEmail(after.authorId);
		if (!email) return;

		const name = escapeHtml(String(after.name ?? ''));
		const status = escapeHtml(STATUS_LABELS[after.status] ?? String(after.status));

		await sendTicketEmail(
			email,
			`Votre ticket « ${after.name} » est passé à « ${STATUS_LABELS[after.status] ?? after.status} »`,
			'Bonjour,',
			paragraph(`Le statut de votre ticket <strong>« ${name} »</strong> est passé à <strong>${status}</strong>.`),
		);
	});

/**
 * Prévient l'auteur d'un ticket quand une réponse lui est envoyée (les
 * messages qu'il écrit lui-même ne déclenchent rien).
 */
export const onTicketMessageCreated = functions
	.runWith({ secrets: SMTP_SECRETS })
	.firestore.document('tickets/{ticketId}/messages/{messageId}')
	.onCreate(async (snapshot, context) => {
		const message = snapshot.data();

		const ticketSnap = await admin.firestore().collection('tickets').doc(context.params.ticketId).get();
		const ticket = ticketSnap.data();
		if (!ticket) return;
		if (message.authorId === ticket.authorId) return;

		const email = await getAuthorEmail(ticket.authorId);
		if (!email) return;

		const name = escapeHtml(String(ticket.name ?? ''));
		const author = escapeHtml(String(message.authorName ?? 'Le support'));
		const excerpt = escapeHtml(truncate(String(message.content ?? ''), MAX_EXCERPT_LENGTH)).replace(/\n/g, '<br>');

		await sendTicketEmail(
			email,
			`Nouvelle réponse sur votre ticket « ${ticket.name} »`,
			'Bonjour,',
			paragraph(`<strong>${author}</strong> a répondu à votre ticket <strong>« ${name} »</strong> :`) +
				`<blockquote style="margin:16px 0 0;padding:12px 16px;border-left:3px solid #5236ab;background-color:#f8f8fc;font-size:14px;line-height:1.6;color:#4a4a6a;">${excerpt}</blockquote>`,
		);
	});
