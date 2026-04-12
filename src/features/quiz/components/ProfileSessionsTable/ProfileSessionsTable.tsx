import React, { FC, useMemo, useState } from "react";
import { QuizSessionStat } from "../../../../utils/types";
import { deleteQuizSession } from "../../../../lib/firebase/stats";
import { useUserStore } from "../../../../stores/useUserStore";
import { toast } from "react-toastify";
import Modal from "../../../../ui/Modal/Modal";
import Table from "../../../../ui/Table/Table";
import { useSessionColumns } from "./hooks/useSessionColumns";
import { 
  getCoreRowModel, 
  getPaginationRowModel, 
  getSortedRowModel, 
  SortingState, 
  useReactTable 
} from "@tanstack/react-table";
import "./ProfileSessionsTable.scss";

interface ProfileSessionsTableProps {
  history: QuizSessionStat[];
  onUpdate: () => void;
}

export const ProfileSessionsTable: FC<ProfileSessionsTableProps> = ({ history, onUpdate }) => {
  // --- States ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([{ id: "score", desc: false }]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });

  // --- Store ---
  const user = useUserStore((s) => s.user);

  // --- Handlers ---
  const handleDeleteClick = (sessionId: string) => {
    setSessionToDelete(sessionId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!user?.uid || !sessionToDelete) return;

    try {
      await deleteQuizSession(user.uid, sessionToDelete);
      toast.success("Session deleted");
      onUpdate();
    } catch (error) {
      console.error("Error deleting session:", error);
      toast.error("Failed to delete session");
    } finally {
      setIsModalOpen(false);
      setSessionToDelete(null);
    }
  };

  // --- Table Data & Config ---
  const sortedData = useMemo(() => {
    return [...history]
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((session, index) => ({
        ...session,
        absoluteIndex: index
      }));
  }, [history]);

  const columns = useMemo(() => useSessionColumns({
    onDeleteRequest: handleDeleteClick,
    totalCount: history.length,
  }), [history.length]);

  const table = useReactTable({
    data: sortedData,
    columns,
    state: { pagination, sorting },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="profile-sessions-table-container mt-2">
      <Table 
        data={table} 
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setIsClosed={setIsModalOpen}
        title="Delete session"
        labelOnConfirm="Delete"
        labelOnCancel="Cancel"
        onConfirm={confirmDelete}
        type="error"
      >
        <p>Would really delete this sessions ?</p>
      </Modal>
    </div>
  );
};
