"use client";

import { Suspense } from "react";
import ConfirmLogic from "./ConfirmLogic";

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div className="p-10">Verifying…</div>}>
      <ConfirmLogic />
    </Suspense>
  );
}
