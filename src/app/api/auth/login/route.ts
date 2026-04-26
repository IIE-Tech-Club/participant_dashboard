import { NextRequest, NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth/cookies";

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ error: "No token" }, { status: 400 });
  }

  await setAuthCookie(token);

  return NextResponse.json({ success: true });
}
