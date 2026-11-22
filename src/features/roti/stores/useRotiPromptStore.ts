import { create } from 'zustand';

interface RotiPromptState {
  /** True when the end-of-quiz ROTI pop-up should be displayed. */
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

/**
 * Lets the quiz page request the ROTI pop-up even when it is already
 * unmounted (the user left the finished quiz for another page).
 */
export const useRotiPromptStore = create<RotiPromptState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
