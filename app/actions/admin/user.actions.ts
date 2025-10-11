// "use server";

// import { supabaseAdmin } from "@/lib/supabase/admin";

// type ActionResult<T = any> =
//   | { success: true; message: string; data?: T }
//   | { success: false; message: string };

// export async function toggleUserBan(
//   userId: string,
//   isBanned: boolean
// ): Promise<ActionResult> {
//   const supabase = supabaseAdmin; // Assumes service role client

//   try {
//     const newBanState = !isBanned;
//     const banDuration = newBanState ? "876600h" : "none"; // 100 years or unban

//     // 1️⃣ Update Auth (sets banned_until internally)
//     const { data: authData, error: authError } =
//       await supabase.auth.admin.updateUserById(userId, {
//         ban_duration: banDuration,
//       });
//     if (authError) return { success: false, message: authError.message };

//     // 2️⃣ Revoke sessions for immediate effect (optional but recommended)
//     if (newBanState) {
//       const { error: signOutError } = await supabase.auth.admin.signOut(userId);
//       if (signOutError) {
//         console.error(
//           `Ban succeeded but signOut failed for ${userId}:`,
//           signOutError
//         );
//         // Don't fail the whole op—ban is still set
//       }
//     }

//     // 3️⃣ Update users table
//     const { error: tableError } = await supabase
//       .from("users")
//       .update({ is_banned: newBanState })
//       .eq("id", userId);

//     if (tableError) {
//       console.error(
//         `Auth ban succeeded but users table update failed for ${userId}`,
//         tableError
//       );
//       return {
//         success: false,
//         message: `User ban updated in auth, but failed to update users table: ${tableError.message}`,
//       };
//     }

//     return {
//       success: true,
//       message: `User ${newBanState ? "banned" : "unbanned"} successfully`,
//       data: { userId, is_banned: newBanState, authData },
//     };
//   } catch (err) {
//     console.error("Failed to toggle user ban:", err);
//     return { success: false, message: "Unexpected server error" };
//   }
// }

// // 🔹 Change user role (admin-only)
// export async function changeUserRole(
//   userId: string,
//   newRole: string
// ): Promise<ActionResult<any>> {
//   const supabase = supabaseAdmin; // Service role for admin ops

//   try {
//     // Auth check: Ensure caller is admin (fetch current user via session or pass as param if needed)
//     // Note: Since this is server action, use createServerActionClient if integrating with Next.js auth
//     // For simplicity, assuming RLS handles it; add explicit check if needed
//     if (!["user", "admin"].includes(newRole)) {
//       return { success: false, message: "Invalid role" };
//     }

//     // Update users table
//     const { data: updatedUser, error } = await supabase
//       .from("users")
//       .update({ role: newRole })
//       .eq("id", userId)
//       .select()
//       .single();

//     if (error) {
//       console.error("Role update failed:", error);
//       return { success: false, message: error.message };
//     }

//     // Optional: Update app_metadata in auth for consistency (if role there too)
//     // await supabase.auth.admin.updateUserById(userId, { app_metadata: { role: newRole } });

//     return {
//       success: true,
//       message: "Role updated successfully",
//       data: updatedUser,
//     };
//   } catch (err: any) {
//     console.error("Failed to change user role:", err);
//     return {
//       success: false,
//       message: err.message || "Unexpected server error",
//     };
//   }
// }

// // 🔹 Delete user (admin-only)
// export async function deleteUser(userId: string): Promise<ActionResult> {
//   const supabase = supabaseAdmin; // Service role for admin ops

//   try {
//     // Delete from users table
//     const { error: tableError } = await supabase
//       .from("users")
//       .delete()
//       .eq("id", userId);

//     if (tableError) {
//       console.error("Users table delete failed:", tableError);
//       return { success: false, message: tableError.message };
//     }

//     // Revoke auth user (deletes from auth.users)
//     const { error: authError } = await supabase.auth.admin.deleteUser(userId);
//     if (authError) {
//       console.error("Auth delete failed (but table deleted):", authError);
//       // Don't fail—partial success; user can't log in anymore
//       return {
//         success: true,
//         message: "User deleted from app (auth cleanup failed)",
//       };
//     }

//     return { success: true, message: "User deleted successfully" };
//   } catch (err: any) {
//     console.error("Failed to delete user:", err);
//     return {
//       success: false,
//       message: err.message || "Unexpected server error",
//     };
//   }
// }
"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Logs admin activity to the `admin_activity_logs` table
 */
