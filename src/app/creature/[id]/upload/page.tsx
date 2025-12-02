"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

type PageProps = {
  params: {
    id: string;
  };
};

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CreatureUploadPage({ params }: PageProps) {
  const creatureId = params.id;
  const router = useRouter();

  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function check() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return router.push("/login");

      const { data: creature } = await supabase
        .from("creatures")
        .select("user_id")
        .eq("id", creatureId)
        .single();

      if (!creature || creature.user_id !== user.id) {
        return router.push("/login");
      }
    }

    check();
  }, [creatureId, router]);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");
    setUploading(true);

    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("photo") as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (!file) {
      setErrorMsg("Please choose a file.");
      setUploading(false);
      return;
    }

    const filename = `${creatureId}-${Date.now()}-${file.name}`;

    const { error: storageError } = await supabase.storage
      .from("plant-uploads")
      .upload(filename, file);

    if (storageError) {
      setErrorMsg("Upload failed.");
      setUploading(false);
      return;
    }

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/plant-uploads/${filename}`;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return router.push("/login");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/process-upload`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          creature_id: creatureId,
          photo_url: publicUrl,
        }),
      }
    );

    const out = await res.json();

    if (!res.ok) {
      setErrorMsg(out.error || "Something went wrong.");
      setUploading(false);
      return;
    }

    router.push(`/creature/${creatureId}`);
  }

  return (
    <div className="space-y-6 text-zinc-300">
      <h1 className="text-3xl font-bold text-green-400">Add Growth Photo</h1>

      {errorMsg && (
        <p className="text-red-400 font-medium bg-red-950/40 border border-red-800 px-3 py-2 rounded-lg">
          {errorMsg}
        </p>
      )}

      <form
        onSubmit={handleUpload}
        className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-6 max-w-xl"
      >
        <input
          type="file"
          name="photo"
          accept="image/*"
          required
          className="block w-full text-zinc-300 file:bg-zinc-700 file:text-white file:border-none file:px-4 file:py-2 file:rounded-lg"
        />

        <button
          disabled={uploading}
          className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg w-full font-semibold disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload Photo"}
        </button>
      </form>
    </div>
  );
}
