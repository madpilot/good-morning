import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // This is fucking ridiculous
  const headers = new Headers(request.headers);
  headers.set("x-current-path", request.nextUrl.pathname);
  headers.set("x-search", request.nextUrl.search);

  return NextResponse.next({ headers });
}

export const config = {
  matcher: [
    // match all routes except static files and APIs
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
