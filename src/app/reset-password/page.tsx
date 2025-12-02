"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { error } = await supabaseBrowser.auth.updateUser({ password });

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg("Password updated.");
    setTimeout(() => router.push("/login"), 1500);
  }

  return (
    <div className="max-w-md mx-auto p-6 text-zinc-300">
      <h1 className="text-3xl font-bold mb-6 text-green-400">Choose New Password</h1>

      {msg && <p className="mb-4 text-green-400">{msg}</p>}

      <form onSubmit={handleReset} className="space-y-4">
        <input
          type="password"
          minLength={6}
          required
          className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded"
          placeholder="New Password"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />

        <button className="w-full py-3 bg-green-600 rounded font-semibold">
          Update Password
        </button>
      </form>
    </div>
  );
}
