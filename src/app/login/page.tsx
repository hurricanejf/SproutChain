"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"magic" | "password">("magic");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);

  const [magicSent, setMagicSent] = useState(false);
  const [message, setMessage] = useState("");

  // --------------------------
  // MAGIC LINK LOGIN
  // --------------------------
  async function handleMagicLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabaseBrowser.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/confirm`,
      },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMagicSent(true);
    setMessage("We sent you a login link. Check your email.");
  }

  // --------------------------
  // EMAIL + PASSWORD LOGIN
  // --------------------------
  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabaseBrowser.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/");
  }

  return (
    <div className="max-w-md mx-auto p-6 text-zinc-300">
      <h1 className="text-3xl font-bold mb-6 text-green-400">Sign In</h1>

      {/* MESSAGE BANNER */}
      {message && (
        <div className="mb-4 p-3 text-sm rounded bg-zinc-800 border border-zinc-700 text-green-400">
          {message}
        </div>
      )}

      {/* TOGGLE BUTTONS */}
      <div className="flex mb-6 border-b border-zinc-700">
        <button
          onClick={() => { setMode("magic"); setMessage(""); }}
          className={`flex-1 py-2 text-center ${
            mode === "magic"
              ? "text-green-400 border-b-2 border-green-400 font-semibold"
              : "text-zinc-500"
          }`}
        >
          Magic Link
        </button>

        <button
          onClick={() => { setMode("password"); setMessage(""); }}
          className={`flex-1 py-2 text-center ${
            mode === "password"
              ? "text-green-400 border-b-2 border-green-400 font-semibold"
              : "text-zinc-500"
          }`}
        >
          Email + Password
        </button>
      </div>

      {/* MAGIC LINK FORM */}
      {mode === "magic" && (
        <form onSubmit={handleMagicLogin} className="space-y-4">

          {/* Hide form fields if magic link already sent */}
          {!magicSent && (
            <>
              <input
                type="email"
                required
                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded"
                placeholder="Email"
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button
                disabled={loading}
                className="w-full py-3 bg-green-600 rounded font-semibold disabled:opacity-50"
              >
                {loading ? "Sending…" : "Send Login Link"}
              </button>
            </>
          )}

          {/* After sending link: show resend option */}
          {magicSent && (
            <div className="text-center space-y-4">
              <p className="text-zinc-400 text-sm">
                Didn’t get it?
              </p>

              <button
                type="button"
                disabled={loading}
                onClick={handleMagicLogin}
                className="py-2 px-4 border border-zinc-600 rounded hover:border-green-400 transition disabled:opacity-50"
              >
                {loading ? "Resending…" : "Resend Link"}
              </button>
            </div>
          )}
        </form>
      )}

      {/* PASSWORD LOGIN FORM */}
      {mode === "password" && (
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded"
            disabled={loading}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            required
            placeholder="Password"
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded"
            disabled={loading}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full py-3 bg-green-600 rounded font-semibold disabled:opacity-50"
          >
            {loading ? "Logging in…" : "Log In"}
          </button>

          <p className="text-sm text-zinc-500 text-center">
            <a href="/forgot-password" className="text-green-400 hover:underline">
              Forgot password?
            </a>
          </p>
        </form>
      )}

      {/* SIGNUP LINK */}
      <p className="mt-6 text-sm text-zinc-500 text-center">
        <a className="text-green-400 hover:underline" href="/signup">
          Create account
        </a>
      </p>
    </div>
  );
}
