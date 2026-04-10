export interface CounterProps {
  isPaused: boolean;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  finishQuizz: () => void;
  /** Called every second with the elapsed time of the current question (in seconds). */
  onTick?: (seconds: number) => void;
  /** Current question index — resets the elapsed tick counter when it changes. */
  currentQuestion?: number;
}
