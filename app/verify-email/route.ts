\// app/verify-email/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../actions/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const type = searchParams.get("type");

  if (!token || !type) {
    return NextResponse.json({ error: "Missing token or type" }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();

  try {
    // Exchange the token to get the session and extract the email
    const { data, error: exchangeError } = (await supabase).auth.verifyOtp

    if (exchangeError || !data) {
      console.error("Token exchange error:", exchangeError);
      return NextResponse.json({ error: exchangeError?.message || "Invalid token" }, { status: 400 });
    }

    const { email } = data.user; // Extract email from the user data

    // Verify the OTP with email and token
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: type as "signup", // Explicitly cast to match the type
    });

    if (error) {
      console.error("Verification error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Redirect to dashboard on success
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}