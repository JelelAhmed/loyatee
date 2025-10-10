// import { updateSession } from "./lib/supabase/middleware";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { createSupabaseServerClient } from "./lib/supabase/server";

// export async function middleware(request: NextRequest) {
//   const { response, user } = await updateSession(request);

//   // Prevent caching for protected routes
//   response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");

//   const pathname = request.nextUrl.pathname;

//   const publicPaths = [
//     "/",
//     "/signin",
//     "/signup",
//     "/verify-otp",
//     "/forgot-password",
//     "/reset-password",
//     "/reset-sent",
//     "/auth/confirm",
//     "/api/webhook/paystack",
//     "/admin/login",
//   ];
//   const authPaths = ["/signin", "/signup"];

//   const isPublic = publicPaths.some(
//     (path) => pathname === path || pathname.startsWith(path + "/")
//   );
//   const isAuthPath = authPaths.some(
//     (path) => pathname === path || pathname.startsWith(path + "/")
//   );

//   // Redirect authenticated users away from user auth pages
//   if (user && isAuthPath) {
//     const supabase = await createSupabaseServerClient();
//     const { data: userRecord } = await supabase
//       .from("users")
//       .select("role")
//       .eq("id", user.id)
//       .single();

//     // ✅ only allow non-admins here
//     if (userRecord?.role === "admin") {
//       // If admin tries /signin, force logout
//       const redirectUrl = request.nextUrl.clone();
//       redirectUrl.pathname = "/admin/login";
//       return NextResponse.redirect(redirectUrl);
//     }

//     const redirectUrl = request.nextUrl.clone();
//     redirectUrl.pathname = "/dashboard";
//     return NextResponse.redirect(redirectUrl);
//   }

//   // 🔒 Protect /admin/*
//   if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
//     if (!user) {
//       const redirectUrl = request.nextUrl.clone();
//       redirectUrl.pathname = "/admin/login";
//       redirectUrl.searchParams.set("redirect", pathname);
//       return NextResponse.redirect(redirectUrl);
//     }

//     const supabase = await createSupabaseServerClient();
//     const { data: userRecord } = await supabase
//       .from("users")
//       .select("role")
//       .eq("id", user.id)
//       .single();

//     if (!userRecord || userRecord.role !== "admin") {
//       const redirectUrl = request.nextUrl.clone();
//       redirectUrl.pathname = "/dashboard";
//       return NextResponse.redirect(redirectUrl);
//     }
//   }

//   // 🔒 Protect /dashboard/*
//   if (pathname.startsWith("/dashboard")) {
//     if (!user) {
//       const redirectUrl = request.nextUrl.clone();
//       redirectUrl.pathname = "/signin";
//       redirectUrl.searchParams.set("redirect", pathname);
//       return NextResponse.redirect(redirectUrl);
//     }

//     const supabase = await createSupabaseServerClient();
//     const { data: userRecord } = await supabase
//       .from("users")
//       .select("role")
//       .eq("id", user.id)
//       .single();

//     // ✅ if admin tries to hit /dashboard, bounce them to /admin
//     if (userRecord?.role === "admin") {
//       const redirectUrl = request.nextUrl.clone();
//       redirectUrl.pathname = "/admin";
//       return NextResponse.redirect(redirectUrl);
//     }
//   }

//   // Protect all other private routes
//   if (!user && !isPublic) {
//     const redirectUrl = request.nextUrl.clone();
//     redirectUrl.pathname = "/signin";
//     redirectUrl.searchParams.set("redirect", pathname);
//     return NextResponse.redirect(redirectUrl);
//   }

//   return response;
// }

// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
//   ],
// };

import { updateSession } from "./lib/supabase/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseServerClient } from "./lib/supabase/server";
import { createClient } from "@supabase/supabase-js"; // For admin client
import type { User } from "@supabase/supabase-js";

// Extend Supabase User type with top-level banned_until
type AuthUserWithBan = User & {
  banned_until?: string | null; // Top-level field from auth.users
};

