"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Header({
  onToggleSide,
  session,
}: {
  onToggleSide: () => void;
  session: any;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const nav = session
    ? [
        { name: "Home", href: "/" },
        { name: "Garden", href: "/garden" },
        { name: "Creature", href: "/creature" },
        { name: "History", href: "/history" },
      ]
    : [
        { name: "Home", href: "/" },
        { name: "Login", href: "/login" },
        { name: "Signup", href: "/signup" },
      ];

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-50 bg-zinc-900 border-b border-zinc-800 px-6 py-4 shadow">
      <div className="flex items-center justify-between">
        <Link href="/">
          <span className="font-bold text-xl text-green-400">SproutChain</span>
        </Link>

        {/* MOBILE ONLY */}
        <button
          className="lg:hidden text-zinc-300 hover:text-white text-2xl"
          onClick={onToggleSide}
        >
          ☰
        </button>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center space-x-6">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "text-zinc-300 hover:text-green-400 transition",
                pathname === item.href && "font-semibold text-green-400"
              )}
            >
              {item.name}
            </Link>
          ))}

          {session && (
            <button
              onClick={logout}
              className="ml-4 text-zinc-400 hover:text-red-400"
            >
              Log Out
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
