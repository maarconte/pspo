import { User } from "firebase/auth";
import { create } from "zustand";
import { auth } from "../../../lib/firebase";

interface UserState {
	user: User | null;
	setUser: (user: User | null) => void;
	initAuth: () => void;
}

export const useUserStore = create<UserState>((set) => ({
	user: auth.currentUser,

	setUser: (user) => set({ user }),

	initAuth: () => {
		// Subscribe to auth state changes
		auth.onAuthStateChanged((user) => {
			set({ user });
		});
	},
}));

// Initialize auth listener on store creation
useUserStore.getState().initAuth();
