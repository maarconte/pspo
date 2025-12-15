import { User, onIdTokenChanged } from "firebase/auth";
import { create } from "zustand";
import { auth } from "../../../lib/firebase";

interface UserState {
	user: User | null;
	setUser: (user: User | null) => void;
	initAuth: () => void;
	refreshToken: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
	user: auth.currentUser,

	setUser: (user) => set({ user }),

	refreshToken: async () => {
		const currentUser = get().user;
		if (currentUser) {
			try {
				// Force token refresh
				await currentUser.getIdToken(true);
				console.log('Token refreshed successfully');
			} catch (error) {
				console.error('Failed to refresh token:', error);
			}
		}
	},

	initAuth: () => {
		// Subscribe to auth state changes
		auth.onAuthStateChanged((user) => {
			set({ user });
		});

		// Subscribe to token changes for automatic refresh
		// Firebase automatically refreshes tokens every hour
		onIdTokenChanged(auth, (user) => {
			if (user) {
				// Token has been refreshed automatically by Firebase
				set({ user });
			}
		});
	},
}));

// Initialize auth listener on store creation
useUserStore.getState().initAuth();

