import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import LayoutShell from "../components/LayoutShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "SproutChain",
  description: "Grow your digital creature by uploading plant photos.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} bg-zinc-950 text-zinc-200 antialiased`}
      >
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
