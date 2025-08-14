"use server";

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

// — SIGN IN WITH EMAIL —
type SignInState = {
  success: boolean;
  error: string | null;
};

export async function signInWithEmail(
  _prevState: SignInState,
  formData: FormData
): Promise<SignInState> {
  const supabase = await createSupabaseServerClient();

  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);

    return { success: true, error: null };
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
type SignUpState = {
  success: boolean;
  error: string | null;
};

export async function signUpWithEmail(
  prevState: SignUpState,
  formData: FormData
): Promise<SignUpState> {
  const supabase = await createSupabaseServerClient();

  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const phone = formData.get("phone") as string;
    const username = formData.get("username") as string; // new

    if (!email || !password || !phone || !username) {
      return { success: false, error: "All fields are required" };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          phone,
          display_name: username, // 👈 sets auth.users.display_name
        },
      },
    });

    if (error) throw new Error(error.message);

    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// — PHONE SIGN UP (OTP BASED) —
export async function signUpWithPhone(
  _prevState: SignUpState,
  formData: FormData
) {
  const supabase = await createSupabaseServerClient();
  let phone = formData.get("phone") as string;

  try {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    // Remove all non-digit characters
    phone = phone.replace(/\D/g, "");

    // If starts with '1' and length is 11 => US number (E.164: +1XXXXXXXXXX)
    if (phone.startsWith("1") && phone.length === 11) {
      phone = `+${phone}`;
    }
    // If starts with '234' => already Nigerian format
    else if (phone.startsWith("234") && phone.length === 13) {
      phone = `+${phone}`;
    }
    // If starts with '0' => Nigerian local format (convert to +234)
    else if (phone.startsWith("0")) {
      phone = `+234${phone.slice(1)}`;
    }
    // Fallback: Assume already full international without +
    else {
      phone = `+${phone}`;
    }

    console.log(phone, "full phone number");

    const { error } = await supabase.auth.signUp({
      phone,
      password,
      options: {
        channel: "sms",
        data: { display_name: username },
      },
    });

    if (error) throw new Error(error.message);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }

  redirect(`/verify-otp?phone=${encodeURIComponent(phone)}`);
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

    return { success: true, error: "" };
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
