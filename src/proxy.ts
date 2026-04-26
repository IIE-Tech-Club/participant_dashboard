import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("token");
  const isAuthPage = req.nextUrl.pathname === "/";
  const isProtectedPage = req.nextUrl.pathname.startsWith("/dashboard");

  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
