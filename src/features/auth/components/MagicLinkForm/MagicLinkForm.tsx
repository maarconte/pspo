import { useState } from 'react';
import { authService } from '../../api/authService';
import { toast } from 'react-toastify';
import Button from '../../../../ui/Button/Button';
import { Button_Type } from '../../../../ui/Button/Button.types';
import Input from '../../../../ui/Input/Input';
import './style.scss';

export const MagicLinkForm = () => {
	const [email, setEmail] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [emailSent, setEmailSent] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email || !email.includes('@')) {
			toast.error('Please enter a valid email address');
			return;
		}

		setIsLoading(true);

		try {
			await authService.sendMagicLink(email);
			setEmailSent(true);
			toast.success('Sign-in link sent! Check your inbox.');
		} catch (error: any) {
			toast.error(error.message || 'Failed to send link');
		} finally {
			setIsLoading(false);
		}
	};

	if (emailSent) {
		return (
			<div className="magic-link-sent">
				<h2>Email sent!</h2>
				<p>
					A sign-in link has been sent to <strong>{email}</strong>.
				</p>
				<p>Click the link in the email to log in.</p>
				<Button
					type={Button_Type.SECONDARY}
					onClick={() => setEmailSent(false)}
					label="Resend link"
				/>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="magic-link-form">
			<h2>Sign In</h2>
			<p>Enter your email to receive a sign-in link</p>

			<Input
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="your@email.com"
				required
				disabled={isLoading}
				className="mb-1"
				name="email"
			/>

			<Button
				type={Button_Type.PRIMARY}
				onClick={handleSubmit}
				disabled={isLoading}
				label={isLoading ? 'Sending...' : 'Send link'}
			/>
		</form>
	);
};
