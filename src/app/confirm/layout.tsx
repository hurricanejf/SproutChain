export default function ConfirmLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-200">
        {children}
      </body>
    </html>
  );
}
