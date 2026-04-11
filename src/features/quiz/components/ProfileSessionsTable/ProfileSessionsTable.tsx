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

  return (
    <div className="profile-sessions-table-container mt-2">
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Session</th>
              <th>Date</th>
              <th>Module</th>
              <th>Score</th>
              <th>Questions</th>
              <th>Total time</th>
              <th>Time per question</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {[...history]
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((session, index) => {
                const sessionNumber = history.length - index;
                const sessionDate = new Date(session.timestamp);

                const formattedDate = sessionDate.toLocaleDateString("en-FR", {
                  day: "2-digit",
                  month: "short",
                });
                const formattedTime = sessionDate.toLocaleTimeString("en-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                const answeredCount = session.details?.filter(d => d.userAnswer !== null).length || 0;
                const successPercent = answeredCount > 0 ? Math.round((session.score / answeredCount) * 100) : 0;

                const avgMin = (session.averageTimeMs / 60000).toFixed(2);
                const totalMin = (session.totalTimeMs / 60000).toFixed(1);

                return (
                  <tr key={session.id}>
                    <td className="fw-bold text-primary">Session #{sessionNumber}</td>
                    <td>
                      <span className="text-muted">{formattedDate} - {formattedTime}</span>
                    </td>
                    <td>
                      <span className="badge bg-light text-primary border">{session.formation}</span>
                    </td>
                    <td>
                      <span className={`fw-bold ${successPercent >= 85 ? 'text-success' : 'text-danger'}`}>
                        {successPercent}%
                      </span>
                    </td>
                    <td className="text-muted">{answeredCount} / 80</td>
                    <td className="text-muted">{totalMin}min</td>
                    <td className="text-muted">{avgMin}min</td>
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
