import { GoogleAuthProvider } from "firebase/auth";
import { app } from "./lib/firebase/config";
import { auth } from "./lib/firebase/auth";

export const Firebase = app;
export { auth };
export const GoogleAuthProviders = { google: new GoogleAuthProvider() };

