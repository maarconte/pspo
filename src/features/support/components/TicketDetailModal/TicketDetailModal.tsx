import { useEffect, useRef, useState, useActionState } from 'react';
import { X, Send, MessageSquare, ImagePlus } from 'lucide-react';
import { useTicketMessages } from '../../hooks/useTicketMessages';
import { sendMessage } from '../../api/messages.api';
import { UploadTimeoutError } from '../../api/tickets.api';
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

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const Screenshot = ({ url, className = '' }: { url: string; className?: string }) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(
    'loading',
  );

  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {status === 'loading' && (
        <div className="ticket-modal__screenshot-loader" role="status">
          <div className="ticket-modal__screenshot-spinner" />
        </div>
      )}
      {status === 'error' && (
        <p className="ticket-modal__screenshot-error" role="alert">
          Impossible d'afficher la capture d'écran. Cliquez pour l'ouvrir dans un nouvel
          onglet ; si elle ne charge pas, un VPN ou un proxy d'entreprise la bloque peut-être.
        </p>
      )}
      {status !== 'error' && (
        <img
          src={url}
          alt="Capture d'écran du bug"
          className={`ticket-modal__screenshot ${className}`}
          hidden={status === 'loading'}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />
      )}
    </a>
  );
};

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE) {
      setImageError('Le fichier doit faire moins de 5 Mo.');
      e.target.value = '';
      return;
    }
    setImageError(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

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
    if (!content && !imageFile) return { error: 'Le message ne peut pas être vide.' };

    try {
      await sendMessage(ticket.id, {
        content: content ?? '',
        authorId: currentUserId,
        authorName: currentUserName,
        authorRole: currentUserRole,
        imageFile: imageFile ?? undefined,
      });
      clearImage();
      return { error: null };
    } catch (error) {
      if (error instanceof UploadTimeoutError) {
        return {
          error:
            "Impossible d'envoyer l'image. Vérifiez votre connexion (un VPN ou un proxy d'entreprise peut bloquer l'envoi), puis réessayez ou retirez l'image.",
        };
      }
      return { error: 'Erreur lors de l\'envoi du message.' };
    }
  };

  const [msgState, msgAction, isSending] = useActionState<MessageFormState, FormData>(
    sendAction,
    { error: null },
  );

  if (!isOpen || !ticket) return null;

  const formatTime = (ts: any) => {
    if (!ts?.toDate) return '';
    return ts.toDate().toLocaleString('fr-FR', {
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
                <span className="ticket-modal__author">par {ticket.authorName}</span>
              </div>
            </div>
          </div>
          <button
            className="ticket-modal__close"
            onClick={onClose}
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Description */}
        {ticket.description && (
          <div className="ticket-modal__description">
            <p>{ticket.description}</p>
            {ticket.imageUrl && (
              <Screenshot key={ticket.imageUrl} url={ticket.imageUrl} />
            )}
          </div>
        )}

        {/* Messages */}
        <div className="ticket-modal__messages">
          {isLoading ? (
            <div className="ticket-modal__loading">Chargement...</div>
          ) : messages.length === 0 ? (
            <div className="ticket-modal__no-messages">
              <MessageSquare size={32} strokeWidth={1.2} />
              <p>Aucun message pour ce ticket.</p>
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
                    {msg.content && <p className="ticket-modal__message-content">{msg.content}</p>}
                    {msg.imageUrl && (
                      <Screenshot
                        key={msg.imageUrl}
                        url={msg.imageUrl}
                        className="ticket-modal__message-image"
                      />
                    )}
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
            {imagePreview && (
              <div className="ticket-modal__compose-preview">
                <img src={imagePreview} alt="Aperçu de l'image jointe" />
                <button
                  type="button"
                  className="ticket-modal__compose-preview-remove"
                  onClick={clearImage}
                  disabled={isSending}
                  aria-label="Retirer l'image"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <button
              type="button"
              className="ticket-modal__compose-attach"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSending}
              aria-label="Joindre une image"
              title="Joindre une image (max 5 Mo)"
            >
              <ImagePlus size={18} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
              aria-hidden="true"
            />
            <input
              name="message"
              type="text"
              className="ticket-modal__compose-input"
              placeholder={
                canInitiateMessage
                  ? 'Demandez des précisions à l\'auteur...'
                  : 'Répondre à l\'équipe...'
              }
              disabled={isSending}
              autoComplete="off"
              id="ticket-message-input"
            />
            <button
              type="submit"
              className="ticket-modal__compose-send"
              disabled={isSending}
              aria-label="Envoyer"
            >
              {isSending ? <span className="ticket-modal__spinner" /> : <Send size={18} />}
            </button>
            {imageError && (
              <p className="ticket-modal__compose-error">{imageError}</p>
            )}
            {msgState.error && (
              <p className="ticket-modal__compose-error">{msgState.error}</p>
            )}
          </form>
        ) : (
          <div className="ticket-modal__readonly-notice">
            Seul l'auteur et l'équipe support peuvent échanger sur ce ticket.
          </div>
        )}
      </div>
    </>
  );
};
