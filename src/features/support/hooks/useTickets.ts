import { useEffect, useState, useTransition } from 'react';
import { subscribeToTickets, updateTicket, deleteTicket } from '../api/tickets.api';
import type { Ticket, UpdateTicketPayload } from '../types/support.types';

interface UseTicketsReturn {
  tickets: Ticket[];
  isLoading: boolean;
  error: Error | null;
  isPending: boolean;
  handleUpdateTicket: (id: string, payload: UpdateTicketPayload) => void;
  handleDeleteTicket: (id: string, imagePath?: string | null) => Promise<void>;
}

export const useTickets = (): UseTicketsReturn => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const unsubscribe = subscribeToTickets(
      (data) => {
        setTickets(data);
        setIsLoading(false);
      },
      (err) => {
        setError(err);
        setIsLoading(false);
      },
    );
    return () => unsubscribe();
  }, []);

  const handleUpdateTicket = (id: string, payload: UpdateTicketPayload) => {
    startTransition(async () => {
      await updateTicket(id, payload);
    });
  };

  const handleDeleteTicket = async (id: string, imagePath?: string | null) => {
    await deleteTicket(id, imagePath);
  };

  return { tickets, isLoading, error, isPending, handleUpdateTicket, handleDeleteTicket };
};
