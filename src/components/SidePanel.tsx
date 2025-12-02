"use client";

import Link from "next/link";
import clsx from "clsx";
import { supabase } from "@/lib/supabase";

export default function SidePanel({
  open,
  onClose,
  session
}: {
  open: boolean;
  onClose: () => void;
  session: any;
}) {
  const nav = session
    ? [
        { name: "Home", href: "/" },
        { name: "Garden", href: "/garden" },
        { name: "Creature", href: "/creature" },
        { name: "History", href: "/history" }
      ]
    : [
        { name: "Home", href: "/" },
        { name: "Login", href: "/login" },
        { name: "Signup", href: "/signup" }
      ];

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 w-64 bg-zinc-900 border-r border-zinc-800 p-6 z-50 lg:hidden transform transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          className="mb-6 text-zinc-400 hover:text-white"
          onClick={onClose}
        >
          ✕ Close
        </button>

        <nav className="space-y-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="block text-zinc-300 hover:text-green-400"
            >
              {item.name}
            </Link>
          ))}

          {session && (
            <button
              onClick={logout}
              className="mt-6 text-red-400 hover:text-red-300"
            >
              Log Out
            </button>
          )}
        </nav>
      </aside>
    </>
  );
}
