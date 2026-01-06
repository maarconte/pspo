import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/authService';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import {Input} from '@/components/ui/input';
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

		// Vérifier si c'est bien un Magic Link
		if (!authService.isMagicLink()) {
			setError('Lien de connexion invalide');
			setIsVerifying(false);
			return;
		}

		try {
			const user = await authService.completeMagicLinkSignIn(providedEmail);
			toast.success('Connexion réussie !');
			setTimeout(() => {
				navigate('/');
			}, 500);
		} catch (error: any) {

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
						onClick={handleEmailSubmit}
					>
						Confirmer
					</Button>
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
					onClick={() => navigate('/login')}
				>
					Retour à la connexion
				</Button>
			</div>
		);
	}

	return null;
};
