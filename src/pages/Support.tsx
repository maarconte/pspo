import { useState } from 'react';
import { Bug } from 'lucide-react';
import { useUserStore } from '../stores/useUserStore';
import { useUserRole } from '../features/auth/hooks/useUserRole';
import { useTickets } from '../features/support/hooks/useTickets';
import { TicketForm } from '../features/support/components/TicketForm/TicketForm';
import { TicketsTable } from '../features/support/components/TicketsTable/TicketsTable';
import { TicketDetailModal } from '../features/support/components/TicketDetailModal/TicketDetailModal';
import { Modal } from '../ui';
import type { Ticket } from '../features/support/types/support.types';
import './Support.scss';

export default function Support() {
  const user = useUserStore((s) => s.user);
  const { role, isAdmin, isDev } = useUserRole();
  const canEdit = isAdmin || isDev;

  const { tickets, isLoading, error, handleUpdateTicket, handleDeleteTicket } = useTickets();

  // État modal de suppression
  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // État modal de détail
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  if (!user) return null;

  const authorName =
    user.displayName || user.email?.split('@')[0] || 'User';

  const handleConfirmDelete = async () => {
    if (!ticketToDelete) return;
    setIsDeleting(true);
    try {
      await handleDeleteTicket(ticketToDelete.id, ticketToDelete.imagePath);
    } finally {
      setIsDeleting(false);
      setTicketToDelete(null);
    }
  };

  return (
    <div className="Support support-page">
      <div className="container mt-5">
        {/* Page Header */}
        <div className="support-page__hero">
          <div className="support-page__hero-icon">
            <Bug size={28} />
          </div>
          <div>
            <h1 className="support-page__title">Support & Bug Reports</h1>
            <p className="support-page__description">
              Report an issue or track the progress of bugs reported by the community.
            </p>
          </div>
        </div>

        {/* Main layout */}
        <div className="support-page__layout">
          {/* Left: form */}
          <div className="support-page__form-col">
            <TicketForm authorId={user.uid} authorName={authorName} />
          </div>

          {/* Right: table */}
          <div className="support-page__table-col">
            <div className="support-page__table-header">
              <h2 className="support-page__section-title">
                Open Tickets
                {tickets.length > 0 && (
                  <span className="support-page__count badge">{tickets.length}</span>
                )}
              </h2>
            </div>

            {isLoading ? (
              <div className="support-page__loading">
                <span className="support-page__spinner" />
                <span>Loading tickets...</span>
              </div>
            ) : error ? (
              <div className="support-page__error">
                An error occurred while loading tickets.
              </div>
            ) : (
              <TicketsTable
                tickets={tickets}
                currentUserId={user.uid}
                canEditTicket={canEdit}
                onUpdate={handleUpdateTicket}
                onDelete={(ticket) => setTicketToDelete(ticket)}
                onOpenDetail={(ticket) => setSelectedTicket(ticket)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      <Modal
        isOpen={!!ticketToDelete}
        title="Delete ticket"
        type="error"
        labelOnConfirm="Delete"
        labelOnCancel="Cancel"
        onClose={() => setTicketToDelete(null)}
        setIsClosed={() => setTicketToDelete(null)}
        onConfirm={handleConfirmDelete}
        isConfirmLoading={isDeleting}
      >
        <p>
          Are you sure you want to delete the ticket{' '}
          <strong>"{ticketToDelete?.name}"</strong>?
        </p>
        <p style={{ color: '#888', fontSize: '0.875rem', marginTop: '0.5rem' }}>
          This action is irreversible. The associated image will also be deleted.
        </p>
      </Modal>

      {/* Ticket detail panel */}
      <TicketDetailModal
        ticket={selectedTicket}
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        currentUserId={user.uid}
        currentUserName={authorName}
        currentUserRole={role ?? 'client'}
        canInitiateMessage={canEdit}
      />
    </div>
  );
}
