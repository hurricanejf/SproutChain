import Image from "next/image";
import Link from "next/link";
import { createServerSupabase } from "@/lib/server";

// Evolution art map with typed numeric keys
const EVOLUTION_ART: Record<number, string> = {
  1: "/creatures/stage1.png",
  2: "/creatures/stage2.png",
  3: "/creatures/stage3.png",
};

// Type the creatures table rows
type Creature = {
  id: number;
  name: string;
  species: string;
  stage: number;
  xp: number;
  total_uploads: number;
  created_at: string;
  user_id: string;
  [key: string]: any; // allows extra fields safely
};

export default async function GardenPage() {
  const supabase = createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null; // middleware should redirect

  const { data: creatures } = await supabase
    .from("creatures")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  // Cast to typed array (safe because we know the table schema)
  const typedCreatures = creatures as Creature[] | null;

  return (
    <div className="space-y-8 text-zinc-300">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-green-400">Your Garden</h1>

        <Link
          href="/creature/new"
          className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg"
        >
          + New Creature
        </Link>
      </div>

      {!typedCreatures?.length && (
        <p className="text-zinc-500">You have no creatures yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {typedCreatures?.map((c) => (
          <Link
            key={c.id}
            href={`/creature/${c.id}`}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-green-500 transition"
          >
            <div className="flex items-center justify-center mb-3">
              <Image
                src={EVOLUTION_ART[c.stage]}
                width={150}
                height={150}
                alt="Creature"
              />
            </div>

            <h2 className="text-xl font-semibold text-zinc-100">{c.name}</h2>
            <p className="text-zinc-500 text-sm">{c.species}</p>

            <div className="mt-4 text-sm text-zinc-400">
              Stage {c.stage} • {c.xp} XP • {c.total_uploads} uploads
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
