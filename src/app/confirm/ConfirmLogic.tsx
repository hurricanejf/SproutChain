"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function ConfirmLogic() {
  const router = useRouter();
  const params = useSearchParams();
  const [msg, setMsg] = useState("Verifying your email…");

  const code = params.get("code");
  const error = params.get("error");
  const errorCode = params.get("error_code");
  const errorDesc = params.get("error_description");

  useEffect(() => {
    // Handle error from Supabase magic link
    if (error) {
      setMsg(errorDesc || "Invalid or expired link.");
      return;
    }

    // Normal flow
    if (!code) {
      setMsg("Invalid confirmation link.");
      return;
    }

    async function run() {
      const { error: exchangeError } = await supabaseBrowser.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        setMsg(exchangeError.message);
        return;
      }

      setMsg("Success! Redirecting…");
      setTimeout(() => router.replace("/"), 1200);
    }

    run();
  }, [code, error, errorDesc, router]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center text-zinc-300">
      {msg}
    </div>
  );
}
