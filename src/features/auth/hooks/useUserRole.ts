import { useState, useEffect } from 'react';
import { useUserStore } from '../stores/useAuthStore';
import { UserRole, ROLE_PERMISSIONS, UserPermissions } from '../types/roles.types';

interface UseUserRoleReturn {
	role: UserRole | null;
	loading: boolean;
	isDev: boolean;
	isAdmin: boolean;
	isClient: boolean;
	permissions: UserPermissions | null;
}

/**
 * Hook to manage the logged-in user's role
 * Fetches the role from Firebase custom claims
 */
export const useUserRole = (): UseUserRoleReturn => {
	const user = useUserStore((state) => state.user);
	const [role, setRole] = useState<UserRole | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchRole = async () => {
			if (!user) {
				setRole(null);
				setLoading(false);
				return;
			}

			try {
				// Refresh the token to access custom claims
				const idTokenResult = await user.getIdTokenResult();
				const userRole = (idTokenResult.claims.role as UserRole) || 'client';

				console.log('🔑 User role:', userRole);
				setRole(userRole);
			} catch (error) {
				console.error('Error fetching role:', error);
				setRole('client'); // Default role on error
			} finally {
				setLoading(false);
			}
		};

		fetchRole();
	}, [user?.uid]);

	const permissions = role ? ROLE_PERMISSIONS[role] : null;

	return {
		role,
		loading,
		isDev: role === 'dev',
		isAdmin: role === 'admin' || role === 'dev',
		isClient: !!role, // All logged-in users are at least clients
		permissions,
	};
};
