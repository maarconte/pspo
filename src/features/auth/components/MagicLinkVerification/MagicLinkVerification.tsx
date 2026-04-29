import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/authService';
import Button from '../../../../ui/Button/Button';
import { Button_Type } from '../../../../ui/Button/Button.types';
import Input from '../../../../ui/Input/Input';
import './style.scss';
import { trackEvent } from '../../../../lib/analytics';

export const MagicLinkVerification = () => {
	const navigate = useNavigate();
	const [isVerifying, setIsVerifying] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [email, setEmail] = useState('');
	const [needsEmail, setNeedsEmail] = useState(false);

	const isVerifyingRef = useRef(false);

	useEffect(() => {
		// Minimum delay to show the loader (avoids flash)
		const minLoadingTime = 1000; // 1 second
		const startTime = Date.now();

		const verify = async () => {
			if (isVerifyingRef.current) return;
			isVerifyingRef.current = true;
			await verifyMagicLink();

			// Ensure loader is shown for at least 1 second
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

		const url = sessionStorage.getItem('magicLinkOriginalUrl') ?? window.location.href;

		if (!authService.isMagicLink(url)) {
			console.error('❌ Not a valid Magic Link');
			setError('Invalid sign-in link');
			setIsVerifying(false);
			return;
		}

		try {
			await authService.completeMagicLinkSignIn(providedEmail, url);
			trackEvent('login_success');
			sessionStorage.removeItem('magicLinkOriginalUrl');

			// Clean up the URL to prevent re-triggering the magic link flow on reload
			const cleanUrl = new URL(window.location.href);
			cleanUrl.search = '';
			window.history.replaceState({}, document.title, cleanUrl.toString());

			setTimeout(() => {
				navigate('/');
			}, 500);
		} catch (error: any) {
			console.error('❌ Verification error:', error.message);

			if (error.message.includes('Missing email') || error.message.includes('Email manquant')) {
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
				<h2>Verifying...</h2>
				<p>Please wait while we verify your sign-in link.</p>
			</div>
		);
	}

	if (needsEmail) {
		return (
			<div className="magic-link-verification">
				<h2>Email Confirmation</h2>
				<p>Please enter your email address to complete the sign-in.</p>

				<form onSubmit={handleEmailSubmit}>
					<Input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="your@email.com"
						required
						className="mb-1"
						name="email"
					/>
					<Button
						type={Button_Type.PRIMARY}
						onClick={handleEmailSubmit}
						label="Confirm"
					/>
				</form>
			</div>
		);
	}

	if (error) {
		return (
			<div className="magic-link-verification error">
				<h2>Sign-in Error</h2>
				<p>{error}</p>
				<Button
					type={Button_Type.PRIMARY}
					onClick={() => navigate('/login')}
					label="Back to Sign In"
				/>
			</div>
		);
	}

	return null;
};
