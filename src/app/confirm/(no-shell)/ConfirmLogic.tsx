"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function ConfirmLogic() {
  const params = useSearchParams();
  const router = useRouter();

  const [msg, setMsg] = useState("Verifying…");

  useEffect(() => {
    const code = params.get("code");

    if (!code) {
      setMsg("Invalid confirmation link.");
      return;
    }

    async function process() {
      const { error } = await supabaseBrowser.auth.exchangeCodeForSession(code);

      if (error) {
        setMsg(error.message);
        return;
      }

      router.replace("/");
    }

    process();
  }, [params, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center text-zinc-300">
      {msg}
    </div>
  );
}
