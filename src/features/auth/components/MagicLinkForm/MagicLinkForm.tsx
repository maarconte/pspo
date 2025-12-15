import { useState } from 'react';
import { authService } from '../../api/authService';
import { toast } from 'react-toastify';
import Button from '../../../../ui/Button/Button';
import Input from '../../../../ui/Input/Input';
import './style.scss';

export const MagicLinkForm = () => {
	const [email, setEmail] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [emailSent, setEmailSent] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email || !email.includes('@')) {
			toast.error('Veuillez saisir une adresse email valide');
			return;
		}

		setIsLoading(true);

		try {
			await authService.sendMagicLink(email);
			setEmailSent(true);
			toast.success('Lien de connexion envoyé ! Vérifiez votre boîte mail.');
		} catch (error: any) {
			toast.error(error.message || 'Échec de l\'envoi du lien');
		} finally {
			setIsLoading(false);
		}
	};

	if (emailSent) {
		return (
			<div className="magic-link-sent">
				<h2>Email envoyé !</h2>
				<p>
					Un lien de connexion a été envoyé à <strong>{email}</strong>.
				</p>
				<p>Cliquez sur le lien dans l'email pour vous connecter.</p>
				<Button
					type="secondary"
					onClick={() => setEmailSent(false)}
					label="Renvoyer le lien"
				/>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="magic-link-form">
			<h2>Connexion</h2>
			<p>Entrez votre email pour recevoir un lien de connexion</p>

			<Input
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="votre@email.com"
				required
				disabled={isLoading}
				className="mb-1"
				name="email"
			/>

			<Button
				type="primary"
				onClick={handleSubmit}
				disabled={isLoading}
				label={isLoading ? 'Envoi en cours...' : 'Envoyer le lien'}
			/>
		</form>
	);
};
