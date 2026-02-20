import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import QuestionCard from './QuestionCard';
import { useQuestionsStore } from '../../../../stores/useQuestionsStore';
import { Question } from '../../../../utils/types';

// Mock firebase/firestore to avoid initialization errors
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  updateDoc: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(),
}));

// Mock the store
vi.mock('../../../../stores/useQuestionsStore', () => ({
  useQuestionsStore: vi.fn(),
}));

describe('QuestionCard Component', () => {
  const mockSetUserAnswers = vi.fn();
  const mockQuestion: Question = {
    id: '1',
    title: 'Test Question',
    feedback: 'Feedback',
    answers: ['Option 1', 'Option 2', 'Option 3'],
    answerType: 'M',
    answer: [0, 2],
    isFlagged: false,
    comments: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useQuestionsStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      userAnswers: [],
      setUserAnswers: mockSetUserAnswers,
    });
  });

  it('updates answers correctly for multiple choice questions without regression', () => {
    // Spy on document.querySelectorAll to check for optimization later
    const querySelectorSpy = vi.spyOn(document, 'querySelectorAll');

    render(
      <QuestionCard
        question={mockQuestion}
        currentQuestion={0}
        showAnswer={false}
      />
    );

    const checkbox1 = screen.getByLabelText('Option 1');
    // const checkbox2 = screen.getByLabelText('Option 2'); // Unused variable

    // Simulate checking the first option
    fireEvent.click(checkbox1);

    // In the current implementation, this relies on document.querySelectorAll finding the checked input.
    // However, since fireEvent.click triggers the change, but the component is controlled,
    // the checked state might not be reflected in the DOM immediately for querySelectorAll to see
    // unless the event propagation allows it.
    // Let's see if the mock function is called.
    expect(mockSetUserAnswers).toHaveBeenCalled();

    // Check if querySelectorAll was called
    // In the optimized version, it should NOT be called
    expect(querySelectorSpy).not.toHaveBeenCalled();

    // Clean up spy
    querySelectorSpy.mockRestore();
  });
});
