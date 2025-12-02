"use client";

import { Suspense } from "react";
import ConfirmLogic from "./ConfirmLogic";

export default function ConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[75vh] flex items-center justify-center text-zinc-300">
          Verifying your email…
        </div>
      }
    >
      <ConfirmLogic />
    </Suspense>
  );
}
