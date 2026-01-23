import { getFunctions, httpsCallable } from 'firebase/functions';
import { UserRole } from '../types/roles.types';

const functions = getFunctions();

interface SetUserRoleParams {
	userId: string;
	role: UserRole;
}

interface SetUserRoleResponse {
	success: boolean;
	message: string;
}

/**
 * Service pour gérer les rôles utilisateur via Cloud Functions
 */
export const roleService = {
	/**
	 * Attribue un rôle à un utilisateur
	 * Nécessite le rôle "dev"
	 */
	setUserRole: async (userId: string, role: UserRole): Promise<SetUserRoleResponse> => {
		const setUserRole = httpsCallable<SetUserRoleParams, SetUserRoleResponse>(
			functions,
			'setUserRole'
		);

		try {
			const result = await setUserRole({ userId, role });
			return result.data;
		} catch (error: any) {
			console.error('Erreur lors de l\'attribution du rôle:', error);
			throw new Error(error.message || 'Échec de l\'attribution du rôle');
		}
	},
};
