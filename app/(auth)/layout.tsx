// Auth route group — no marketing chrome (Nav/Footer). The screens render
// full-bleed so the brand panel can reach every edge of the viewport.
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
