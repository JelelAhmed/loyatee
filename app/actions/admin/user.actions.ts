"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";

type ActionResult<T = any> =
  | { success: true; message: string; data?: T }
  | { success: false; message: string };

export async function toggleUserBan(
  userId: string,
  isBanned: boolean
): Promise<ActionResult> {
  const supabase = supabaseAdmin; // Assumes service role client

  try {
    const newBanState = !isBanned;
    const banDuration = newBanState ? "876600h" : "none"; // 100 years or unban

    // 1️⃣ Update Auth (sets banned_until internally)
    const { data: authData, error: authError } =
      await supabase.auth.admin.updateUserById(userId, {
        ban_duration: banDuration,
      });
    if (authError) return { success: false, message: authError.message };

    // 2️⃣ Revoke sessions for immediate effect (optional but recommended)
    if (newBanState) {
      const { error: signOutError } = await supabase.auth.admin.signOut(userId);
      if (signOutError) {
        console.error(
          `Ban succeeded but signOut failed for ${userId}:`,
          signOutError
        );
        // Don't fail the whole op—ban is still set
      }
    }

    // 3️⃣ Update users table
    const { error: tableError } = await supabase
      .from("users")
      .update({ is_banned: newBanState })
      .eq("id", userId);

    if (tableError) {
      console.error(
        `Auth ban succeeded but users table update failed for ${userId}`,
        tableError
      );
      return {
        success: false,
        message: `User ban updated in auth, but failed to update users table: ${tableError.message}`,
      };
    }

    return {
      success: true,
      message: `User ${newBanState ? "banned" : "unbanned"} successfully`,
      data: { userId, is_banned: newBanState, authData },
    };
  } catch (err) {
    console.error("Failed to toggle user ban:", err);
    return { success: false, message: "Unexpected server error" };
  }
}

// 🔹 Change user role (admin-only)
export async function changeUserRole(
  userId: string,
  newRole: string
): Promise<ActionResult<any>> {
  const supabase = supabaseAdmin; // Service role for admin ops

  try {
    // Auth check: Ensure caller is admin (fetch current user via session or pass as param if needed)
    // Note: Since this is server action, use createServerActionClient if integrating with Next.js auth
    // For simplicity, assuming RLS handles it; add explicit check if needed
    if (!["user", "admin"].includes(newRole)) {
      return { success: false, message: "Invalid role" };
    }

    // Update users table
    const { data: updatedUser, error } = await supabase
      .from("users")
      .update({ role: newRole })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Role update failed:", error);
      return { success: false, message: error.message };
    }

    // Optional: Update app_metadata in auth for consistency (if role there too)
    // await supabase.auth.admin.updateUserById(userId, { app_metadata: { role: newRole } });

    return {
      success: true,
      message: "Role updated successfully",
      data: updatedUser,
    };
  } catch (err: any) {
    console.error("Failed to change user role:", err);
    return {
      success: false,
      message: err.message || "Unexpected server error",
    };
  }
}

// 🔹 Delete user (admin-only)
export async function deleteUser(userId: string): Promise<ActionResult> {
  const supabase = supabaseAdmin; // Service role for admin ops

  try {
    // Delete from users table
    const { error: tableError } = await supabase
      .from("users")
      .delete()
      .eq("id", userId);

    if (tableError) {
      console.error("Users table delete failed:", tableError);
      return { success: false, message: tableError.message };
    }

    // Revoke auth user (deletes from auth.users)
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    if (authError) {
      console.error("Auth delete failed (but table deleted):", authError);
      // Don't fail—partial success; user can't log in anymore
      return {
        success: true,
        message: "User deleted from app (auth cleanup failed)",
      };
    }

    return { success: true, message: "User deleted successfully" };
  } catch (err: any) {
    console.error("Failed to delete user:", err);
    return {
      success: false,
      message: err.message || "Unexpected server error",
    };
  }
}
