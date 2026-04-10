import { create } from "zustand";
import { persist } from "zustand/middleware";

// Decommissioned in 30 days starting from 2026-04-10
const EXPIRY_DATE = new Date("2026-05-10T00:00:00.000Z").getTime();

interface InfoPopupState {
  isDismissed: boolean;
  isOpen: boolean;
  open: () => void;
  dismiss: () => void;
  isExpired: () => boolean;
}

export const useInfoPopupStore = create<InfoPopupState>()(
  persist(
    (set, get) => ({
      isDismissed: false,
      isOpen: false,

      isExpired: () => Date.now() > EXPIRY_DATE,

      open: () => {
        const { /* isDismissed, */ isExpired } = get();
        if (/* !isDismissed && */ !isExpired()) {
          set({ isOpen: true });
        }
      },

      dismiss: () => set({ isDismissed: true, isOpen: false }),
    }),
    {
      name: "pspo-info-popup-v1",
      partialize: (state) => ({ isDismissed: state.isDismissed }),
    }
  )
);
