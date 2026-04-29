import { Fragment, useState, useMemo } from 'react';
import {
  Trash2,
  MessageSquare,
  Eye,
  EyeOff,
  ArrowUpDown,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
  SortingState,
} from '@tanstack/react-table';
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

const columnHelper = createColumnHelper<Ticket>();

export const TicketsTable = ({
  tickets,
  currentUserId,
  canEditTicket,
  onUpdate,
  onDelete,
  onOpenDetail,
}: TicketsTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Ticket',
        cell: (info) => (
          <div className="tickets-table__name-wrapper">
            <span className="tickets-table__ticket-name">{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor('authorName', {
        header: 'Auteur',
        cell: (info) => (
          <div className="tickets-table__author">
            <div className="tickets-table__author-avatar">
              {info.getValue().charAt(0).toUpperCase()}
            </div>
            <span>{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor('createdAt', {
        header: 'Date',
        cell: (info) => <span className="tickets-table__date">{formatDate(info.getValue())}</span>,
        sortingFn: (rowA, rowB) => {
          const a = rowA.original.createdAt?.toMillis() || 0;
          const b = rowB.original.createdAt?.toMillis() || 0;
          return a - b;
        },
      }),
      columnHelper.accessor('status', {
        header: 'Statut',
        cell: (info) => {
          const ticket = info.row.original;
          return canEditTicket ? (
            <select
              id={`status-${ticket.id}`}
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
          );
        },
      }),
      columnHelper.accessor('priority', {
        header: 'Priorité',
        cell: (info) => {
          const ticket = info.row.original;
          return canEditTicket ? (
            <select
              id={`priority-${ticket.id}`}
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
              {TICKET_PRIORITY_LABELS[ticket.priority]}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const ticket = info.row.original;
          const isAuthor = ticket.authorId === currentUserId;
          const canDelete = isAuthor || canEditTicket;
          const isExpanded = expandedRow === ticket.id;

          return (
            <div className="tickets-table__actions">
              <button
                className="tickets-table__action-btn tickets-table__action-btn--detail"
                onClick={() => onOpenDetail(ticket)}
                title="Ouvrir le détail"
              >
                <MessageSquare size={16} />
              </button>

              {ticket.description && (
                <button
                  className="tickets-table__action-btn tickets-table__action-btn--expand"
                  onClick={() => setExpandedRow(isExpanded ? null : ticket.id)}
                  title={isExpanded ? 'Réduire' : 'Voir la description'}
                >
                  {isExpanded ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              )}

              {canDelete && (
                <button
                  className="tickets-table__action-btn tickets-table__action-btn--delete"
                  onClick={() => onDelete(ticket)}
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          );
        },
      }),
    ],
    [canEditTicket, currentUserId, expandedRow, onUpdate, onDelete, onOpenDetail]
  );

  const table = useReactTable({
    data: tickets,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

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
        <table className="tickets-table__table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isSortable = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();

                  return (
                    <th
                      key={header.id}
                      className={isSortable ? 'tickets-table__th-sort' : ''}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}

                      {isSortable && (
                        <span className={`tickets-table__sort-icon ${sorted ? 'tickets-table__sort-icon--active' : ''}`}>
                          {sorted === 'asc' ? (
                            <ChevronUp size={14} />
                          ) : sorted === 'desc' ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ArrowUpDown size={14} />
                          )}
                        </span>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              const ticket = row.original;
              const isExpanded = expandedRow === ticket.id;

              return (
                <Fragment key={row.id}>
                  <tr className={`tickets-table__row ${isExpanded ? 'tickets-table__row--expanded' : ''}`}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                  {isExpanded && (
                    <tr className="tickets-table__row-expanded">
                      <td colSpan={columns.length}>
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
