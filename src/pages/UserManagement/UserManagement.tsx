import { useState } from 'react';
import { useUsers } from '../../features/auth/hooks/useUsers';
import { roleService } from '../../features/auth/api/roleService';
import { UserRole, ROLE_LABELS, ROLES } from '../../features/auth/types/roles.types';
import { toast } from 'react-toastify';
import { Trash2 } from 'lucide-react';
import Button from '../../ui/Button/Button';
import { Button_Style, Button_Type } from '../../ui/Button/Button.types';
import { Modal } from '../../ui';
import './style.scss';

const UserManagement = () => {
	const { users, loading, error, refetch } = useUsers();
	const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
	const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
	const [userToDelete, setUserToDelete] = useState<any | null>(null);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

	const handleDeleteConfirm = async () => {
		if (!userToDelete) return;

		setDeletingUserId(userToDelete.uid);
		try {
			await roleService.deleteUser(userToDelete.uid);
			toast.success('User and data deleted successfully');
			setIsDeleteModalOpen(false);
			setUserToDelete(null);
			await refetch();
		} catch (error: any) {
			toast.error(error.message || 'Failed to delete user');
		} finally {
			setDeletingUserId(null);
		}
	};

	const openDeleteModal = (user: any) => {
		setUserToDelete(user);
		setIsDeleteModalOpen(true);
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
							<th>Actions</th>
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
								<td className="actions-cell">
									<button
										className="delete-button"
										onClick={() => openDeleteModal(user)}
										disabled={updatingUserId === user.uid || deletingUserId === user.uid}
										title="Delete user"
									>
										<Trash2 size={18} />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<Modal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={handleDeleteConfirm}
				title="Confirm Deletion"
				type="error"
				labelOnConfirm="Delete Permanently"
				labelOnCancel="Cancel"
				isConfirmLoading={deletingUserId !== null}
				confirmButtonDisabled={deletingUserId !== null}
				setIsClosed={setIsDeleteModalOpen}
			>
				<div className="delete-confirmation-content">
					<p>Are you sure you want to delete user <strong>{userToDelete?.email}</strong>?</p>
					<p className="warning-text">
						This action is <strong>irreversible</strong>. It will permanently delete:
					</p>
					<ul>
						<li>User profile and account</li>
						<li>All quiz sessions and history</li>
						<li>All bookmarks and statistics</li>
					</ul>
				</div>
			</Modal>
		</div>
	);
};

export default UserManagement;
