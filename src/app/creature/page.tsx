"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { supabase } from "../../lib/supabase";

// Evolution image map with typed numeric keys
const EVOLUTION: Record<number, string> = {
  1: "/creatures/stage1.png",
  2: "/creatures/stage2.png",
  3: "/creatures/stage3.png",
};

// Type for creature progress entries coming from DB
type ProgressEntry = {
  id: number;
  stage: number;              // important typing fix
  photo_url: string;
  created_at: string;
  [key: string]: any;         // allows additional columns without errors
};

export default function CreaturePage() {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [selected, setSelected] = useState<ProgressEntry | null>(null);
  const topRef = useRef<HTMLDivElement | null>(null);

  // Load creature progress
  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("creature_progress")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setEntries(data as ProgressEntry[]);
        setSelected(data[0] as ProgressEntry); // start with latest
      }
    }
    load();
  }, []);

  // Scroll to top when selecting a history card
  useEffect(() => {
    if (selected && topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selected]);

  if (entries.length === 0) {
    return (
      <div className="space-y-10">
        <h1 className="text-3xl font-bold text-green-400">Your Creature</h1>
        <p className="text-zinc-400">No growth yet. Upload to begin!</p>
      </div>
    );
  }

  return (
    <div className="space-y-14">
      {/* Anchor for scroll */}
      <div ref={topRef}></div>

      <h1 className="text-3xl font-bold text-green-400">Your Creature</h1>

      {selected && (
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-xl space-y-10">
          <p className="text-lg tracking-wide">
            <span className="text-green-400 font-semibold">Stage:</span>{" "}
            {selected.stage}
          </p>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
            {/* Evolution Art */}
            <div className="relative">
              <div className="absolute -inset-3 rounded-2xl bg-green-500/25 blur-xl animate-pulse"></div>

              <Image
                src={EVOLUTION[selected.stage]}
                width={350}
                height={350}
                alt="Creature Evolution"
                className="relative z-10 drop-shadow-2xl"
              />
            </div>

            {/* Selected uploaded photo */}
            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl shadow-lg">
              <p className="text-zinc-300 mb-3 font-medium">Growth Photo</p>

              <Image
                src={selected.photo_url}
                width={300}
                height={300}
                alt="Selected Growth"
                className="rounded-xl border border-zinc-700 shadow-md"
              />

              <p className="text-zinc-500 text-xs mt-3">
                Updated {new Date(selected.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* History Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-green-300">Growth History</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {entries.map((entry) => (
            <button
              key={entry.id}
              onClick={() => setSelected(entry)}
              className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 hover:border-green-500 transition shadow text-left"
            >
              <Image
                src={entry.photo_url}
                width={200}
                height={200}
                alt="Growth photo"
                className="rounded-lg border border-zinc-700"
              />

              <p className="text-zinc-500 text-xs mt-2">
                {new Date(entry.created_at).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
