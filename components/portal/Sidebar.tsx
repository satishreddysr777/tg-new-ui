"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, initials } from "./icons";
import { PORTAL_NAV } from "./nav";
import { meApi } from "@/lib/portal/me-api";
import { useMe } from "@/lib/portal/me-context";
import { logout } from "@/lib/session";

const ELLIPSIS: React.CSSProperties = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

function isActive(pathname: string, href: string): boolean {
  // Home is exact; section links also light up on their sub-routes.
  if (href === "/portal") return pathname === "/portal";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Sidebar() {
  const pathname = usePathname();
  const me = useMe();

  // Live badge counts for the career section.
  const [badges, setBadges] = useState<Record<string, string>>({});
  useEffect(() => {
    let active = true;
    Promise.all([
      meApi.roles().catch(() => []),
      meApi.applications().catch(() => []),
    ]).then(([roles, apps]) => {
      if (!active) return;
      const open = roles.filter((r) => !r.applied).length;
      setBadges({
        "/portal/roles": open ? String(open) : "",
        "/portal/applications": apps.length ? String(apps.length) : "",
      });
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <aside className="side">
      <Link href="/portal" className="brand" style={{ textDecoration: "none" }}>
        <span className="glyph">T</span>
        <span className="word">Technograph</span>
      </Link>

      {PORTAL_NAV.map(({ group, items }) => (
        <div key={group}>
          <div className="ver">{group}</div>
          {items.map((item) => {
            const badge = badges[item.href];
            return (
              <Link
                key={item.href}
                href={item.href}
                className={"nav-item" + (isActive(pathname, item.href) ? " active" : "")}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
              >
                <Icon name={item.icon} size={17} />
                {item.label}
                {badge && <span className="count">{badge}</span>}
              </Link>
            );
          })}
        </div>
      ))}

      <div className="me">
        <Link
          href="/portal/account"
          className="meta"
          style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", minWidth: 0, flex: 1 }}
        >
          <span className="av av-sm">{initials(me.name)}</span>
          <div style={{ minWidth: 0 }}>
            <div className="nm" style={ELLIPSIS} title={me.name}>
              {me.name}
            </div>
            <div className="rl" style={ELLIPSIS}>
              {[me.title ?? "Employee", me.employeeCode].filter(Boolean).join(" · ")}
            </div>
          </div>
        </Link>
        <Link
          href="/portal/account"
          className="logout"
          aria-label="Account & security"
          title="Account & security"
        >
          <Icon name="cog" size={16} />
        </Link>
        <button
          type="button"
          className="logout"
          onClick={logout}
          aria-label="Sign out"
          title="Sign out"
        >
          <Icon name="logout" size={16} />
        </button>
      </div>
    </aside>
  );
}
