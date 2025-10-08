// // app/actions/transaction.actions.ts
"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// export async function reportTransactionIssue(
//   transactionId: string,
//   issueType: string,
//   note?: string
// ) {
//   const supabase = await createSupabaseServerClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     return { success: false, message: "Unauthorized" };
//   }

//   const { error, data: updated } = await supabase
//     .from("transactions")
//     .update({
//       status: "disputed",
//       error_message: `[USER_COMPLAINT] ${issueType}${note ? ` - ${note}` : ""}`,
//       updated_at: new Date().toISOString(),
//     })
//     .eq("id", transactionId)
//     .eq("user_id", user.id) // enforce ownership
//     .select("id")
//     .single();

//   if (error) {
//     console.error("[reportTransactionIssue] error:", error);
//     return { success: false, message: "Could not file complaint" };
//   }

//   if (!updated) {
//     return { success: false, message: "Transaction not found or not yours" };
//   }

//   return { success: true, message: "Complaint submitted successfully" };
// }

// export async function reportTransactionIssue(
//   transactionId: string,
//   issueType: string,
//   note?: string
// ) {
//   const supabase = await createSupabaseServerClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     return { success: false, message: "Unauthorized" };
//   }

//   // 🔎 Step 1: Confirm ownership & fetch
//   const { data: tx, error: fetchError } = await supabase
//     .from("transactions")
//     .select("id, user_id, type, status")
//     .eq("id", transactionId)
//     .eq("user_id", user.id)
//     .single();

//   if (fetchError || !tx) {
//     return { success: false, message: "Transaction not found or not yours" };
//   }

//   // 🧩 Step 2: Restrict dispute to successful/completed transactions
//   if (!["completed", "success"].includes(tx.status)) {
//     return {
//       success: false,
//       message: "Only successful transactions can be disputed",
//     };
//   }

//   // 📝 Step 3: Record the dispute cleanly

//   const {
//     data: debugData,
//     error: debugError,
//     status: debugStatus,
//   } = await supabase
//     .from("transactions")
//     .update({
//       status: "disputed",
//       dispute_type: issueType,
//       dispute_note: note || null,
//       error_message: `[USER_COMPLAINT] ${issueType}${note ? ` - ${note}` : ""}`,
//       updated_at: new Date().toISOString(),
//     })
//     .eq("id", transactionId)
//     .eq("user_id", user.id)
//     .select("id, status, dispute_type, dispute_note");

//   console.log("[reportTransactionIssue] debug:", {
//     debugData,
//     debugError,
//     debugStatus,
//   });
//   // const { error: updateError } = await supabase
//   //   .from("transactions")
//   //   .update({
//   //     status: "disputed",
//   //     dispute_type: issueType,
//   //     dispute_note: note || null,
//   //     error_message: `[USER_COMPLAINT] ${issueType}${note ? ` - ${note}` : ""}`,
//   //     updated_at: new Date().toISOString(),
//   //   })
//   //   .eq("id", transactionId)
//   //   .eq("user_id", user.id);

//   // if (updateError) {
//   //   console.error("[reportTransactionIssue] update error:", updateError);
//   //   return { success: false, message: "Could not file complaint" };
//   // }

//   return { success: true, message: "Complaint submitted successfully" };
// }

export async function reportTransactionIssue(
  transactionId: string,
  issueType: string,
  note?: string
) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Unauthorized" };
  }

  // Verify that transaction exists and belongs to this user
  const { data: tx, error: fetchError } = await supabase
    .from("transactions")
    .select("id, user_id, status")
    .eq("id", transactionId)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !tx) {
    console.error(
      "[reportTransactionIssue] not found or not owned:",
      fetchError
    );
    return { success: false, message: "Transaction not found or not yours" };
  }

  // Update dispute columns directly
  const { error: updateError } = await supabase
    .from("transactions")
    .update({
      status: "disputed",
      dispute_type: issueType,
      dispute_note: note || null,
      error_message: `[USER_COMPLAINT] ${issueType}${note ? ` - ${note}` : ""}`,
      updated_at: new Date().toISOString(),
    })
    .eq("id", transactionId);

  if (updateError) {
    console.error("[reportTransactionIssue] update error:", updateError);
    return { success: false, message: "Could not file complaint" };
  }

  // Confirm that the update actually persisted
  const { data: verify } = await supabase
    .from("transactions")
    .select("status, dispute_type, dispute_note")
    .eq("id", transactionId)
    .single();

  console.log("[reportTransactionIssue] verification:", verify);

  return { success: true, message: "Complaint submitted successfully" };
}
