import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useFetchFirebase, useAddDoc, useUpdateDoc, useDeleteDoc, useAddDocs, useDeleteDocs } from './index';

// Mock Firestore
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn(),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  doc: vi.fn(),
  writeBatch: vi.fn(() => ({
    set: vi.fn(),
    delete: vi.fn(),
    commit: vi.fn().mockResolvedValue(undefined),
  })),
  serverTimestamp: vi.fn(() => ({ seconds: Date.now() / 1000 })),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useFetchFirebase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch data from Firebase collection', async () => {
    const mockData = [
      { id: '1', title: 'Test Question 1' },
      { id: '2', title: 'Test Question 2' },
    ];

    const { getDocs } = await import('firebase/firestore');
    vi.mocked(getDocs).mockResolvedValue({
      forEach: (callback: any) => {
        mockData.forEach((item) => {
          callback({
            id: item.id,
            data: () => item,
          });
        });
      },
    } as any);

    const { result } = renderHook(() => useFetchFirebase('questions'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toHaveLength(2);
    expect(result.current.errorMessage).toBe('');
  });

  it('should handle errors', async () => {
    const { getDocs } = await import('firebase/firestore');
    vi.mocked(getDocs).mockRejectedValue(new Error('Firebase error'));

    const { result } = renderHook(() => useFetchFirebase('questions'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.errorMessage).toBe('Firebase error');
  });
});

describe('useAddDocs', () => {
  it('should add multiple documents to Firestore using writeBatch', async () => {
    const { writeBatch } = await import('firebase/firestore');

    const { result } = renderHook(() => useAddDocs('questions'), {
      wrapper: createWrapper(),
    });

    const newQuestions = [
      { title: 'New Question 1', answer: 0 },
      { title: 'New Question 2', answer: 1 },
    ];

    result.current.handleAddDocs(newQuestions);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(writeBatch).toHaveBeenCalled();
  });
});

describe('useAddDoc', () => {
  it('should add a document to Firestore', async () => {
    const { addDoc } = await import('firebase/firestore');
    vi.mocked(addDoc).mockResolvedValue({ id: 'new-id' } as any);

    const { result } = renderHook(() => useAddDoc('questions'), {
      wrapper: createWrapper(),
    });

    const newQuestion = { title: 'New Question', answer: 0 };
    result.current.handleAdd(newQuestion);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(addDoc).toHaveBeenCalled();
  });
});

describe('useUpdateDoc', () => {
  it('should update a document in Firestore', async () => {
    const { updateDoc, getDoc } = await import('firebase/firestore');
    vi.mocked(getDoc).mockResolvedValue({
      data: () => ({ title: 'Old Title' }),
    } as any);
    vi.mocked(updateDoc).mockResolvedValue(undefined);

    const { result } = renderHook(
      () => useUpdateDoc({ collectionName: 'questions', docId: 'test-id' }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    result.current.handleUpdate({ title: 'New Title' });

    await waitFor(() => {
      expect(result.current.mutationStatus).toBe('success');
    });

    expect(updateDoc).toHaveBeenCalled();
  });
});

describe('useDeleteDocs', () => {
  it('should delete multiple documents from Firestore using writeBatch', async () => {
    const { writeBatch } = await import('firebase/firestore');

    const { result } = renderHook(() => useDeleteDocs('questions'), {
      wrapper: createWrapper(),
    });

    result.current.handleDeleteDocs(['test-id-1', 'test-id-2']);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(writeBatch).toHaveBeenCalled();
  });
});

describe('useDeleteDoc', () => {
  it('should delete a document from Firestore', async () => {
    const { deleteDoc } = await import('firebase/firestore');
    vi.mocked(deleteDoc).mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteDoc('questions'), {
      wrapper: createWrapper(),
    });

    result.current.handleDelete('test-id');

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(deleteDoc).toHaveBeenCalled();
  });
});
