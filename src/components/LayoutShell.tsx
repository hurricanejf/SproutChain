"use client";

import { useState, useEffect } from "react";
import Header from "./Header";
import SidePanel from "./SidePanel";
import Footer from "./Footer";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const [sideOpen, setSideOpen] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Get current session
    supabaseBrowser.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // Listen for sign in / out
    const {
      data: { subscription },
    } = supabaseBrowser.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <Header onToggleSide={() => setSideOpen(true)} session={session} />

      <SidePanel
        open={sideOpen}
        onClose={() => setSideOpen(false)}
        session={session}
      />

      <main className="px-6 py-8 max-w-4xl mx-auto">{children}</main>

      <Footer />
    </>
  );
}
