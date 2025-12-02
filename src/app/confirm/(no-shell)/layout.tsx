export default function NoShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;  // no LayoutShell, no Header, no Footer
}
