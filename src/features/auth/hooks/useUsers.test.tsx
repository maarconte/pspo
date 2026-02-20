import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUsers } from './useUsers';
import { ReactNode } from 'react';

// Mock Firestore
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn(),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
}));

// Mock firebase app and db
vi.mock('../../../lib/firebase', () => ({
    db: {}
}));
vi.mock('../../../firebase.js', () => ({
    Firebase: {},
    db: {}
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useUsers', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch and format users', async () => {
        const mockDate = new Date('2023-01-01T00:00:00.000Z');
        const mockTimestamp = { toDate: () => mockDate, seconds: mockDate.getTime() / 1000 };

        const mockData = [
            {
                id: 'user1',
                data: () => ({
                    email: 'test@example.com',
                    role: 'admin',
                    createdAt: mockTimestamp,
                    updatedAt: mockTimestamp
                })
            },
            {
                id: 'user2',
                data: () => ({
                    email: 'user2@example.com',
                    // no role, should default to client
                    // no dates
                })
            }
        ];

        const { getDocs } = await import('firebase/firestore');
        vi.mocked(getDocs).mockResolvedValue({
            docs: mockData,
            forEach: (callback: any) => mockData.forEach(callback)
        } as any);

        const { result } = renderHook(() => useUsers(), { wrapper: createWrapper() });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.users).toHaveLength(2);

        const user1 = result.current.users.find(u => u.uid === 'user1');
        expect(user1).toBeDefined();
        expect(user1?.email).toBe('test@example.com');
        expect(user1?.role).toBe('admin');
        expect(user1?.createdAt).toEqual(mockDate);

        const user2 = result.current.users.find(u => u.uid === 'user2');
        expect(user2).toBeDefined();
        expect(user2?.email).toBe('user2@example.com');
        expect(user2?.role).toBe('client'); // default
        expect(user2?.createdAt).toBeUndefined();
    });

    it('should handle errors', async () => {
        const { getDocs } = await import('firebase/firestore');
        vi.mocked(getDocs).mockRejectedValue(new Error('Firestore error'));

        const { result } = renderHook(() => useUsers(), { wrapper: createWrapper() });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBeTruthy();
        // The error message might differ slightly between implementations, but let's check it's not null
    });
});
