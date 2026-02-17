import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET() {
  console.log("Keep-alive cron triggered at:", new Date().toISOString());

  const { error } = await supabaseAdmin
    .from("_healthcheck")
    .select("id")
    .limit(1);

  if (error) {
    console.error("Keep-alive failed:", error);
    return new Response("Error", { status: 500 });
  }

  console.log("Keep-alive success ✅");

  return new Response("OK", { status: 200 });
}
