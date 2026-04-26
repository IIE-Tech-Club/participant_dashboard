import { NextResponse } from "next/server";
import { getAuthCookie } from "@/lib/auth/cookies";
import { verifyToken } from "@/lib/auth/verifyToken";

export async function GET() {
  const token = await getAuthCookie();

  if (!token) {
    return NextResponse.json({ user: null });
  }

  const decoded = await verifyToken(token);

  return NextResponse.json({ user: decoded || null });
}
