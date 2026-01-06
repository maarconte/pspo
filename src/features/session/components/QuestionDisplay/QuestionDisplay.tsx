import { useState, useEffect } from 'react';
import { QuestionData } from '../../types/session.types';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuestionsStore } from '../../../../stores/useQuestionsStore';
import './style.scss';

interface QuestionDisplayProps {
  question: QuestionData;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
  showAnswer?: boolean;
  currentQuestionIndex: number;
  onAnswersChange?: (answers: UserAnswer[]) => void;
}

interface UserAnswer {
  question: number;
  answer: string | string[];
  isBookmarked?: boolean;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  showAnswer = false,
  currentQuestionIndex,
  onAnswersChange,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[] | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const answerType = question.answerType;
  const inputType = answerType === 'M' ? 'checkbox' : 'radio';

  // Accéder au store pour synchroniser les réponses
  const { setUserAnswers: setGlobalUserAnswers } = useQuestionsStore();

  // Clé localStorage unique pour cette session
  const storageKey = `session_answers_${question.questionId.split('_')[0]}`;

  // Charger les réponses depuis localStorage au montage
  useEffect(() => {
    const savedAnswers = localStorage.getItem(storageKey);
    if (savedAnswers) {
      try {
        const parsed = JSON.parse(savedAnswers);
        setUserAnswers(parsed);
        // Synchroniser avec le store global
        setGlobalUserAnswers(parsed);
      } catch (error) {
        console.error('Error loading answers from localStorage:', error);
      }
    }
  }, [storageKey, setGlobalUserAnswers]);

