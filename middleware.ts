import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // token will exist if user is logged in
  const token = await getToken({ req, secret: process.env.SECRET });

  if (req.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  if (!token && req.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.rewrite(new URL("/login", req.url));
  }
}
