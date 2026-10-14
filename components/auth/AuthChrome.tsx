import type { ReactNode } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

export function AuthChrome({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-navy-gradient p-12 text-navy-foreground lg:flex">
        <div className="absolute inset-0 grid-lines" />
        <Link href="/" className="relative flex items-center gap-2 font-semibold">
          <span className="grid h-7 w-7 place-items-center rounded-sm bg-primary font-mono text-xs text-primary-foreground">
            T
          </span>
          Technograph
        </Link>
        <div className="relative">
          <p className="eyebrow text-teal">Employee portal</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight">
            Your engagement,
            <br />
            hours, and pay —
            <br />
            in one place.
          </h2>
          <ul className="mt-8 space-y-3 text-navy-muted">
            {[
              "Log time against your engagement",
              "Track pay and tax documents",
              "Line up what's next, matched to you",
            ].map((b) => (
              <li key={b} className="flex items-center gap-3">
                <Check className="h-4 w-4 text-teal" />
                {b}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative font-mono text-xs tracking-widest text-navy-muted">
          © 2026 TECHNOGRAPH · SOC 2 · SSO READY
        </p>
      </aside>
      <main className="flex items-center justify-center bg-background px-6 py-16">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}

export function AuthHead({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: ReactNode;
}) {
  return (
    <div className="mb-8">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-semibold text-navy">{title}</h1>
      {sub && <p className="mt-2 text-sm text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function strength(pw: string): "EMPTY" | "WEAK" | "FAIR" | "GOOD" | "STRONG" {
  if (!pw) return "EMPTY";
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s++;
  return (["WEAK", "WEAK", "FAIR", "GOOD", "STRONG"] as const)[s] ?? "WEAK";
}

export function StrengthMeter({ pw }: { pw: string }) {
  const l = strength(pw);
  const n = { EMPTY: 0, WEAK: 1, FAIR: 2, GOOD: 3, STRONG: 4 }[l];
  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full ${
              i <= n
                ? n <= 1
                  ? "bg-destructive"
                  : n === 2
                    ? "bg-warning"
                    : "bg-success"
                : "bg-border"
            }`}
          />
        ))}
      </div>
      <p className="mt-1 font-mono text-[0.65rem] tracking-widest text-muted-foreground">
        STRENGTH · {l}
      </p>
    </div>
  );
}
