"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function ConfirmLogic() {
  const params = useSearchParams();
  const router = useRouter();

  const [msg, setMsg] = useState("Verifying...");

  useEffect(() => {
    const rawCode = params.get("code");

    // If no code is present, mark invalid
    if (!rawCode) {
      setMsg("Invalid confirmation link.");
      return;
    }

    async function run() {
      // Create a new variable that TS KNOWS is a string
      const code: string = rawCode;

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