function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Service role for admin ops
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);

  console.log(
    `[Middleware] Path: ${request.nextUrl.pathname}, User ID: ${
      user?.id || "none"
    }, Session valid: ${!!user}`
  );

  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");

  const pathname = request.nextUrl.pathname;
  const isApiPath = pathname.startsWith("/api");

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

  if (isPublic && !isAuthPath) {
    console.log(`[Middleware] Public path, allowing: ${pathname}`);
    return response;
  }

  let extendedUser: AuthUserWithBan | null = null;
  let userRole: string | null = null;
  if (user) {
    console.log(`[Middleware] Fetching extended user data for ${user.id}`);
    const supabaseServer = await createSupabaseServerClient();
    const supabaseAdmin = createSupabaseAdminClient();

    const { data: authUserData, error: authError } =
      await supabaseAdmin.auth.admin.getUserById(user.id);
    if (authError) {
      console.error("[Middleware] Failed to fetch user metadata:", authError);
      extendedUser = { ...user, banned_until: null } as AuthUserWithBan; // Safe fallback
    } else {
      extendedUser = authUserData?.user as AuthUserWithBan;
    }

    const { data: userRecord, error: roleError } = await supabaseServer
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();
    if (roleError) {
      console.error("[Middleware] Failed to fetch user role:", roleError);
    }
    userRole = userRecord?.role || extendedUser?.app_metadata?.role || "user";
    console.log(
      `[Middleware] User role resolved: ${userRole}, banned_until: ${
        extendedUser?.banned_until || "null"
      }`
    );
  } else {
    console.log(`[Middleware] No user session, treating as unauth`);
  }

  // Handle auth paths: Redirect signed-in users to app (but skip if coming from ban redirect)
  const url = new URL(request.url);
  const isFromBanRedirect =
    url.searchParams.has("error") &&
    url.searchParams.get("error") === "suspended";
  if (isAuthPath && user && !isFromBanRedirect) {
    console.log(`[Middleware] Auth path with user, redirecting to app`);
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = userRole === "admin" ? "/admin" : "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthPath && !user) {
    console.log(`[Middleware] Auth path without user, allowing form`);
    return response;
  }

  // Ban check: Block all non-public access for banned users (pages & APIs)
  // Banned users (including admins) can't access protected routes; redirect to signin for feedback
  if (user && extendedUser) {
    const bannedUntil = extendedUser.banned_until;
    if (bannedUntil && new Date(bannedUntil) > new Date()) {
      console.log(
        `[Middleware] Banned user ${user.id} blocked from ${pathname} (until ${bannedUntil})`
      );
      if (isApiPath) {
        return new NextResponse(
          JSON.stringify({ error: "Account suspended" }),
          {
            status: 403,
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        // Break loop: Delete auth cookies to force sign-out, then redirect to signin
        const redirectResponse = NextResponse.redirect(
          new URL("/signin?error=suspended", request.url)
        );
        // Delete Supabase auth cookies (exact names for your project ref: itwwtuveojxmauokucyo)
        redirectResponse.cookies.delete("sb-itwwtuveojxmauokucyo-auth-token");
        redirectResponse.cookies.delete("sb-itwwtuveojxmauokucyo-access-token");
        redirectResponse.cookies.delete(
          "sb-itwwtuveojxmauokucyo-refresh-token"
        );
        return redirectResponse;
      }
    }
  }

  // Admin routes (excluding /admin/login) - Banned admins already blocked above
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!user) {
      console.log(`[Middleware] Unauth admin access, redirect to login`);
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/admin/login";
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (userRole !== "admin") {
      console.log(`[Middleware] Non-admin access to admin, deny`);
      if (isApiPath) {
        return new NextResponse(JSON.stringify({ error: "Access denied" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/dashboard";
      return NextResponse.redirect(redirectUrl);
    }
    console.log(`[Middleware] Admin access granted`);
  }

  // User routes (e.g., /dashboard, /dashboard/buy-data, /dashboard/wallet, /dashboard/transactions)
  // Covers all topNav routes under /dashboard/*
  if (pathname.startsWith("/dashboard")) {
    if (!user) {
      console.log(`[Middleware] Unauth user route, redirect to signin`);
      if (isApiPath) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/signin";
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (userRole === "admin") {
      console.log(`[Middleware] Admin on user route, redirect to admin`);
      if (isApiPath) {
        return new NextResponse(JSON.stringify({ error: "Access denied" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/admin";
      return NextResponse.redirect(redirectUrl);
    }
    console.log(`[Middleware] User access to protected route granted`);
  }

  // Fallback: Protect any other non-public routes
  if (!isPublic && !user) {
    console.log(`[Middleware] Unauth fallback, redirect to signin`);
    if (isApiPath) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/signin";
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  console.log(`[Middleware] All checks passed, proceeding`);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/api/((?!webhook/paystack|auth/callback).*)",
  ],
};
