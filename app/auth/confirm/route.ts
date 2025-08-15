// app/auth/confirm/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../actions/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as "email" | null;

  if (!token_hash || !type) {
    return NextResponse.redirect(
      new URL("/auth/auth-code-error?reason=invalid-token", request.url)
    );
  }

  const supabase = await createSupabaseServerClient();

  try {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });

    if (error) {
      console.error("Verification error:", error);

      const alreadyVerified =
        error.message.includes("already confirmed") ||
        error.message.includes("already verified");

      return NextResponse.redirect(
        new URL(
          `/auth/auth-code-error?reason=${
            alreadyVerified ? "already-verified" : "invalid-token"
          }`,
          request.url
        )
      );
    }

    // Redirect to login with verified param on success
    const loginUrl = new URL("/signin", request.url);
    loginUrl.searchParams.set("verified", "true");
    return NextResponse.redirect(loginUrl);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.redirect(
      new URL("/auth/auth-code-error?reason=invalid-token", request.url)
    );
  }
}
