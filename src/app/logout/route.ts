import { createServerSupabase } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export async function GET() {
  const supabase = createServerSupabase();
  await supabase.auth.signOut();
  redirect("/");
}
