"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function ConfirmLogic() {
  const params = useSearchParams();
  const router = useRouter();

  const [msg, setMsg] = useState("Verifying...");

  useEffect(() => {
    async function run() {
      // Extract INSIDE async function so TS narrows properly
      const raw = params.get("code");

      if (!raw) {
        setMsg("Invalid confirmation link.");
        return;
      }

      // TS knows raw is string here
      const code: string = raw;

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
