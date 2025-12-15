// Types pour le système de rôles
export type UserRole = 'dev' | 'admin' | 'client';

export interface UserPermissions {
	canManageUsers: boolean;
	canManageQuestions: boolean;
	canTakeQuiz: boolean;
}

export const ROLES = {
	DEV: 'dev' as UserRole,
	ADMIN: 'admin' as UserRole,
	CLIENT: 'client' as UserRole,
} as const;

export const ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
	dev: {
		canManageUsers: true,
		canManageQuestions: true,
		canTakeQuiz: true,
	},
	admin: {
		canManageUsers: false,
		canManageQuestions: true,
		canTakeQuiz: true,
	},
	client: {
		canManageUsers: false,
		canManageQuestions: false,
		canTakeQuiz: true,
	},
};

export const ROLE_LABELS: Record<UserRole, string> = {
	dev: 'Développeur',
	admin: 'Administrateur',
	client: 'Client',
};
