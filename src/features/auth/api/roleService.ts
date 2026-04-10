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
 * Service to manage user roles via Cloud Functions
 */
export const roleService = {
	/**
	 * Assigns a role to a user
	 * Requires "dev" role
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
			console.error('Error assigning role:', error);
			throw new Error(error.message || 'Failed to assign role');
		}
	},
};
