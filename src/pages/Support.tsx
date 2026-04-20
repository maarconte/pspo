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
    user.displayName || user.email?.split('@')[0] || 'Utilisateur';

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
    <div className="support-page">
      <div className="container mt-5">
        {/* Page Header */}
        <div className="support-page__hero">
          <div className="support-page__hero-icon">
            <Bug size={28} />
          </div>
          <div>
            <h1 className="support-page__title">Support & Bug Reports</h1>
            <p className="support-page__description">
              Signalez un problème ou suivez l'avancement des bugs remontés par la communauté.
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
                Tickets ouverts
                {tickets.length > 0 && (
                  <span className="support-page__count">{tickets.length}</span>
                )}
              </h2>
            </div>

            {isLoading ? (
              <div className="support-page__loading">
                <span className="support-page__spinner" />
                <span>Chargement des tickets...</span>
              </div>
            ) : error ? (
              <div className="support-page__error">
                Une erreur est survenue lors du chargement des tickets.
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
        title="Supprimer le ticket"
        type="error"
        labelOnConfirm="Supprimer"
        labelOnCancel="Annuler"
        onClose={() => setTicketToDelete(null)}
        setIsClosed={() => setTicketToDelete(null)}
        onConfirm={handleConfirmDelete}
        isConfirmLoading={isDeleting}
      >
        <p>
          Êtes-vous sûr de vouloir supprimer le ticket{' '}
          <strong>"{ticketToDelete?.name}"</strong> ?
        </p>
        <p style={{ color: '#888', fontSize: '0.875rem', marginTop: '0.5rem' }}>
          Cette action est irréversible. L'image associée sera également supprimée.
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
