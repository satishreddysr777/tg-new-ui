"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, initials } from "@/components/portal/icons";
import { EMPLOYER_NAV, type NavItem } from "@/lib/employer/data";
import { employeesApi } from "@/lib/employer/employees-api";
import { employerApi, type StaffProfile } from "@/lib/employer/invites-api";
import { jobsApi } from "@/lib/employer/jobs-api";
import { messagesApi } from "@/lib/employer/messages-api";
import { logout } from "@/lib/session";

const roleLabel: Record<string, string> = {
  ADMIN: "Admin",
  EMPLOYER: "Talent team",
  EMPLOYEE: "Employee",
};

function isActive(pathname: string, item: NavItem): boolean {
  if (item.exact) return pathname === item.href;
  // Section links light up on their detail sub-routes too. "Create job"
  // (/employer/jobs/new) is its own item, so guard the Jobs link against it.
  if (item.href === "/employer/jobs") {
    return pathname === item.href || /^\/employer\/jobs\/(?!new$)/.test(pathname);
  }
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

export function Sidebar() {
  const pathname = usePathname();
  const [me, setMe] = useState<StaffProfile | null>(null);
  const [employeeCount, setEmployeeCount] = useState<number | null>(null);
  const [jobCount, setJobCount] = useState<number | null>(null);
  const [newMessages, setNewMessages] = useState<number | null>(null);

  useEffect(() => {
    employerApi
      .me()
      .then(setMe)
      .catch(() => setMe(null));
    employeesApi
      .list()
      .then((rows) => setEmployeeCount(rows.length))
      .catch(() => setEmployeeCount(0));
    jobsApi
      .list()
      .then((rows) => setJobCount(rows.length))
      .catch(() => setJobCount(0));
    messagesApi
      .list()
      .then((rows) => setNewMessages(rows.filter((m) => m.status === "NEW").length))
      .catch(() => setNewMessages(0));
  }, []);

  // Live counts where a service exists; Timesheets has none yet → no badge.
  function badgeFor(item: NavItem): string | undefined {
    if (item.href === "/employer/employees") {
      return employeeCount === null ? undefined : String(employeeCount);
    }
    if (item.href === "/employer/jobs") {
      return jobCount === null ? undefined : String(jobCount);
    }
    // Only badge Messages when there are unread ones, so it reads as an alert.
    if (item.href === "/employer/messages") {
      return newMessages ? String(newMessages) : undefined;
    }
    return undefined;
  }

  return (
    <aside className="side">
      <Link href="/employer" className="brand" style={{ textDecoration: "none" }}>
        <span className="glyph">T</span>
        <span className="word">Technograph</span>
      </Link>

      {EMPLOYER_NAV.map(({ group, items }) => (
        <div key={group}>
          <div className="ver">{group}</div>
          {items.map((item) => {
            const active = isActive(pathname, item);
            const badge = badgeFor(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={"nav-item" + (active ? " active" : "")}
                aria-current={active ? "page" : undefined}
              >
                <Icon name={item.icon} size={17} />
                {item.label}
                {badge !== undefined && <span className="count">{badge}</span>}
              </Link>
            );
          })}
        </div>
      ))}

      <div className="me">
        <span className="av av-sm">{initials(me?.name ?? "—")}</span>
        <div className="meta">
          <div className="nm">{me?.name ?? "…"}</div>
          <div className="rl">{me ? (roleLabel[me.role] ?? me.role) : ""}</div>
        </div>
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
