"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function handleForgot(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { error } = await supabaseBrowser.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg("Password reset link sent.");
  }

  return (
    <div className="max-w-md mx-auto p-6 text-zinc-300">
      <h1 className="text-3xl font-bold mb-6 text-green-400">Reset Password</h1>

      {msg && <p className="text-green-400 mb-4">{msg}</p>}

      <form onSubmit={handleForgot} className="space-y-4">
        <input
          type="email"
          required
          className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded"
          placeholder="Email"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />

        <button className="w-full py-3 bg-green-600 rounded font-semibold">
          Send Reset Link
        </button>
      </form>
    </div>
  );
}
