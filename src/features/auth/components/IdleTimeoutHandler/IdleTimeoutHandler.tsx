import { useEffect, useState } from 'react';
import { useIdleTimer } from '../../hooks/useIdleTimer';
import { authService } from '../../api/authService';
import { useUserStore } from '../../stores/useAuthStore';
import { toast } from 'react-toastify';

const IDLE_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const WARNING_TIME = 2 * 60 * 1000; // 2 minutes before logout

/**
 * Component that handles automatic logout after user inactivity
 * Shows a warning 2 minutes before logout
 */
export const IdleTimeoutHandler = () => {
	const user = useUserStore((state) => state.user);
	const [showWarning, setShowWarning] = useState(false);

	const handleIdle = async () => {
		if (user) {
			toast.warning('Vous avez été déconnecté pour cause d\'inactivité');
			await authService.signOut();
		}
	};

	const handleWarning = () => {
		if (user && !showWarning) {
			setShowWarning(true);
			toast.warning('Vous serez déconnecté dans 2 minutes pour cause d\'inactivité', {
				autoClose: false,
				onClose: () => setShowWarning(false),
			});
		}
	};

	// Main idle timer (30 min) - triggers logout
	useIdleTimer({
		timeout: IDLE_TIMEOUT,
		onIdle: handleIdle,
	});

	// Warning timer (28 min) - shows warning before logout
	useIdleTimer({
		timeout: IDLE_TIMEOUT - WARNING_TIME,
		onIdle: handleWarning,
	});

	// This is a logic-only component, no UI
	return null;
};