  // Sauvegarder les réponses dans localStorage à chaque modification
  useEffect(() => {
    if (userAnswers.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(userAnswers));
      // Synchroniser avec le store global pour le calcul du score
      setGlobalUserAnswers(userAnswers);
      // Notifier le parent
      if (onAnswersChange) {
        onAnswersChange(userAnswers);
      }
    }
  }, [userAnswers, storageKey, setGlobalUserAnswers, onAnswersChange]);

  // Debug: vérifier si le feedback est présent
  useEffect(() => {
    console.log('QuestionDisplay - question:', question);
    console.log('QuestionDisplay - feedback:', question.feedback);
  }, [question]);

  // Restaurer la réponse de la question actuelle quand on change de question
  useEffect(() => {
    const savedAnswer = userAnswers[currentQuestionIndex];
    if (savedAnswer) {
      setSelectedAnswer(savedAnswer.answer);
    } else {
      setSelectedAnswer(answerType === 'M' ? [] : null);
    }
  }, [currentQuestionIndex, answerType, userAnswers]); // Added userAnswers to dependencies

  /**
   * Gère la sélection pour Single Choice et True/False
   */
  const handleSelectSingle = (option: string) => {
    setSelectedAnswer(option);
    onAnswer(option);

    // Sauvegarder dans userAnswers
    const newArray = [...userAnswers];
    newArray[currentQuestionIndex] = {
      ...newArray[currentQuestionIndex],
      question: currentQuestionIndex,
      answer: option,
    };
    setUserAnswers(newArray);
  };

  /**
   * Gère la sélection pour Multiple Choice
   */
  const handleSelectMultiple = (option: string) => {
    const currentAnswers = Array.isArray(selectedAnswer) ? selectedAnswer : [];
    let newAnswers: string[];

    if (currentAnswers.includes(option)) {
      newAnswers = currentAnswers.filter(a => a !== option);
    } else {
      newAnswers = [...currentAnswers, option];
    }

    setSelectedAnswer(newAnswers);
    onAnswer(newAnswers.join(', '));

    // Sauvegarder dans userAnswers
    const newArray = [...userAnswers];
    newArray[currentQuestionIndex] = {
      ...newArray[currentQuestionIndex],
      question: currentQuestionIndex,
      answer: newAnswers,
    };
    setUserAnswers(newArray);
  };

  /**
   * Gère le bookmark
   */
  const handleChangeBookmark = () => {
    const newArray = [...userAnswers];
    newArray[currentQuestionIndex] = {
      ...newArray[currentQuestionIndex],
      question: currentQuestionIndex,
      answer: selectedAnswer || '',
      isBookmarked: !newArray[currentQuestionIndex]?.isBookmarked,
    };
    setUserAnswers(newArray);
  };

  /**
   * Vérifie si une option est sélectionnée
   */
  const isSelected = (option: string): boolean => {
    if (Array.isArray(selectedAnswer)) {
      return selectedAnswer.includes(option);
    }
    return selectedAnswer === option;
  };

  /**
   * Détermine la classe CSS pour une option
   */
  const getOptionClass = (option: string) => {
    const classes = ['option-button'];

    // Sélection de l'utilisateur
    if (isSelected(option)) {
      classes.push('selected');
    }

    // Quand la réponse est affichée
    if (showAnswer) {
      const correctAnswers = question.correctAnswer.split(', ');
      const isCorrectAnswer = correctAnswers.includes(option);
      const isUserAnswer = isSelected(option);

      // Bonne réponse = fond vert
      if (isCorrectAnswer) {
        classes.push('success');
      }

      // Réponse de l'utilisateur incorrecte = fond rouge
      if (isUserAnswer && !isCorrectAnswer) {
        classes.push('error');
      }
    }

    return classes.join(' ');
  };

  /**
   * Rendu pour True/False
   */
  const renderTrueFalse = () => (
    <>
      <Button
        variant="outline"
        className={getOptionClass('True')}
        onClick={() => handleSelectSingle('True')}
      >
        <span className="option-letter"></span>
        <span className="option-text">True</span>
      </Button>
      <Button
        variant="outline"
        className={getOptionClass('False')}
        onClick={() => handleSelectSingle('False')}
      >
        <span className="option-letter"></span>
        <span className="option-text">False</span>
      </Button>
    </>
  );

  /**
   * Rendu pour Single/Multiple Choice
   */
  const renderOptions = () => (
    <>
      {question.options.map((option, index) => (
        <Button
          key={index}
          variant="outline"
          className={getOptionClass(option)}
          onClick={() => answerType === 'M' ? handleSelectMultiple(option) : handleSelectSingle(option)}
        >
          <span className={'option-letter ' + (answerType === 'M' ? 'option-checkbox' : 'option-radio')}>
          </span>
          <span className="fw-bold">
            {String.fromCharCode(65 + index)}.
          </span>
          <span className="option-text">{option}</span>
          {answerType === 'M' && (
            <input
              type="checkbox"
              checked={isSelected(option)}
              readOnly
              style={{ marginLeft: 'auto' }}
            />
          )}
        </Button>
      ))}
    </>
  );

  return (
    <div className="question-display">
      {/* En-tête avec numéro de question */}
      <div className="question-display__header">
        <div className="d-flex justify-content-between gap-1 w-100">
          <div className="question-number">
            Question {questionNumber} / {totalQuestions}
          </div>
          {answerType === 'M' && (
            <div className="question-type-badge">Multiple Choice</div>
          )}
        </div>
      </div>

      {/* Question avec bookmark */}
      <div className="d-flex justify-content-between gap-1">
        <h2 className="h4 mb-2">{question.questionText}</h2>
        <Bookmark
          size={42}
          fill={userAnswers[currentQuestionIndex]?.isBookmarked ? "#f6b223" : "none"}
          onClick={handleChangeBookmark}
          className="bookmark"
          style={{ cursor: 'pointer', flexShrink: 0 }}
        />
      </div>

      {/* Options de réponse */}
      <div className="question-display__options">
        {answerType === 'TF' ? renderTrueFalse() : renderOptions()}
      </div>

      {/* Message après réponse */}
      {selectedAnswer && !showAnswer && (
        <div className="question-display__feedback">
          <p>Réponse enregistrée ! Vous pouvez la modifier à tout moment.</p>
        </div>
      )}

      {/* Feedback quand la réponse est affichée */}
      {showAnswer && question.feedback && (
        <div className="question-display__feedback-section">
          <div className="feedback-box">
            <h3 className="h5">Feedback</h3>
            <p>{question.feedback}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionDisplay;
