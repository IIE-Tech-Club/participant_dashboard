// Export Firebase client config only. Do NOT initialize the app here —
// initialization must happen in the browser (client) code where
// NEXT_PUBLIC_ env vars are available to the client bundle.
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

if (!firebaseConfig.apiKey) {
  // warn developers during server startup — don't throw so imports remain safe
  // but the client initializer will throw if keys are missing when actually used.
  // This helps catch misconfiguration early.
  console.warn(
    "Missing NEXT_PUBLIC_FIREBASE_API_KEY — set NEXT_PUBLIC_FIREBASE_* in .env.local for client auth",
  );
}
