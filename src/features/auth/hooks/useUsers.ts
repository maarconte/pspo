import { useMemo } from 'react';
import { useFetchFirebase } from '../../../utils/hooks';
import { UserRole } from '../types/roles.types';

export interface UserData {
	uid: string;
	email: string;
	role: UserRole;
	createdAt?: Date;
	updatedAt?: Date;
}

interface RawUserData {
	id: string;
	email?: string;
	role?: UserRole;
	createdAt?: any;
	updatedAt?: any;
	[key: string]: any;
}

/**
 * Hook pour récupérer la liste de tous les utilisateurs
 * Réservé aux utilisateurs dev
 */
export const useUsers = () => {
	const { data, isLoading, errorMessage, refetch } = useFetchFirebase<RawUserData>('users');

	const users: UserData[] = useMemo(() => {
		if (!data) return [];
		return data.map((user) => ({
			uid: user.id,
			email: user.email || '',
			role: user.role || 'client',
			createdAt: user.createdAt?.toDate ? user.createdAt.toDate() : user.createdAt,
			updatedAt: user.updatedAt?.toDate ? user.updatedAt.toDate() : user.updatedAt,
		}));
	}, [data]);

	return {
		users,
		loading: isLoading,
		error: errorMessage || null,
		refetch,
	};
};
