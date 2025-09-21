import { updateSession } from "./lib/supabase/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseServerClient } from "./lib/supabase/server";

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);

  // Prevent caching for protected routes
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");

  const pathname = request.nextUrl.pathname;

  const publicPaths = [
    "/",
    "/signin",
    "/signup",
    "/verify-otp",
    "/forgot-password",
    "/reset-password",
    "/reset-sent",
    "/auth/confirm",
    "/api/webhook/paystack",
    "/admin/login",
  ];
  const authPaths = ["/signin", "/signup"];

  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );
  const isAuthPath = authPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  // Redirect authenticated users away from user auth pages
  if (user && isAuthPath) {
    const supabase = await createSupabaseServerClient();
    const { data: userRecord } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    // ✅ only allow non-admins here
    if (userRecord?.role === "admin") {
      // If admin tries /signin, force logout
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/admin/login";
      return NextResponse.redirect(redirectUrl);
    }

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  // 🔒 Protect /admin/*
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/admin/login";
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    const supabase = await createSupabaseServerClient();
    const { data: userRecord } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!userRecord || userRecord.role !== "admin") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/dashboard";
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 🔒 Protect /dashboard/*
  if (pathname.startsWith("/dashboard")) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/signin";
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    const supabase = await createSupabaseServerClient();
    const { data: userRecord } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    // ✅ if admin tries to hit /dashboard, bounce them to /admin
    if (userRecord?.role === "admin") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/admin";
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Protect all other private routes
  if (!user && !isPublic) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/signin";
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
