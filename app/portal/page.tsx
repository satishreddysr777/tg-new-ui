"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/portal/Topbar";
import { Icon, type IconName } from "@/components/portal/icons";
import { meApi, type PortalApplication, type PortalRole } from "@/lib/portal/me-api";
import { useMe, firstName } from "@/lib/portal/me-context";
import { engagementProgress, fmtDate } from "@/lib/portal/format";

interface Tile {
  href: string;
  icon: IconName;
  title: string;
  big: string;
  small: string;
  color: string;
}

export default function PortalHome() {
  const router = useRouter();
  const me = useMe();
  const [roles, setRoles] = useState<PortalRole[] | null>(null);
  const [apps, setApps] = useState<PortalApplication[] | null>(null);

  useEffect(() => {
    let active = true;
    meApi.roles().then((r) => active && setRoles(r)).catch(() => active && setRoles([]));
    meApi
      .applications()
      .then((a) => active && setApps(a))
      .catch(() => active && setApps([]));
    return () => {
      active = false;
    };
  }, []);

  const prog = engagementProgress(me.startDate, me.endDate);
  const openRoles = roles?.filter((r) => !r.applied) ?? [];
  const matched = openRoles.filter((r) => r.matchPct >= 50).length;
  const activeApps = apps?.filter((a) => a.stage !== "Rejected" && a.stage !== "Hired") ?? [];
  const furthest = apps && apps.length > 0 ? apps[0]!.stage : null;

  const tiles: Tile[] = [
    {
      href: "/portal/engagement",
      icon: "brief",
      title: "My engagement",
      big: prog ? `${prog.remaining} weeks left` : (me.clientName ?? "No active engagement"),
      small: me.clientName
        ? `${me.clientName} · through ${fmtDate(me.endDate)}`
        : "On bench",
      color: "var(--teal)",
    },
    {
      href: "/portal/pay",
      icon: "cash",
      title: "Pay rate",
      big: me.payRate ?? "—",
      small: [me.employmentType, me.clientName].filter(Boolean).join(" · ") || "—",
      color: "var(--ok)",
    },
    {
      href: "/portal/roles",
      icon: "bolt",
      title: "Open roles",
      big: roles === null ? "…" : `${openRoles.length} open`,
      small:
        roles === null
          ? "Loading roles"
          : matched > 0
            ? `${matched} match your stack`
            : "Matched to your profile",
      color: "var(--plum)",
    },
    {
      href: "/portal/applications",
      icon: "users",
      title: "My applications",
      big: apps === null ? "…" : `${activeApps.length} active`,
      small:
        apps === null
          ? "Loading applications"
          : furthest
            ? `Furthest stage · ${furthest}`
            : "No applications yet",
      color: "var(--copper)",
    },
  ];

  return (
    <>
      <Topbar
        kicker={`${me.employeeCode ?? "Employee"} · ${me.status ?? "Active"}`}
        title={`Welcome back, ${firstName(me.name)}.`}
        sub={
          me.clientName
            ? `${me.title ?? "Engineer"} at ${me.clientName}`
            : (me.title ?? "Technograph engineer")
        }
        actions={
          <>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => router.push("/portal/engagement")}
            >
              View engagement
            </button>
            <button className="btn btn-sm" onClick={() => router.push("/portal/roles")}>
              <Icon name="bolt" size={15} /> Browse open roles
            </button>
          </>
        }
      />

      <div className="content">
        <div className="grid-4">
          {tiles.map((t) => (
            <button
              key={t.href}
              className="card"
              onClick={() => router.push(t.href)}
              style={{
                textAlign: "left",
                cursor: "pointer",
                background: "var(--paper)",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <span
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 11,
                  background: t.color,
                  color: "#fff",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Icon name={t.icon} size={21} />
              </span>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 18,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {t.title}
                </div>
                <div style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 4 }}>
                  {t.big}
                </div>
                <div
                  className="mono"
                  style={{
                    fontSize: 10.5,
                    letterSpacing: "0.04em",
                    color: "var(--muted-2)",
                    marginTop: 6,
                    textTransform: "uppercase",
                  }}
                >
                  {t.small}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
