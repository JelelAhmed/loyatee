import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET() {
  try {
    const now = new Date().toISOString();

    // First get current ping_count
    const { data, error: fetchError } = await supabaseAdmin
      .from("_healthcheck")
      .select("ping_count")
      .eq("id", 1)
      .single();

    if (fetchError) throw fetchError;

    const newCount = (data?.ping_count || 0) + 1;

    // Update timestamp + increment counter
    const { error: updateError } = await supabaseAdmin
      .from("_healthcheck")
      .update({
        last_ping: now,
        ping_count: newCount,
      })
      .eq("id", 1);

    if (updateError) throw updateError;

    console.log("Keep-alive success ✅", {
      time: now,
      ping_count: newCount,
    });

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Keep-alive failed ❌", err);
    return new Response("Error", { status: 500 });
  }
}
