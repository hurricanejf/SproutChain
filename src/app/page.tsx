import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabaseServer";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { code?: string };
}) {
  const supabase = createServerSupabase();

  // 1. AUTH CALLBACK
  if (searchParams?.code) {
    return redirect(`/confirm?code=${searchParams.code}`);
  }

  // 2. FETCH USER
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // LOGGED OUT VIEW
  if (!user) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center text-zinc-300 px-6">
        <h1 className="text-5xl font-extrabold text-green-400 mb-4">SproutChain</h1>

        <p className="text-lg text-zinc-400 max-w-md text-center mb-10">
          Grow unique digital creatures using your plant photos.
        </p>

        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-6 py-3 bg-green-500 text-black font-bold rounded-lg hover:bg-green-400"
          >
            Sign In
          </Link>

          <Link
            href="/signup"
            className="px-6 py-3 bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold rounded-lg hover:border-green-400"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  // LOGGED IN VIEW
  const { data: creatures = [] } = await supabase
    .from("creatures")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div className="space-y-12 text-zinc-300">
      <section>
        <h1 className="text-4xl font-bold text-green-400">Welcome back</h1>
        <p className="text-zinc-500">{user.email}</p>
      </section>

      <section className="flex gap-4">
        <Link
          href="/garden"
          className="px-5 py-3 bg-green-500 text-black rounded-lg font-semibold hover:bg-green-400"
        >
          View Your Garden
        </Link>

        <Link
          href="/creatures/new"
          className="px-5 py-3 bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-lg hover:border-green-400"
        >
          Create New Creature
        </Link>
      </section>

      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-green-400">Your Creatures</h2>

        {creatures.length === 0 && (
          <p className="text-zinc-500">You don’t have any creatures yet.</p>
        )}

        {creatures.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {creatures.map((c) => (
              <Link
                key={c.id}
                href={`/creature/${c.id}`}
                className="block bg-zinc-800 p-4 rounded-xl border border-zinc-700 hover:border-green-400 transition"
              >
                <h3 className="font-semibold text-green-400">{c.name}</h3>
                <p className="text-zinc-500 text-sm">{c.species}</p>
                <p className="text-zinc-500 text-sm">Stage {c.stage}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
