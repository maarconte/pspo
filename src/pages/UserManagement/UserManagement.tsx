import { useState } from 'react';
import { useUsers } from '../../features/auth/hooks/useUsers';
import { roleService } from '../../features/auth/api/roleService';
import { UserRole, ROLE_LABELS, ROLES } from '../../features/auth/types/roles.types';
import { toast } from 'react-toastify';
import Button from '../../ui/Button/Button';
import { Button_Style } from '../../ui/Button/Button.types';
import './style.scss';

const UserManagement = () => {
	const { users, loading, error, refetch } = useUsers();
	const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

	const handleRoleChange = async (userId: string, newRole: UserRole) => {
		setUpdatingUserId(userId);

		try {
			await roleService.setUserRole(userId, newRole);
			toast.success('Role updated successfully');

			// Refresh user list
			await refetch();
		} catch (error: any) {
			toast.error(error.message || 'Failed to update role');
		} finally {
			setUpdatingUserId(null);
		}
	};

	if (loading) {
		return (
			<div className="user-management">
				<h1>User Management</h1>
				<p>Loading users...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="user-management">
				<h1>User Management</h1>
				<p className="error">Error: {error}</p>
				<Button
					label="Retry"
					style={Button_Style.SOLID}
					onClick={refetch}
				/>
			</div>
		);
	}

	return (
		<div className="user-management">
			<h1>User Management</h1>
			<p className="subtitle">
				{users.length} registered user{users.length > 1 ? 's' : ''}
			</p>

			<div className="users-table">
				<table>
					<thead>
						<tr>
							<th>Email</th>
							<th>Current Role</th>
							<th>Change Role</th>
							<th>Creation Date</th>
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
										<span className="updating">Updating...</span>
									)}
								</td>
								<td>
									{user.createdAt?.toLocaleDateString('en-US', {
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
