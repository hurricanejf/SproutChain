"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SPECIES = ["Sproutling", "Bloomkin", "Thornbeast"];

export default function NewCreaturePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("Sproutling");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function check() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) router.push("/login");
    }
    check();
  }, [router]);

  async function createCreature(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // TS FIX — ensure user exists
    if (!user) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("creatures")
      .insert([{ user_id: user.id, name, species }])
      .select()
      .single();

    setLoading(false);

    if (error) {
      alert("Could not create creature");
      return;
    }

    router.push(`/creature/${data.id}`);
  }

  return (
    <div className="space-y-6 text-zinc-300">
      <h1 className="text-3xl font-bold text-green-400">Create a New Creature</h1>

      <form
        onSubmit={createCreature}
        className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6 max-w-xl"
      >
        <div>
          <label className="block mb-1 text-zinc-400">Creature Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-zinc-100 border border-zinc-700"
          />
        </div>

        <div>
          <label className="block mb-1 text-zinc-400">Species</label>
          <select
            value={species}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setSpecies(e.target.value)
            }
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-zinc-100 border border-zinc-700"
          >
            {SPECIES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <button
          disabled={loading}
          className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg w-full font-semibold"
        >
          {loading ? "Creating..." : "Create Creature"}
        </button>
      </form>
    </div>
  );
}
