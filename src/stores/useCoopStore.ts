import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CoopState {
  participants: string[];
  currentIndex: number;
  isOpen: boolean;

  // Actions
  addParticipant: (name: string) => { success: boolean; error?: string };
  removeParticipant: (index: number) => void;
  nextTurn: () => void;
  resetTurn: () => void;
  setOpen: (open: boolean) => void;
  toggleDrawer: () => void;
}

export const useCoopStore = create<CoopState>()(
  persist(
    (set, get) => ({
      participants: [],
      currentIndex: 0,
      isOpen: false,

      addParticipant: (name) => {
        const { participants } = get();
        if (participants.length >= 30) {
          return {
            success: false,
            error: "zut, vous êtes nombreux ! Malheureusement l'outil est limité à 30 personnes",
          };
        }
        if (!name.trim()) return { success: false };

        set({ participants: [...participants, name.trim()] });
        return { success: true };
      },

      removeParticipant: (index) => {
        set((state) => {
          const newParticipants = state.participants.filter((_, i) => i !== index);
          let newIndex = state.currentIndex;
          
          // Adjust currentIndex if necessary
          if (newIndex >= newParticipants.length && newParticipants.length > 0) {
            newIndex = 0;
          } else if (newParticipants.length === 0) {
            newIndex = 0;
          }

          return {
            participants: newParticipants,
            currentIndex: newIndex,
          };
        });
      },

      nextTurn: () => {
        set((state) => {
          if (state.participants.length === 0) return { currentIndex: 0 };
          const nextIndex = (state.currentIndex + 1) % state.participants.length;
          return { currentIndex: nextIndex };
        });
      },

      resetTurn: () => set({ currentIndex: 0 }),

      setOpen: (open) => set({ isOpen: open }),

      toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "coop-storage",
      partialize: (state) => ({ 
        participants: state.participants,
        currentIndex: state.currentIndex 
      }),
    }
  )
);
