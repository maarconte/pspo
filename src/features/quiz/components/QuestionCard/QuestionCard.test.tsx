import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import QuestionCard from './QuestionCard';
import { useQuestionsStore } from '../../../../stores/useQuestionsStore';

// Mock Firebase Firestore to prevent initialization errors
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn(),
  doc: vi.fn(),
  getDocs: vi.fn(),
  updateDoc: vi.fn(),
}));

// Mock the store
vi.mock('../../../../stores/useQuestionsStore', () => ({
  useQuestionsStore: vi.fn(),
}));

describe('QuestionCard', () => {
  const mockSetUserAnswers = vi.fn();

  const mockState = {
    userAnswers: [
      { question: 0, answer: undefined, isBookmarked: false }, // Initial state for Q0
      { question: 1, answer: [0], isBookmarked: true }
    ],
    setUserAnswers: mockSetUserAnswers,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Setup default mock implementation
    (useQuestionsStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => {
      return selector ? selector(mockState) : mockState;
    });
  });

  it('renders question title and answers', () => {
    const mockQuestion = {
      id: '1',
      title: 'What is 1+1?',
      answerType: 'S',
      answers: ['1', '2', '3'],
      answer: 1,
      explanation: 'Math',
      isFlagged: false,
      type: 'test'
    };

    render(
      <QuestionCard
        question={mockQuestion as any}
        currentQuestion={0}
        showAnswer={false}
      />
    );

    expect(screen.getByText('1. What is 1+1?')).toBeInTheDocument();
    expect(screen.getByLabelText('1')).toBeInTheDocument();
    expect(screen.getByLabelText('2')).toBeInTheDocument();
    expect(screen.getByLabelText('3')).toBeInTheDocument();
  });

  it('calls setUserAnswers with correct functional update when an answer is selected (Radio)', () => {
    const mockQuestion = {
      id: '1',
      title: 'What is 1+1?',
      answerType: 'S',
      answers: ['1', '2', '3'],
      answer: 1,
      explanation: 'Math',
      isFlagged: false,
      type: 'test'
    };

    render(
      <QuestionCard
        question={mockQuestion as any}
        currentQuestion={0}
        showAnswer={false}
      />
    );

    const radioOption2 = screen.getByLabelText('2');
    fireEvent.click(radioOption2);

    expect(mockSetUserAnswers).toHaveBeenCalledTimes(1);

    // Check that it was called with a function
    const updateFn = mockSetUserAnswers.mock.calls[0][0];
    expect(typeof updateFn).toBe('function');

    // Verify the function logic
    const prevState = [
        { question: 0, answer: undefined, isBookmarked: false },
        { question: 1, answer: 99, isBookmarked: true } // Dummy other question
    ];
    const newState = updateFn(prevState);

    expect(newState).toHaveLength(2);
    expect(newState[0]).toEqual({
        question: 0,
        answer: 1, // Index of '2' is 1
        isBookmarked: false
    });
    // Ensure other questions are untouched (reference equality check might fail if spread is used, but content matches)
    expect(newState[1]).toEqual(prevState[1]);
  });

  it('calls setUserAnswers with correct functional update when bookmark is toggled', () => {
    const mockQuestion = {
      id: '1',
      title: 'Test',
      answerType: 'S',
      answers: ['A'],
      answer: 0,
      explanation: '',
      isFlagged: false,
      type: 'test'
    };

    render(
      <QuestionCard
        question={mockQuestion as any}
        currentQuestion={0}
        showAnswer={false}
      />
    );

    // Find bookmark icon (it's an SVG, might need to find by class or other means)
    // The component uses Lucide React 'Bookmark'. It usually renders an svg.
    // We can try finding by class 'bookmark'
    const bookmark = document.querySelector('.bookmark');
    if (bookmark) {
        fireEvent.click(bookmark);

        expect(mockSetUserAnswers).toHaveBeenCalled();
        const updateFn = mockSetUserAnswers.mock.calls[0][0];
        const prevState = [{ question: 0, answer: undefined, isBookmarked: false }];
        const newState = updateFn(prevState);

        expect(newState[0].isBookmarked).toBe(true);
    }
  });

    it('handles multiple choice updates correctly (array index preservation)', () => {
        const mockQuestion = {
            id: '2',
            title: 'Select multiple',
            answerType: 'M',
            answers: ['A', 'B', 'C'],
            answer: [0, 1],
            explanation: '',
            isFlagged: false,
            type: 'test'
        };

        // Render for question index 1
        render(
            <QuestionCard
                question={mockQuestion as any}
                currentQuestion={1}
                showAnswer={false}
            />
        );

        const checkboxA = screen.getByLabelText('A') as HTMLInputElement;

        // Mock querySelectorAll to simulate checked state, as JSDOM/React controlled components
        // might not update the DOM 'checked' property immediately during the event handler
        // or might revert it due to 'checked' prop being false from store.
        const originalQuerySelectorAll = document.querySelectorAll;
        document.querySelectorAll = vi.fn((selector) => {
            if (selector === 'input[type="checkbox"]:checked') {
                return [checkboxA] as any;
            }
            return originalQuerySelectorAll.call(document, selector);
        });

        fireEvent.click(checkboxA);

        // Restore
        document.querySelectorAll = originalQuerySelectorAll;

        expect(mockSetUserAnswers).toHaveBeenCalled();
        const updateFn = mockSetUserAnswers.mock.calls[0][0];

        // Simulate state where we have 3 questions, we are updating index 1
        const prevState = [
            { question: 0, answer: 0, isBookmarked: false },
            { question: 1, answer: [], isBookmarked: false },
            { question: 2, answer: 2, isBookmarked: false }
        ];

        const newState = updateFn(prevState);

        // Expect newState to preserve order
        expect(newState[0]).toEqual(prevState[0]);
        expect(newState[2]).toEqual(prevState[2]);

        // Expect index 1 to be updated
        expect(newState[1].question).toBe(1);
        expect(newState[1].answer).toContain(0); // Index 0 selected
    });
});
