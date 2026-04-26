import { initializeApp, getApps, getApp } from "firebase/app";
import { firebaseConfig } from "./config";
import type { Auth, User, Unsubscribe, AuthError } from "firebase/auth";
import { getHumanReadableError, getInitializationError, type AuthResult } from "./error-messages";

let auth: Auth | null = null;
let authMod: typeof import("firebase/auth") | null = null;

const ensureInit = async (): Promise<void> => {
  if (typeof window === "undefined") {
    throw new Error("Firebase client must be initialized in the browser");
  }

  if (auth && authMod) return;

  if (!firebaseConfig?.apiKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_FIREBASE_API_KEY — set NEXT_PUBLIC_FIREBASE_* env vars in .env.local",
    );
  }

  authMod = await import("firebase/auth");

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = authMod.getAuth(app) as Auth;
};

export const signInWithGoogle = async (): Promise<AuthResult<string>> => {
  try {
    await ensureInit();
    if (!authMod || !auth) {
      const error = getInitializationError(new Error("Firebase Auth not initialized"));
      return error;
    }
    const provider = new authMod.GoogleAuthProvider();
    await authMod.setPersistence(auth, authMod.browserLocalPersistence);
    const result = await authMod.signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();
    return { success: true, data: token };
  } catch (error) {
    const authError = error as AuthError;
    const userFriendlyError = getHumanReadableError(authError);
    return userFriendlyError;
  }
};

export const signOutUser = async (): Promise<AuthResult<void>> => {
  try {
    await ensureInit();
    if (!authMod || !auth) {
      const error = getInitializationError(new Error("Firebase Auth not initialized"));
      return error;
    }
    await authMod.signOut(auth);
    return { success: true, data: undefined };
  } catch (error) {
    const authError = error as AuthError;
    const userFriendlyError = getHumanReadableError(authError);
    return userFriendlyError;
  }
};

export const onAuthStateChangedListener = async (
  cb: (user: User | null) => void,
): Promise<AuthResult<Unsubscribe>> => {
  try {
    await ensureInit();
    if (!authMod || !auth) {
      const error = getInitializationError(new Error("Firebase Auth not initialized"));
      return error;
    }
    const unsubscribe = authMod.onAuthStateChanged(auth, cb);
    return { success: true, data: unsubscribe };
  } catch (error) {
    const authError = error as AuthError;
    const userFriendlyError = getHumanReadableError(authError);
    return userFriendlyError;
  }
};

export const getAuthInstance = async (): Promise<AuthResult<Auth>> => {
  try {
    await ensureInit();
    if (!auth) {
      const error = getInitializationError(new Error("Firebase Auth not initialized"));
      return error;
    }
    return { success: true, data: auth };
  } catch (error) {
    const authError = error as AuthError;
    const userFriendlyError = getHumanReadableError(authError);
    return userFriendlyError;
  }
};
