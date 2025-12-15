import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/authService';
import { toast } from 'react-toastify';
import Button from '../../../../ui/Button/Button';
import Input from '../../../../ui/Input/Input';
import './style.scss';

export const MagicLinkVerification = () => {
	const navigate = useNavigate();
	const [isVerifying, setIsVerifying] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [email, setEmail] = useState('');
	const [needsEmail, setNeedsEmail] = useState(false);

	useEffect(() => {
		// Délai minimum pour afficher le loader (évite le flash)
		const minLoadingTime = 1000; // 1 seconde
		const startTime = Date.now();

		const verify = async () => {
			await verifyMagicLink();

			// S'assurer que le loader est affiché pendant au moins 1 seconde
			const elapsed = Date.now() - startTime;
			if (elapsed < minLoadingTime) {
				await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsed));
			}
		};

		verify();
	}, []);

	const verifyMagicLink = async (providedEmail?: string) => {
		setIsVerifying(true);
		setError(null);

		console.log('🔍 Vérification du Magic Link...');
		console.log('URL actuelle:', window.location.href);

		// Vérifier si c'est bien un Magic Link
		if (!authService.isMagicLink()) {
			console.error('❌ Ce n\'est pas un Magic Link valide');
			setError('Lien de connexion invalide');
			setIsVerifying(false);
			return;
		}

		console.log('✅ Magic Link détecté');

		try {
			const user = await authService.completeMagicLinkSignIn(providedEmail);
			console.log('✅ Connexion réussie !', user);
			console.log('User UID:', user.uid);
			console.log('User Email:', user.email);

			toast.success('Connexion réussie !');

			// Attendre un peu pour que le store se mette à jour
			setTimeout(() => {
				navigate('/'); // Rediriger vers la page d'accueil
			}, 500);
		} catch (error: any) {
			console.error('❌ Erreur de vérification:', error);
			console.error('Code d\'erreur:', error.code);
			console.error('Message:', error.message);

			if (error.message.includes('Email manquant')) {
				setNeedsEmail(true);
			} else {
				setError(error.message);
			}
		} finally {
			setIsVerifying(false);
		}
	};

	const handleEmailSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		verifyMagicLink(email);
	};

	if (isVerifying) {
		return (
			<div className="magic-link-verification">
				<h2>Vérification en cours...</h2>
				<p>Veuillez patienter pendant que nous vérifions votre lien de connexion.</p>
			</div>
		);
	}

	if (needsEmail) {
		return (
			<div className="magic-link-verification">
				<h2>Confirmation de l'email</h2>
				<p>Veuillez saisir votre adresse email pour compléter la connexion.</p>

				<form onSubmit={handleEmailSubmit}>
					<Input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="votre@email.com"
						required
						className="mb-1"
						name="email"
					/>
					<Button
						type="primary"
						onClick={handleEmailSubmit}
						label="Confirmer"
					/>
				</form>
			</div>
		);
	}

	if (error) {
		return (
			<div className="magic-link-verification error">
				<h2>Erreur de connexion</h2>
				<p>{error}</p>
				<Button
					type="primary"
					onClick={() => navigate('/login')}
					label="Retour à la connexion"
				/>
			</div>
		);
	}

	return null;
};
