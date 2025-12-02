"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSignup(e) {
    e.preventDefault();

    const { error } = await supabaseBrowser.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/confirm`,
      },
    });

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg("Check your email to verify your account.");
  }

  return (
    <div className="max-w-md mx-auto p-6 text-zinc-300">
      <h1 className="text-3xl font-bold mb-6 text-green-400">Create Account</h1>

      {/* ✅ if message exists, show success */}
      {msg && (
        <div className="space-y-4 text-center">
          <p className="text-green-400">{msg}</p>

          <a
            href="/login"
            className="inline-block mt-4 px-5 py-3 bg-green-600 rounded-lg font-semibold hover:bg-green-500"
          >
            Go to Login
          </a>
        </div>
      )}

      {/* ❌ only show form if no message */}
      {!msg && (
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            required
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            required
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="w-full py-3 bg-green-600 rounded font-semibold hover:bg-green-500"
          >
            Create Account
          </button>
        </form>
      )}
    </div>
  );
}
