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

import { 
	getCoreRowModel, 
	getFilteredRowModel, 
	getPaginationRowModel, 
	getSortedRowModel, 
	SortingState, 
	useReactTable 
} from '@tanstack/react-table';
import { useUserColumns } from './hooks/useUserColumns';
import { fuzzyFilter } from '../../features/admin/components/TableQuestions/utils/tableUtils';
import Table from '../../ui/Table/Table';
import TableSearch from '../../ui/Table/TableSearch';

const UserManagement = () => {
	const { users, loading, error, refetch } = useUsers();
	const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
	const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
	const [userToDelete, setUserToDelete] = useState<any | null>(null);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	// TanStack Table States
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState('');
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });

	const handleRoleChange = async (userId: string, newRole: UserRole) => {
		setUpdatingUserId(userId);

		try {
			await roleService.setUserRole(userId, newRole);
			toast.success('Role updated successfully');

			// Refresh user list
			await refetch();
		} catch (error: any) {
			toast.error('Failed to update role');
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
			toast.error('Failed to delete user');
		} finally {
			setDeletingUserId(null);
		}
	};

	const openDeleteModal = (user: any) => {
		setUserToDelete(user);
		setIsDeleteModalOpen(true);
	};

	// Table Configuration
	const columns = useUserColumns({
		onRoleChange: handleRoleChange,
		onDeleteRequest: openDeleteModal,
		updatingUserId,
		deletingUserId,
	});

	const table = useReactTable({
		data: users,
		columns,
		filterFns: { fuzzy: fuzzyFilter },
		state: { sorting, globalFilter, pagination },
		globalFilterFn: fuzzyFilter,
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

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
			<div className="header-section">
				<div>
					<h1>User Management</h1>
					<p className="subtitle">
						{users.length} registered user{users.length > 1 ? 's' : ''}
					</p>
				</div>
				<div className="search-wrapper">
					<TableSearch
						value={globalFilter}
						onChange={(val) => setGlobalFilter(String(val))}
					/>
				</div>
			</div>

			<div className="users-table">
				<Table data={table} />
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
