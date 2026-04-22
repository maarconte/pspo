import { useEffect, useRef, useActionState } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';
import { useTicketMessages } from '../../hooks/useTicketMessages';
import { sendMessage } from '../../api/messages.api';
import type { Ticket } from '../../types/support.types';
import {
  TICKET_STATUS_LABELS,
  TICKET_PRIORITY_LABELS,
} from '../../types/support.types';
import './TicketDetailModal.scss';

interface TicketDetailModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  currentUserName: string;
  currentUserRole: string;
  canInitiateMessage: boolean; // admin/dev
}

type MessageFormState = { error: string | null };

export const TicketDetailModal = ({
  ticket,
  isOpen,
  onClose,
  currentUserId,
  currentUserName,
  currentUserRole,
  canInitiateMessage,
}: TicketDetailModalProps) => {
  const { messages, isLoading, markAllRead } = useTicketMessages(
    ticket?.id ?? null,
    currentUserId,
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Marque les messages comme lus à l'ouverture
  useEffect(() => {
    if (isOpen && ticket && messages.length > 0) {
      markAllRead(currentUserId);
    }
  }, [isOpen, ticket?.id, messages.length]);

  // Scroll automatique en bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // Fermeture avec Echap
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Détermine si l'utilisateur peut envoyer un message
  const isAuthor = ticket?.authorId === currentUserId;
  const canSend = canInitiateMessage || isAuthor;

  const sendAction = async (
    prevState: MessageFormState,
    formData: FormData,
  ): Promise<MessageFormState> => {
    if (!ticket) return prevState;
    const content = (formData.get('message') as string)?.trim();
    if (!content) return { error: 'Message cannot be empty.' };

    try {
      await sendMessage(ticket.id, {
        content,
        authorId: currentUserId,
        authorName: currentUserName,
        authorRole: currentUserRole,
      });
      return { error: null };
    } catch {
      return { error: 'Error while sending message.' };
    }
  };

  const [msgState, msgAction, isSending] = useActionState<MessageFormState, FormData>(
    sendAction,
    { error: null },
  );

  if (!isOpen || !ticket) return null;

  const formatTime = (ts: any) => {
    if (!ts?.toDate) return '';
    return ts.toDate().toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <div className="ticket-modal__backdrop" onClick={onClose} />
      <div
        className="ticket-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ticket-modal-title"
      >
        {/* Header */}
        <div className="ticket-modal__header">
          <div className="ticket-modal__header-left">
            <MessageSquare size={20} />
            <div>
              <h3 id="ticket-modal-title" className="ticket-modal__title">
                {ticket.name}
              </h3>
              <div className="ticket-modal__meta">
                <span className={`badge badge--${ticket.status.replace('_', '-')}`}>
                  {TICKET_STATUS_LABELS[ticket.status]}
                </span>
                <span className={`badge badge--${ticket.priority.toLowerCase()}`}>
                  {ticket.priority}
                </span>
                <span className="ticket-modal__author">by {ticket.authorName}</span>
              </div>
            </div>
          </div>
          <button
            className="ticket-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Description */}
        {ticket.description && (
          <div className="ticket-modal__description">
            <p>{ticket.description}</p>
            {ticket.imageUrl && (
              <a href={ticket.imageUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={ticket.imageUrl}
                  alt="Bug screenshot"
                  className="ticket-modal__screenshot"
                />
              </a>
            )}
          </div>
        )}

        {/* Messages */}
        <div className="ticket-modal__messages">
          {isLoading ? (
            <div className="ticket-modal__loading">Loading...</div>
          ) : messages.length === 0 ? (
            <div className="ticket-modal__no-messages">
              <MessageSquare size={32} strokeWidth={1.2} />
              <p>No messages for this ticket.</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.authorId === currentUserId;
              return (
                <div
                  key={msg.id}
                  className={`ticket-modal__message ${isMine ? 'ticket-modal__message--mine' : ''}`}
                >
                  <div className="ticket-modal__message-bubble">
                    <div className="ticket-modal__message-header">
                      <span className="ticket-modal__message-author">{msg.authorName}</span>
                      <span className="ticket-modal__message-role">{msg.authorRole}</span>
                      <span className="ticket-modal__message-time">{formatTime(msg.createdAt)}</span>
                    </div>
                    <p className="ticket-modal__message-content">{msg.content}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Zone de saisie */}
        {canSend ? (
          <form action={msgAction} className="ticket-modal__compose">
            <input
              name="message"
              type="text"
              className="ticket-modal__compose-input"
              placeholder={
                canInitiateMessage
                  ? 'Ask the author for details...'
                  : 'Reply to the team...'
              }
              disabled={isSending}
              autoComplete="off"
              id="ticket-message-input"
            />
            <button
              type="submit"
              className="ticket-modal__compose-send"
              disabled={isSending}
              aria-label="Send"
            >
              {isSending ? <span className="ticket-modal__spinner" /> : <Send size={18} />}
            </button>
            {msgState.error && (
              <p className="ticket-modal__compose-error">{msgState.error}</p>
            )}
          </form>
        ) : (
          <div className="ticket-modal__readonly-notice">
            Only the author and the support team can exchange on this ticket.
          </div>
        )}
      </div>
    </>
  );
};
