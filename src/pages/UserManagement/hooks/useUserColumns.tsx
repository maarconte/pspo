import { createColumnHelper } from "@tanstack/react-table";
import { UserData } from "../../../features/auth/hooks/useUsers";
import { UserRole, ROLE_LABELS, ROLES } from "../../../features/auth/types/roles.types";
import { Trash2 } from "lucide-react";

const columnHelper = createColumnHelper<UserData>();

interface UseUserColumnsProps {
  onRoleChange: (userId: string, newRole: UserRole) => void;
  onDeleteRequest: (user: UserData) => void;
  updatingUserId: string | null;
  deletingUserId: string | null;
}

export const useUserColumns = ({
  onRoleChange,
  onDeleteRequest,
  updatingUserId,
  deletingUserId,
}: UseUserColumnsProps) => {
  return [
    columnHelper.accessor("email", {
      header: "Email",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("role", {
      header: "Current Role",
      cell: (info) => {
        const role = info.getValue() as UserRole;
        return (
          <span className={`role-badge role-${role}`}>
            {ROLE_LABELS[role]}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: "changeRole",
      header: "Change Role",
      cell: (info) => {
        const user = info.row.original;
        const isUpdating = updatingUserId === user.uid;
        return (
          <div className="d-flex align-items-center gap-05">
            <select
              value={user.role}
              onChange={(e) => onRoleChange(user.uid, e.target.value as UserRole)}
              disabled={isUpdating}
              className="role-select"
            >
              <option value={ROLES.CLIENT}>{ROLE_LABELS.client}</option>
              <option value={ROLES.ADMIN}>{ROLE_LABELS.admin}</option>
              <option value={ROLES.DEV}>{ROLE_LABELS.dev}</option>
            </select>
            {isUpdating && <span className="updating">Updating...</span>}
          </div>
        );
      },
    }),
    columnHelper.accessor("createdAt", {
      header: "Creation Date",
      cell: (info) => {
        const date = info.getValue();
        if (!date) return "-";
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const user = info.row.original;
        const isDisabled = updatingUserId === user.uid || deletingUserId === user.uid;
        return (
          <div className="actions-cell">
            <button
              className="delete-button"
              onClick={() => onDeleteRequest(user)}
              disabled={isDisabled}
              title="Delete user"
            >
              <Trash2 size={18} />
            </button>
          </div>
        );
      },
      enableSorting: false,
    }),
  ];
};
