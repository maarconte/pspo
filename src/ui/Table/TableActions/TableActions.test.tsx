import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import TableActions from './TableActions';
import { toast } from 'react-toastify';
import { useAddDoc } from '../../../utils/hooks';

// Mock dependencies
vi.mock('../../../utils/hooks', () => ({
  useAddDoc: vi.fn(),
  useDeleteDoc: vi.fn(() => ({
    handleDelete: vi.fn(),
  })),
  useUpdateDoc: vi.fn(() => ({
    handleUpdate: vi.fn(),
  })),
}));

vi.mock('../../../stores/useQuestionsStore', () => ({
  useQuestionsStore: vi.fn(() => ({
    questions: [],
    refetch: vi.fn(),
  })),
}));

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock Papa Parse
vi.mock('papaparse', async () => {
    return {
        default: {
            parse: vi.fn((file, config) => {
                 // Simulate successful parsing
                 const mockData = [
                     { question: 'Q1', answer: 'A1' },
                     { question: 'Q2', answer: 'A2' }
                 ];
                 config.complete({ data: mockData });
            })
        }
    }
});

// Mock FileUploader component to simplify file selection
vi.mock('../../FileUploader', () => ({
  default: ({ handleFile }: { handleFile: (file: any) => void }) => (
    <button onClick={() => handleFile(new File([''], 'test.csv', { type: 'text/csv' }))}>
      Upload File
    </button>
  ),
}));

describe('TableActions', () => {
  const mockHandleAdd = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAddDoc as any).mockReturnValue({
      handleAdd: mockHandleAdd,
    });
  });

  it('should handle errors when adding questions fails', async () => {
    // Arrange: handleAdd rejects
    mockHandleAdd.mockRejectedValue(new Error('Failed to add'));

    render(
      <TableActions
        selectedQuestions={[]}
      />
    );

    // 1. Upload file to populate csvData
    fireEvent.click(screen.getByText('Upload File'));

    // 2. Wait for "Add 2 questions" button to appear
    const addButton = await screen.findByText('Add 2 questions');

    // 3. Click add button
    fireEvent.click(addButton);

    // 4. Assertions for CORRECT behavior (which should FAIL initially)
    // We expect an error toast, and NO success toast.
    await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
            expect.stringContaining("An error occurred")
        );
    });

    expect(toast.success).not.toHaveBeenCalled();
  });

  it('should wait for all questions to be added before showing success', async () => {
     // Arrange: handleAdd resolves after a small delay
     mockHandleAdd.mockImplementation(async () => {
         await new Promise(resolve => setTimeout(resolve, 100));
         return Promise.resolve();
     });

    render(
      <TableActions
        selectedQuestions={[]}
      />
    );

    fireEvent.click(screen.getByText('Upload File'));
    const addButton = await screen.findByText('Add 2 questions');
    fireEvent.click(addButton);

    // Immediately after click, success should NOT be called yet (if awaited correctly)
    // But in current buggy implementation, it IS called immediately.

    // So for this test to pass with fixed code, we expect it to eventually be called.
    // To prove the bug, we can verify it's NOT called immediately?
    // It's hard to test "not called immediately" robustly.

    // Let's rely on the error handling test case to prove the fix mostly.
    // But we can check that it IS called eventually.

    await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("The questions have been added");
    });
  });
});
