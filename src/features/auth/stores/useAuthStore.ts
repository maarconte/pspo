import { User, onIdTokenChanged, updateProfile } from "firebase/auth";
import { create } from "zustand";
import { auth } from "../../../lib/firebase";

interface UserState {
	user: User | null;
	setUser: (user: User | null) => void;
	initAuth: () => void;
	refreshToken: () => Promise<void>;
	updateDisplayName: (displayName: string) => Promise<void>;
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

	updateDisplayName: async (displayName: string) => {
		const currentUser = get().user;
		if (currentUser) {
			try {
				await updateProfile(currentUser, { displayName });
				// Force a reload to get the updated user object
				await currentUser.reload();
				// Update the local state with the refreshed user
				set({ user: auth.currentUser });
				console.log('Display name updated successfully');
			} catch (error) {
				console.error('Failed to update display name:', error);
				throw error;
			}
		} else {
			throw new Error('No user is currently logged in');
		}
	},

	initAuth: () => {
		console.log('🔧 Initialisation des listeners d\'authentification');

		// Subscribe to auth state changes
		auth.onAuthStateChanged((user) => {
			console.log('🔄 onAuthStateChanged déclenché:', user ? `User ${user.email}` : 'Aucun utilisateur');
			set({ user });
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

