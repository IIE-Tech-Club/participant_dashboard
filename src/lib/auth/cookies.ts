// lib/auth/cookies.ts

import { cookies } from "next/headers";

export const setAuthCookie = async (token: string) => {
  (await cookies()).set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14, // 14 days
  });
};

export const getAuthCookie = async () => {
  return (await cookies()).get("token")?.value;
};

export const clearAuthCookie = async () => {
  (await cookies()).delete("token");
};
