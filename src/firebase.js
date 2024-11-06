import { GoogleAuthProvider, getAuth } from "firebase/auth";

import { getAnalytics } from "firebase/analytics";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASEAPIKEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: "pspo-309c0",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};

export const Firebase = initializeApp(firebaseConfig);
// const analytics = getAnalytics(Firebase);
//export const auth = getAuth();
export const Providers = { google: new GoogleAuthProvider() };
