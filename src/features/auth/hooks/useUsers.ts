import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { UserRole } from '../types/roles.types';

export interface UserData {
	uid: string;
	email: string;
	role: UserRole;
	createdAt?: Date;
	updatedAt?: Date;
}

/**
 * Hook pour récupérer la liste de tous les utilisateurs
 * Réservé aux utilisateurs dev
 */
export const useUsers = () => {
	const [users, setUsers] = useState<UserData[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchUsers = async () => {
		setLoading(true);
		setError(null);

		try {
			const usersCollection = collection(db, 'users');
			const usersSnapshot = await getDocs(usersCollection);

			const usersData: UserData[] = usersSnapshot.docs.map(doc => {
				const data = doc.data();
				return {
					uid: doc.id,
					email: data.email || '',
					role: data.role || 'client',
					createdAt: data.createdAt?.toDate(),
					updatedAt: data.updatedAt?.toDate(),
				};
			});

			setUsers(usersData);
		} catch (err: any) {
			console.error('Erreur lors de la récupération des utilisateurs:', err);
			setError(err.message || 'Échec de la récupération des utilisateurs');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	return {
		users,
		loading,
		error,
		refetch: fetchUsers,
	};
};
