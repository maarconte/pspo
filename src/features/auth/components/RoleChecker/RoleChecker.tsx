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
 * Component to protect routes based on user role
 * Redirects to another page if the user does not have permissions
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
				<p>Verifying permissions...</p>
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
