import { Fragment, useState } from 'react';
import { Trash2, MessageSquare, Eye, EyeOff } from 'lucide-react';
import type { Ticket, TicketStatus, TicketPriority } from '../../types/support.types';
import {
  TICKET_STATUS_LABELS,
  TICKET_PRIORITY_LABELS,
} from '../../types/support.types';
import type { UpdateTicketPayload } from '../../types/support.types';
import './TicketsTable.scss';

interface TicketsTableProps {
  tickets: Ticket[];
  currentUserId: string;
  canEditTicket: boolean;
  onUpdate: (id: string, payload: UpdateTicketPayload) => void;
  onDelete: (ticket: Ticket) => void;
  onOpenDetail: (ticket: Ticket) => void;
}

const STATUS_OPTIONS: TicketStatus[] = ['todo', 'in_progress', 'done'];
const PRIORITY_OPTIONS: TicketPriority[] = ['P1', 'P2', 'P3'];

const statusClass: Record<TicketStatus, string> = {
  todo: 'badge--todo',
  in_progress: 'badge--in-progress',
  done: 'badge--done',
};

const priorityClass: Record<TicketPriority, string> = {
  P1: 'badge--p1',
  P2: 'badge--p2',
  P3: 'badge--p3',
};

const formatDate = (ts: any): string => {
  if (!ts?.toDate) return '—';
  return ts.toDate().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const TicketsTable = ({
  tickets,
  currentUserId,
  canEditTicket,
  onUpdate,
  onDelete,
  onOpenDetail,
}: TicketsTableProps) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  if (tickets.length === 0) {
    return (
      <div className="tickets-table__empty">
        <MessageSquare size={40} strokeWidth={1.2} />
        <p>Aucun ticket pour le moment.</p>
        <span>Soyez le premier à signaler un bug !</span>
      </div>
    );
  }

  return (
    <div className="tickets-table">
      <div className="tickets-table__wrapper">
        <table className="tickets-table__table" aria-label="Liste des tickets de support">
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Auteur</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Priorité</th>
              <th aria-label="Actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => {
              const isAuthor = ticket.authorId === currentUserId;
              const canDelete = isAuthor || canEditTicket;
              const isExpanded = expandedRow === ticket.id;

              return (
                <Fragment key={ticket.id}>
                  <tr
                    className={`tickets-table__row ${isExpanded ? 'tickets-table__row--expanded' : ''}`}
                  >
                    {/* Nom */}
                    <td className="tickets-table__name">
                      <div className="tickets-table__name-wrapper">
                        {ticket.imageUrl && (
                          <img
                            src={ticket.imageUrl}
                            alt=""
                            className="tickets-table__thumb"
                          />
                        )}
                        <span className="tickets-table__ticket-name">{ticket.name}</span>
                      </div>
                    </td>

                    {/* Auteur */}
                    <td className="tickets-table__author">
                      <div className="tickets-table__author-avatar">
                        {ticket.authorName.charAt(0).toUpperCase()}
                      </div>
                      <span>{ticket.authorName}</span>
                    </td>

                    {/* Date */}
                    <td className="tickets-table__date">{formatDate(ticket.createdAt)}</td>

                    {/* Statut */}
                    <td>
                      {canEditTicket ? (
                        <select
                          className={`tickets-table__select badge ${statusClass[ticket.status]}`}
                          value={ticket.status}
                          onChange={(e) =>
                            onUpdate(ticket.id, { status: e.target.value as TicketStatus })
                          }
                          aria-label={`Modifier le statut de ${ticket.name}`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {TICKET_STATUS_LABELS[s]}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className={`badge ${statusClass[ticket.status]}`}>
                          {TICKET_STATUS_LABELS[ticket.status]}
                        </span>
                      )}
                    </td>

                    {/* Priorité */}
                    <td>
                      {canEditTicket ? (
                        <select
                          className={`tickets-table__select badge ${priorityClass[ticket.priority]}`}
                          value={ticket.priority}
                          onChange={(e) =>
                            onUpdate(ticket.id, { priority: e.target.value as TicketPriority })
                          }
                          aria-label={`Modifier la priorité de ${ticket.name}`}
                        >
                          {PRIORITY_OPTIONS.map((p) => (
                            <option key={p} value={p}>
                              {TICKET_PRIORITY_LABELS[p]}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className={`badge ${priorityClass[ticket.priority]}`}>
                          {ticket.priority}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="tickets-table__actions">
                      <button
                        className="tickets-table__action-btn tickets-table__action-btn--detail"
                        onClick={() => onOpenDetail(ticket)}
                        aria-label={`Voir le détail du ticket ${ticket.name}`}
                        title="Ouvrir le détail"
                      >
                        <MessageSquare size={16} />
                      </button>

                      {ticket.description && (
                        <button
                          className="tickets-table__action-btn tickets-table__action-btn--expand"
                          onClick={() =>
                            setExpandedRow(isExpanded ? null : ticket.id)
                          }
                          aria-label={isExpanded ? 'Réduire' : 'Voir la description'}
                          title={isExpanded ? 'Réduire' : 'Voir la description'}
                        >
                          {isExpanded ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      )}

                      {canDelete && (
                        <button
                          className="tickets-table__action-btn tickets-table__action-btn--delete"
                          onClick={() => onDelete(ticket)}
                          aria-label={`Supprimer le ticket ${ticket.name}`}
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>

                  {/* Ligne expandée : description */}
                  {isExpanded && (
                    <tr key={`${ticket.id}-expanded`} className="tickets-table__row-expanded">
                      <td colSpan={6}>
                        <div className="tickets-table__description">
                          {ticket.description}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
