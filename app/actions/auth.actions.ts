import { createSupabaseServerClient } from "./utils";
import { redirect } from "next/navigation";

// — SIGN UP —
export async function signUp(
  _prevState: { success: boolean; error: string },
  formData: FormData
) {
  const supabase = await createSupabaseServerClient();

  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const phone = formData.get("phone") as string;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { phone } },
    });

    if (error) throw new Error(error.message);

    redirect("/verify-email");
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

// — SIGN IN —
export async function signIn(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);

    redirect("/dashboard");
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

// — SIGN OUT —
export async function signOut() {
  const supabase = await createSupabaseServerClient();

  try {
    await supabase.auth.signOut();
    redirect("/signin");
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

// — RESET PASSWORD —
export async function resetPassword(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  try {
    const email = formData.get("email") as string;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password-confirm`,
    });

    if (error) throw new Error(error.message);

    redirect("/reset-password-sent");
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

// — EMAIL SIGN UP (WITH EMAIL VERIFICATION) —
export async function signUpWithEmail(
  _prevState: { success: boolean; error: string },
  formData: FormData
) {
  const supabase = await createSupabaseServerClient();

  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const phone = formData.get("phone") as string;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { phone } },
    });

    if (error) throw new Error(error.message);

    redirect("/verify-email");
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

// — PHONE SIGN UP (OTP BASED) —
export async function signUpWithPhone(
  _prevState: { success: boolean; error: string },
  formData: FormData
) {
  const supabase = await createSupabaseServerClient();

  try {
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signUp({
      phone,
      password,
    });

    if (error) throw new Error(error.message);

    redirect("/verify-otp"); // User will enter OTP to complete verification
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

// — VERIFY OTP —
export async function verifyPhoneOtp(
  _prevState: { success: boolean; error: string },
  formData: FormData
) {
  const supabase = await createSupabaseServerClient();

  try {
    const phone = formData.get("phone") as string;
    const token = formData.get("otp") as string;

    const { error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: "sms",
    });

    if (error) throw new Error(error.message);

    redirect("/dashboard");
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
