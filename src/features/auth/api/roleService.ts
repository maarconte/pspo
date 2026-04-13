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
			throw new Error('Failed to assign role');
		}
	},

	/**
	 * Deletes a user and all their data
	 * Requires "dev" role
	 */
	deleteUser: async (userId: string): Promise<SetUserRoleResponse> => {
		const deleteUserFunc = httpsCallable<{ userId: string }, SetUserRoleResponse>(
			functions,
			'deleteUser'
		);

		try {
			const result = await deleteUserFunc({ userId });
			return result.data;
		} catch (error: any) {
			console.error('Error deleting user:', error);
			throw new Error(error.message || 'Failed to delete user');
		}
	},
};
