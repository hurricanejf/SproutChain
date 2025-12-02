"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function ConfirmLogic() {
  const params = useSearchParams();
  const router = useRouter();

  const [msg, setMsg] = useState("Verifying...");

  useEffect(() => {
    // Get the code from the URL on the client
    const codeParam = params.get("code");

    if (!codeParam) {
      setMsg("Invalid confirmation link.");
      return;
    }

    async function run() {
      // codeParam is guaranteed to be a string here
      const { error } = await supabaseBrowser.auth.exchangeCodeForSession(
        codeParam
      );

      if (error) {
        setMsg(error.message);
        return;
      }

      // Success – redirect home
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
