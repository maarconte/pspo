/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_FIREBASE_API_KEY: string
	readonly VITE_FIREBASE_AUTH_DOMAIN: string
	readonly VITE_FIREBASE_PROJECT_ID: string
	readonly VITE_FIREBASE_STORAGE_BUCKET: string
	readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
	readonly VITE_FIREBASE_APP_ID: string
	/** Override the Firestore collection used for questions (defaults to "questions" in prod builds, "questions_dev" in `npm run dev`). */
	readonly VITE_FIREBASE_QUESTIONS_COLLECTION?: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
