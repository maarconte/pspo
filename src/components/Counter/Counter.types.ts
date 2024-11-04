export interface CounterProps {
  isPaused: boolean;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  finishQuizz: () => void;
}
