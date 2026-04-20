import { useEffect, useState } from 'react';
import { subscribeToMessages, markMessageAsRead } from '../api/messages.api';
import { useSupportNotificationStore } from '../../../stores/useSupportNotificationStore';
import type { TicketMessage } from '../types/support.types';

interface UseTicketMessagesReturn {
  messages: TicketMessage[];
  isLoading: boolean;
  unreadCount: number;
  markAllRead: (userId: string) => void;
}

export const useTicketMessages = (
  ticketId: string | null,
  currentUserId: string | null,
): UseTicketMessagesReturn => {
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const setUnreadCount = useSupportNotificationStore((s) => s.setUnreadCount);

  useEffect(() => {
    if (!ticketId) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = subscribeToMessages(
      ticketId,
      (data) => {
        setMessages(data);
        setIsLoading(false);

        // Calcul des non lus pour l'utilisateur courant
        if (currentUserId) {
          const unread = data.filter(
            (m) => !m.readBy.includes(currentUserId),
          ).length;
          setUnreadCount(unread);
        }
      },
    );

    return () => unsubscribe();
  }, [ticketId, currentUserId, setUnreadCount]);

  const unreadCount = currentUserId
    ? messages.filter((m) => !m.readBy.includes(currentUserId)).length
    : 0;

  const markAllRead = (userId: string) => {
    messages
      .filter((m) => !m.readBy.includes(userId))
      .forEach((m) => markMessageAsRead(ticketId!, m.id, userId));
  };

  return { messages, isLoading, unreadCount, markAllRead };
};
