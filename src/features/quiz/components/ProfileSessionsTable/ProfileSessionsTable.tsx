import React, { FC, useState } from "react";
import { Trash2 } from "lucide-react";
import { QuizSessionStat } from "../../../../utils/types";
import { deleteQuizSession } from "../../../../lib/firebase/stats";
import { useUserStore } from "../../../../stores/useUserStore";
import { toast } from "react-toastify";
import Modal from "../../../../ui/Modal/Modal";
import "./ProfileSessionsTable.scss";

interface ProfileSessionsTableProps {
  history: QuizSessionStat[];
  onUpdate: () => void;
}

export const ProfileSessionsTable: FC<ProfileSessionsTableProps> = ({ history, onUpdate }) => {
  const user = useUserStore((s) => s.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

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

  const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="profile-sessions-table-container mt-2">
      <h3 className="h5 mb-4">Completed Quizzes</h3>
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Date</th>
              <th>Formation</th>
              <th>Score</th>
              <th>Duration</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {[...history]
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((session) => {
                const date = new Date(session.timestamp).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const percentage = Math.round((session.score / session.totalQuestions) * 100);

                return (
                  <tr key={session.id}>
                    <td>
                      <span className="fw-medium">{date}</span>
                    </td>
                    <td>
                      <span className="badge bg-light text-primary border">{session.formation}</span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span className={`fw-bold ${percentage >= 85 ? 'text-success' : 'text-danger'}`}>
                          {percentage}%
                        </span>
                        <small className="text-muted">({session.score}/{session.totalQuestions})</small>
                      </div>
                    </td>
                    <td className="text-muted">{formatDuration(session.totalTimeMs)}</td>
                    <td className="text-end pe-4">
                      <button
                        className="btn btn-link text-danger p-1 delete-btn"
                        onClick={() => handleDeleteClick(session.id || "")}
                        title="Delete Session"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

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
