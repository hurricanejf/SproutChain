import Image from "next/image";
import Link from "next/link";
import { createServerSupabase } from "@/lib/server";

const EVOLUTION_ART = {
  1: "/creatures/stage1.png",
  2: "/creatures/stage2.png",
  3: "/creatures/stage3.png",
};

export default async function CreatureProfilePage({ params }) {
  const supabase = createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const creatureId = params.id;

  const { data: creature } = await supabase
    .from("creatures")
    .select("*")
    .eq("id", creatureId)
    .eq("user_id", user.id)
    .single();

  if (!creature) return <p className="text-zinc-400">Creature not found.</p>;

  const { data: uploads } = await supabase
    .from("creature_uploads")
    .select("*")
    .eq("creature_id", creatureId)
    .order("created_at", { ascending: false });

  const latestUpload = uploads?.[0];

  return (
    <div className="space-y-8 text-zinc-300">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-green-400">
          {creature.name}
        </h1>

        <Link
          href={`/creature/${creatureId}/upload`}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg"
        >
          + Add Growth Photo
        </Link>
      </div>

      {/* Creature Card */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex gap-10">
        <div className="relative">
          <div className="absolute -inset-2 rounded-xl bg-green-500/20 blur-xl"></div>

          <Image
            src={EVOLUTION_ART[creature.stage]}
            width={220}
            height={220}
            alt={`${creature.species} Stage ${creature.stage}`}
            className="relative z-10 drop-shadow-lg"
          />
        </div>

        <div className="flex-1 space-y-4">
          <p className="text-zinc-400">Species: {creature.species}</p>
          <p className="text-zinc-400">Stage: {creature.stage}</p>
          <p className="text-zinc-400">Total Uploads: {creature.total_uploads}</p>

          <div className="mt-4">
            <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: `${Math.min((creature.xp / 100) * 100, 100)}%` }}
              />
            </div>
            <p className="text-sm text-zinc-500 mt-1">{creature.xp} / 100 XP</p>
          </div>
        </div>
      </section>

      {/* Latest */}
      {latestUpload && (
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Latest Growth Photo</h2>

          <Image
            src={latestUpload.photo_url}
            width={400}
            height={400}
            alt="Latest Growth"
            className="rounded-xl border border-zinc-700"
          />

          <p className="text-zinc-500 text-sm mt-2">
            Uploaded {new Date(latestUpload.created_at).toLocaleString()}
          </p>
        </section>
      )}

      {/* History */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Upload History</h2>

        {uploads?.length === 0 && (
          <p className="text-zinc-600">No uploads yet.</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {uploads?.map((u) => (
            <div key={u.id} className="bg-zinc-900 border border-zinc-800 p-2 rounded-lg">
              <Image
                src={u.photo_url}
                width={200}
                height={200}
                alt="Upload"
                className="rounded-lg"
              />
              <p className="text-xs text-zinc-500 mt-1">
                {new Date(u.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
