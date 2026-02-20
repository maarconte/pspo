import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useAddDoc, useBatchAddDocs } from './index';

// Mock Firestore
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn(),
  addDoc: vi.fn(),
  writeBatch: vi.fn(),
  doc: vi.fn(),
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

describe('Performance Benchmark', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('current_implementation_benchmark: N+1 writes', async () => {
    const { addDoc } = await import('firebase/firestore');
    vi.mocked(addDoc).mockResolvedValue({ id: 'new-id' } as any);

    const { result } = renderHook(() => useAddDoc('questions'), {
      wrapper: createWrapper(),
    });

    const items = Array.from({ length: 100 }, (_, i) => ({ title: `Question ${i}` }));

    // Simulate the current implementation loop
    const promises = items.map(item => result.current.handleAdd(item));
    await Promise.all(promises);

    expect(addDoc).toHaveBeenCalledTimes(100);
  });

  it('batch_implementation_benchmark: 1 write per 500 items', async () => {
    const { writeBatch } = await import('firebase/firestore');
    const mockBatch = {
      set: vi.fn(),
      commit: vi.fn().mockResolvedValue(undefined),
    };
    vi.mocked(writeBatch).mockReturnValue(mockBatch as any);

    const { result } = renderHook(() => useBatchAddDocs('questions'), {
      wrapper: createWrapper(),
    });

    const items = Array.from({ length: 100 }, (_, i) => ({ title: `Question ${i}` }));

    await result.current.handleBatchAdd(items);

    expect(writeBatch).toHaveBeenCalledTimes(1);
    expect(mockBatch.commit).toHaveBeenCalledTimes(1);
    expect(mockBatch.set).toHaveBeenCalledTimes(100);
  });

  it('batch_implementation_benchmark: handles > 500 items (chunking)', async () => {
    const { writeBatch } = await import('firebase/firestore');
    const mockBatch = {
      set: vi.fn(),
      commit: vi.fn().mockResolvedValue(undefined),
    };
    vi.mocked(writeBatch).mockReturnValue(mockBatch as any);

    const { result } = renderHook(() => useBatchAddDocs('questions'), {
      wrapper: createWrapper(),
    });

    const items = Array.from({ length: 600 }, (_, i) => ({ title: `Question ${i}` }));

    await result.current.handleBatchAdd(items);

    expect(writeBatch).toHaveBeenCalledTimes(2); // 2 batches
    expect(mockBatch.commit).toHaveBeenCalledTimes(2);
    expect(mockBatch.set).toHaveBeenCalledTimes(600);
  });
});
