import Image from "next/image";
import { createServerSupabase } from "@/lib/server";

export default async function HistoryPage() {
  const supabase = createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("creature_progress")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-green-400">Growth History</h1>

      {!data?.length && (
        <p className="text-zinc-400">
          No uploads yet. Start by uploading growth photos.
        </p>
      )}

      <div className="space-y-10">
        {data?.map((item, index) => (
          <div
            key={item.id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg space-y-4"
          >
            <p className="text-green-400 font-semibold">
              Stage {item.stage} — Entry {index + 1}
            </p>

            <Image
              src={item.photo_url}
              alt="Growth"
              width={500}
              height={500}
              className="rounded-xl border border-zinc-700"
            />

            <p className="text-zinc-500 text-sm">
              Uploaded {new Date(item.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
