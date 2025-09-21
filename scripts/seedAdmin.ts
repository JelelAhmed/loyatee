// scripts/seedAdmin.ts
import "dotenv/config"; // 👈 add this line
import { supabaseAdmin } from "@/lib/supabase/admin";

async function seedAdmin() {
  const email = "jelel.ahmed6@gmail.com";
  const password = "jelel6"; // choose a strong password

  // 1. Create the auth user
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (authError) {
    console.error("❌ Error creating auth user:", authError.message);
    return;
  }

  const userId = authData.user?.id;
  if (!userId) {
    console.error("❌ No user ID returned from Supabase");
    return;
  }

  console.log("✅ Auth user created with ID:", userId);

  // 2. Upsert into your users table
  const { error: upsertError } = await supabaseAdmin.from("users").upsert(
    {
      id: userId,
      email,
      role: "admin",
      is_banned: false,
      wallet_balance: 0,
    },
    { onConflict: "id" }
  );

  if (upsertError) {
    console.error("❌ Error upserting into users table:", upsertError.message);
    return;
  }

  console.log("✅ User table updated with admin role");
}

seedAdmin().then(() => process.exit(0));
