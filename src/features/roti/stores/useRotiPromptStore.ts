import { create } from 'zustand';

interface RotiPromptState {
  /** True when the end-of-quiz ROTI pop-up should be displayed. */
  isOpen: boolean;
  /** Formation of the quiz that triggered the pop-up (captured when it opens). */
  formation: string | null;
  open: (formation?: string | null) => void;
  close: () => void;
}

/**
 * Lets the quiz page request the ROTI pop-up even when it is already
 * unmounted (the user left the finished quiz for another page). The formation
 * is captured at that moment so the rating is tied to the quiz just taken,
 * not to whatever module is selected later.
 */
export const useRotiPromptStore = create<RotiPromptState>((set) => ({
  isOpen: false,
  formation: null,
  open: (formation = null) => set({ isOpen: true, formation }),
  close: () => set({ isOpen: false }),
}));
