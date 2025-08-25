import { updateSession } from "./lib/supabase/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Call updateSession to refresh auth token and get user
  const { response, user, session } = await updateSession(request);

  // Prevent caching for protected routes
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");

  // console.log("🪵 Middleware Debug — Path:", request.nextUrl.pathname);
  // console.log("🪵 Middleware Debug — User:", user);
  // console.log("🪵 Middleware Debug — Session:", session);
  // console.log("🪵 Middleware Debug — Cookies:", request.cookies.getAll());

  const publicPaths = [
    "/",
    "/signin",
    "/signup",
    "/auth/confirm",
    "/api/webhook/paystack",
  ];
  const authPaths = ["/signin", "/signup"];

  const isPublic = publicPaths.some(
    (path) =>
      request.nextUrl.pathname === path ||
      request.nextUrl.pathname.startsWith(path + "/")
  );
  const isAuthPath = authPaths.some(
    (path) =>
      request.nextUrl.pathname === path ||
      request.nextUrl.pathname.startsWith(path + "/")
  );

  // Redirect authenticated users away from auth pages
  if (user && isAuthPath) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";

    return NextResponse.redirect(redirectUrl);
  }

  // Protect private routes
  if (!user && !isPublic) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/signin";
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);

    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
