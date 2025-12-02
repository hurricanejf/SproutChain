"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function ConfirmLogic() {
  const params = useSearchParams();
  const router = useRouter();

  const [msg, setMsg] = useState("Verifying...");

  useEffect(() => {
    // `useSearchParams()` is client-only — safe here.
    const code = params.get("code");

    if (!code) {
      setMsg("Invalid confirmation link.");
      return;
    }

    async function run() {
      const { error } = await supabaseBrowser.auth.exchangeCodeForSession(code);

      if (error) {
        setMsg(error.message);
        return;
      }

      router.replace("/");
    }

    run();
  }, [params, router]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center text-zinc-300">
      {msg}
    </div>
  );
}
