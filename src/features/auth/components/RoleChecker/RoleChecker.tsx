import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserRole } from '../../hooks/useUserRole';
import { UserRole } from '../../types/roles.types';
import './style.scss';

interface RoleCheckerProps {
	children: ReactNode;
	allowedRoles: UserRole[];
	redirectTo?: string;
	fallback?: ReactNode;
}

/**
 * Composant pour protéger les routes selon le rôle utilisateur
 * Redirige vers une autre page si l'utilisateur n'a pas les permissions
 */
export const RoleChecker = ({
	children,
	allowedRoles,
	redirectTo = '/',
	fallback
}: RoleCheckerProps) => {
	const { role, loading } = useUserRole();

	if (loading) {
		return (
			<div className="role-checker-loading">
				<div className="spinner"></div>
				<p>Vérification des permissions...</p>
			</div>
		);
	}

	if (!role || !allowedRoles.includes(role)) {
		if (fallback) {
			return <>{fallback}</>;
		}
		return <Navigate to={redirectTo} replace />;
	}

	return <>{children}</>;
};
