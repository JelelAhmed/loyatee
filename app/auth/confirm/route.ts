// app/auth/confirm/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../actions/utils";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as "email" | null; // Type as "email" for confirmation
  const next = searchParams.get("next") ?? "/dashboard"; // Default to /dashboard

  if (!token_hash || !type) {
    return NextResponse.redirect(new URL("/auth/auth-code-error", request.url)); // Redirect to error page
  }

  const supabase = await createSupabaseServerClient();

  try {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (error) {
      console.error("Verification error:", error);
      return NextResponse.redirect(
        new URL("/auth/auth-code-error", request.url)
      );
    }

    // Redirect to the specified next URL or dashboard on success
    return NextResponse.redirect(new URL(next, request.url));
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.redirect(new URL("/auth/auth-code-error", request.url));
  }
}
