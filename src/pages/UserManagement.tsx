import { useState } from 'react';
import { useUsers } from '../features/auth/hooks/useUsers';
import { roleService } from '../features/auth/api/roleService';
import { UserRole, ROLE_LABELS, ROLES } from '../features/auth/types/roles.types';
import { toast } from 'react-toastify';
import './UserManagement/style.scss';

const UserManagement = () => {
	const { users, loading, error, refetch } = useUsers();
	const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

	const handleRoleChange = async (userId: string, newRole: UserRole) => {
		setUpdatingUserId(userId);

		try {
			await roleService.setUserRole(userId, newRole);
			toast.success(`Rôle mis à jour avec succès`);

			// Rafraîchir la liste des utilisateurs
			await refetch();
		} catch (error: any) {
			toast.error(error.message || 'Échec de la mise à jour du rôle');
		} finally {
			setUpdatingUserId(null);
		}
	};

	if (loading) {
		return (
			<div className="user-management">
				<h1>Gestion des utilisateurs</h1>
				<p>Chargement des utilisateurs...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="user-management">
				<h1>Gestion des utilisateurs</h1>
				<p className="error">Erreur : {error}</p>
				<Button
					onClick={refetch}>Réessayer</Button>
			</div>
		);
	}

	return (
		<div className="user-management">
			<h1>Gestion des utilisateurs</h1>
			<p className="subtitle">
				{users.length} utilisateur{users.length > 1 ? 's' : ''} enregistré{users.length > 1 ? 's' : ''}
			</p>

			<div className="users-table">
				<table>
					<thead>
						<tr>
							<th>Email</th>
							<th>Rôle actuel</th>
							<th>Changer le rôle</th>
							<th>Date de création</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user) => (
							<tr key={user.uid}>
								<td>{user.email}</td>
								<td>
									<span className={`role-badge role-${user.role}`}>
										{ROLE_LABELS[user.role as UserRole]}
									</span>
								</td>
								<td>
									<select
										value={user.role}
										onChange={(e) => handleRoleChange(user.uid, e.target.value as UserRole)}
										disabled={updatingUserId === user.uid}
										className="role-select"
									>
										<option value={ROLES.CLIENT}>{ROLE_LABELS.client}</option>
										<option value={ROLES.ADMIN}>{ROLE_LABELS.admin}</option>
										<option value={ROLES.DEV}>{ROLE_LABELS.dev}</option>
									</select>
									{updatingUserId === user.uid && (
										<span className="updating">Mise à jour...</span>
									)}
								</td>
								<td>
									{user.createdAt?.toLocaleDateString('fr-FR', {
										year: 'numeric',
										month: 'short',
										day: 'numeric',
									})}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default UserManagement;
