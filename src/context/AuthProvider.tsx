"use client";

import { createContext, useEffect, useState, ReactNode } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChangedListener } from "@/lib/firebase/client";
import { API_BASE_URL } from "@/lib/site";

export const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  error: string | null;
}>({ user: null, loading: true, error: null });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    (async () => {
      try {
        const result = await onAuthStateChangedListener(async (user) => {
          setUser(user);
          setLoading(false);
          if (user) {
            try {
              const token = await user.getIdToken();
              // Sync session cookie
              await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
              });

              // Sync with MongoDB backend
              await fetch(`${API_BASE_URL}/users/sync`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  uid: user.uid,
                  name: user.displayName || "Anonymous",
                  email: user.email,
                  photoURL: user.photoURL
                }),
              });
            } catch (err) {
              const msg = err instanceof Error ? err.message : "Session synchronization failed.";
              setError(msg);
            }
          }
        });

        if (result.success) {
          unsubscribe = result.data;
        } else {
          setError("Initialization failure: Unable to establish auth listener.");
          setLoading(false);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "An unexpected authentication error occurred.";
        setError(msg);
        setLoading(false);
      }
    })();

    return () => unsubscribe?.();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
