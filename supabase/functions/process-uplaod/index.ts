// SproutChain Evolution Logic
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!  // secure internal key
  );

  const { creature_id, photo_url } = await req.json();

  // Fetch creature
  const { data: creature } = await supabase
    .from("creatures")
    .select("*")
    .eq("id", creature_id)
    .single();

  if (!creature) {
    return new Response("Creature not found", { status: 404 });
  }

  const today = new Date().toDateString();
  const lastUpload = creature.last_upload_at
    ? new Date(creature.last_upload_at).toDateString()
    : null;

  // Prevent multiple same-day uploads
  if (lastUpload === today) {
    return new Response(
      JSON.stringify({ error: "Already uploaded today" }),
      { status: 400 }
    );
  }

  // Insert upload record
  await supabase.from("creature_uploads").insert([
    { creature_id, photo_url }
  ]);

  // Daily XP reward
  let xp = creature.xp + 10;
  let stage = creature.stage;

  // Evolution thresholds
  if (xp >= 200) stage = 3;
  else if (xp >= 100) stage = 2;
  else if (xp >= 50) stage = 2;

  await supabase
    .from("creatures")
    .update({
      xp,
      stage,
      total_uploads: creature.total_uploads + 1,
      last_upload_at: new Date(),
    })
    .eq("id", creature_id);

  return new Response(
    JSON.stringify({ success: true, xp, stage }),
    { status: 200 }
  );
});
