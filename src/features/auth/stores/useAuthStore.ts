import { User, onIdTokenChanged } from "firebase/auth";
import { create } from "zustand";
import { auth } from "../../../lib/firebase";

interface UserState {
	user: User | null;
	isAuthLoading: boolean;
	setUser: (user: User | null) => void;
	initAuth: () => void;
	refreshToken: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
	user: auth.currentUser,
	isAuthLoading: true,

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
		console.log('🔧 Initialisation des listeners d\'authentification');

		// Subscribe to auth state changes
		auth.onAuthStateChanged((user) => {
			console.log('🔄 onAuthStateChanged déclenché:', user ? `User ${user.email}` : 'Aucun utilisateur');
			set({ user, isAuthLoading: false });
		});

		// Subscribe to token changes for automatic refresh
		// Firebase automatically refreshes tokens every hour
		onIdTokenChanged(auth, (user) => {
			if (user) {
				console.log('🔄 onIdTokenChanged déclenché:', user.email);
				// Token has been refreshed automatically by Firebase
				set({ user });
			}
		});
	},
}));

// Initialize auth listener on store creation
useUserStore.getState().initAuth();

