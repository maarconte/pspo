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
 * Hook pour gérer le rôle de l'utilisateur connecté
 * Récupère le rôle depuis les custom claims Firebase
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
				// Récupérer le token pour accéder aux custom claims
				const idTokenResult = await user.getIdTokenResult();
				const userRole = (idTokenResult.claims.role as UserRole) || 'client';

				setRole(userRole);
			} catch (error) {
				console.error('Erreur lors de la récupération du rôle:', error);
				setRole('client'); // Rôle par défaut en cas d'erreur
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
		isClient: !!role, // Tous les utilisateurs connectés sont au moins clients
		permissions,
	};
};