async function logAdminAction(
  adminId: string,
  action: string,
  targetTable: string | null,
  targetId: string | null,
  details: Record<string, any> = {}
) {
  const { error } = await supabaseAdmin.from("admin_activity_logs").insert([
    {
      admin_id: adminId,
      action,
      target_table: targetTable,
      target_id: targetId,
      details,
    },
  ]);

  if (error) console.error("Failed to log admin action:", error);
}

/**
 * Auto-detect current admin from cookies/session
 */
async function getCurrentAdminId() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("Unauthorized admin action");
  return data.user.id;
}

/**
 * Toggle ban/unban for a user
 */
export async function toggleUserBan(userId: string, isBanned: boolean) {
  const supabase = supabaseAdmin;

  try {
    const adminId = await getCurrentAdminId();
    const newBanState = !isBanned;

    // Permanent ban = 100 years in future
    const bannedUntil = newBanState
      ? new Date(
          new Date().setFullYear(new Date().getFullYear() + 100)
        ).toISOString()
      : null;

    // 1️⃣ Update auth metadata
    const { data: authData, error: authError } =
      await supabase.auth.admin.updateUserById(userId, {
        app_metadata: { banned_until: bannedUntil },
      });

    if (authError) return { success: false, message: authError.message };

    // 2️⃣ Revoke sessions (if banning)
    if (newBanState) {
      try {
        // Revokes all refresh tokens — effectively signing out everywhere
        const { error: revokeError } = await supabase.auth.admin.signOut(
          userId
        );
        if (revokeError) console.warn("Sign-out failed:", revokeError);
      } catch (e) {
        console.warn("Sign-out not supported in current SDK version");
      }
    }

    // 3️⃣ Update user table
    const { error: tableError } = await supabase
      .from("users")
      .update({ is_banned: newBanState })
      .eq("id", userId);

    if (tableError) {
      console.error("Users table update failed:", tableError);
      return {
        success: false,
        message: `Ban updated in auth, but failed to update users table: ${tableError.message}`,
      };
    }

    // 4️⃣ Log admin action
    await logAdminAction(adminId, "TOGGLE_BAN", "users", userId, {
      new_state: newBanState ? "Suspended" : "Suspended",
    });

    return {
      success: true,
      message: `User ${newBanState ? "banned" : "unbanned"} successfully`,
      data: { userId, is_banned: newBanState, authData },
    };
  } catch (err) {
    console.error("Failed to toggle user ban:", err);
    return { success: false, message: "Unauthorized or unexpected error" };
  }
}

/**
 * Change user role
 */
export async function changeUserRole(userId: string, newRole: string) {
  const supabase = supabaseAdmin;

  try {
    const adminId = await getCurrentAdminId();

    if (!["user", "admin"].includes(newRole)) {
      return { success: false, message: "Invalid role" };
    }

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

    await logAdminAction(adminId, "CHANGE_ROLE", "users", userId, {
      new_role: newRole,
    });

    return {
      success: true,
      message: "Role updated successfully",
      data: updatedUser,
    };
  } catch (err: any) {
    console.error("Failed to change user role:", err);
    return { success: false, message: err.message || "Unexpected error" };
  }
}

/**
 * Delete user
 */
export async function deleteUser(userId: string) {
  const supabase = supabaseAdmin;

  try {
    const adminId = await getCurrentAdminId();

    // 1️⃣ Fetch user details BEFORE deletion
    const { data: targetUser, error: fetchError } = await supabase
      .from("users")
      .select("email, phone, role")
      .eq("id", userId)
      .maybeSingle();

    if (fetchError) {
      console.warn("Could not fetch user before delete:", fetchError);
    }

    // 2️⃣ Delete from users table
    const { error: tableError } = await supabase
      .from("users")
      .delete()
      .eq("id", userId);

    if (tableError) {
      console.error("Users table delete failed:", tableError);
      return { success: false, message: tableError.message };
    }

    // 3️⃣ Delete from auth
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    // 4️⃣ Log result
    await logAdminAction(adminId, "DELETE_USER", "users", userId, {
      target_user_email: targetUser?.email ?? "unknown",
      target_user_phone: targetUser?.phone ?? "unknown",
      target_user_role: targetUser?.role ?? "unknown",
      auth_deleted: !authError,
    });

    if (authError) {
      console.warn("Auth deletion failed (table record removed):", authError);
      return {
        success: true,
        message: "User deleted from app (auth cleanup failed)",
      };
    }

    return { success: true, message: "User deleted successfully" };
  } catch (err: any) {
    console.error("Failed to delete user:", err);
    return { success: false, message: "Unexpected error" };
  }
}
