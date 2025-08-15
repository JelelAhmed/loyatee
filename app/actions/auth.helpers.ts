// app/actions/auth.helpers.ts
"use server";

import { createSupabaseServerClient } from "./utils";

interface ResendVerificationResult {
  success: boolean;
  message: string;
}

export async function resendEmailVerification(
  email: string
): Promise<ResendVerificationResult> {
  const supabase = await createSupabaseServerClient();

  try {
    // Query the auth.users table to check if the user exists and is unconfirmed
    const { data: user, error } = await supabase
      .from("auth.users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return { success: false, message: "User not found" };
    }

    if (!user.confirmed_at) {
      // User exists but not confirmed → trigger resend using magic link
      const { data, error: resendError } =
        await supabase.auth.admin.generateLink({
          type: "magiclink",
          email,
        });

      if (resendError) {
        return { success: false, message: resendError.message };
      }

      return {
        success: true,
        message: "Verification link resent. Check your inbox.",
      };
    }

    // Already confirmed
    return {
      success: false,
      message: "This email is already verified. Please sign in.",
    };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}
