import { Timestamp } from 'firebase/firestore';

// ─── Enums / Union Types ───────────────────────────────────────────────────────

export type TicketStatus = 'todo' | 'in_progress' | 'done';
export type TicketPriority = 'P1' | 'P2' | 'P3';

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  todo: 'To do',
  in_progress: 'In progress',
  done: 'Done',
};

export const TICKET_PRIORITY_LABELS: Record<TicketPriority, string> = {
  P1: 'Critical',
  P2: 'Major',
  P3: 'Minor',
};

// ─── Ticket ───────────────────────────────────────────────────────────────────

export interface Ticket {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  imagePath?: string; // Firebase Storage path pour suppression RGPD
  authorId: string;
  authorName: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CreateTicketPayload = Pick<Ticket, 'name' | 'description'> & {
  imageFile?: File;
};

export type UpdateTicketPayload = Partial<
  Pick<Ticket, 'status' | 'priority' | 'name' | 'description'>
>;

// ─── Message ──────────────────────────────────────────────────────────────────

export interface TicketMessage {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  createdAt: Timestamp;
  readBy: string[];
}

export type SendMessagePayload = Pick<TicketMessage, 'content' | 'authorId' | 'authorName' | 'authorRole'>;
