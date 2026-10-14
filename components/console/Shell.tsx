"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { LogOut, Menu, Settings, X, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/session";

export type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: ReactNode;
  exact?: boolean;
};
export type NavGroup = { title: string; items: NavItem[] };

function NavLink({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = item.exact
    ? pathname === item.to
    : pathname === item.to || pathname.startsWith(item.to + "/");
  return (
    <Link
      href={item.to}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        active && "bg-sidebar-accent text-sidebar-accent-foreground",
      )}
    >
      <item.icon className="h-4 w-4" />
      <span className="flex-1">{item.label}</span>
      {item.badge !== undefined && item.badge !== null && (
        <span className="rounded-full bg-sidebar-primary px-1.5 py-0.5 font-mono text-[0.62rem] text-sidebar-primary-foreground">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export function ConsoleShell({
  groups,
  footer,
  accountTo,
  children,
}: {
  groups: NavGroup[];
  footer: { name: string; sub: string };
  accountTo?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function signOut() {
    logout();
    router.push("/login");
  }

  const side = (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2 px-5 font-semibold text-sidebar-accent-foreground">
        <span className="grid h-7 w-7 place-items-center rounded-sm bg-sidebar-primary font-mono text-xs text-sidebar-primary-foreground">
          T
        </span>
        Technograph
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {groups.map((g) => (
          <div key={g.title}>
            <p className="px-3 pb-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-sidebar-foreground/55">
              {g.title}
            </p>
            {g.items.map((i) => (
              <NavLink key={i.to} item={i} onNavigate={() => setOpen(false)} />
            ))}
          </div>
        ))}
      </nav>
      <div className="flex items-center gap-3 border-t border-sidebar-border p-4">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
          {footer.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-sidebar-accent-foreground">
            {footer.name}
          </p>
          <p className="truncate text-xs text-sidebar-foreground/65">{footer.sub}</p>
        </div>
        {accountTo && (
          <Link
            href={accountTo}
            aria-label="Account"
            className="text-sidebar-foreground/70 hover:text-sidebar-accent-foreground"
          >
            <Settings className="h-4 w-4" />
          </Link>
        )}
        <button
          type="button"
          aria-label="Sign out"
          onClick={() => signOut()}
          className="text-sidebar-foreground/70 hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 lg:block">{side}</aside>
      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-64">{side}</div>
          <button
            type="button"
            className="flex-1 bg-navy/50"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
        </div>
      )}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <div className="flex h-14 items-center justify-between border-b bg-card px-4 lg:hidden">
          <span className="font-semibold text-navy">Technograph</span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 text-sm"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />} Menu
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
