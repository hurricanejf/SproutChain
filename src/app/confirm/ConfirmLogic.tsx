"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function ConfirmLogic() {
  const router = useRouter();
  const params = useSearchParams();
  const code = params.get("code");

  useEffect(() => {
    async function run() {
      if (!code) return;

      await supabaseBrowser.auth.exchangeCodeForSession(code);

      router.replace("/");
    }

    run();
  }, [code, router]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center text-zinc-300">
      Verifying your email…
    </div>
  );
}
