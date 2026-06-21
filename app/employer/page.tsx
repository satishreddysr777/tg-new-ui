"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/portal/Topbar";
import { Icon, type IconName } from "@/components/portal/icons";
import { employeesApi } from "@/lib/employer/employees-api";
import { employerApi } from "@/lib/employer/invites-api";
import { jobsApi } from "@/lib/employer/jobs-api";

function greetingFor(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

interface Stats {
  total: number;
  active: number;
  onboarding: number;
  bench: number;
  clients: number; // distinct clients with an active engagement
}

const ZERO: Stats = { total: 0, active: 0, onboarding: 0, bench: 0, clients: 0 };

export default function EmployerDashboard() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [s, setS] = useState<Stats>(ZERO);
  const [jobs, setJobs] = useState({ total: 0, open: 0 });

  useEffect(() => {
    employerApi
      .me()
      .then((u) => setFirstName(u.name.split(" ")[0] ?? ""))
      .catch(() => setFirstName(""));

    employeesApi
      .list()
      .then((rows) => {
        const active = rows.filter((e) => e.status === "Active");
        setS({
          total: rows.length,
          active: active.length,
          onboarding: rows.filter((e) => e.status === "Onboarding").length,
          bench: rows.filter((e) => e.status === "On bench").length,
          clients: new Set(
            active.map((e) => e.clientId).filter(Boolean),
          ).size,
        });
      })
      .catch(() => setS(ZERO));

    jobsApi
      .list()
      .then((rows) =>
        setJobs({
          total: rows.length,
          open: rows.filter((j) => j.status === "Published").length,
        }),
      )
      .catch(() => setJobs({ total: 0, open: 0 }));
  }, []);

  const now = new Date();
  const weekday = now.toLocaleDateString("en-US", { weekday: "long" });
  const date = now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Tiles — Employees is live; the rest have no backing service yet → zero.
  const tiles: {
    href: string;
    icon: IconName;
    title: string;
    big: string;
    small: string;
    color: string;
  }[] = [
    {
      href: "/employer/employees",
      icon: "team",
      title: "Employees",
      big: `${s.total} on payroll`,
      small: `${s.active} active · ${s.onboarding} onboarding`,
      color: "var(--copper)",
    },
    {
      href: "/employer/timesheets",
      icon: "clock",
      title: "Timesheets",
      big: "Coming soon",
      small: "Not yet available",
      color: "var(--teal)",
    },
    {
      href: "/employer/jobs",
      icon: "brief",
      title: "Open jobs",
      big: `${jobs.open} open`,
      small: `${jobs.total} requisition${jobs.total === 1 ? "" : "s"} total`,
      color: "var(--ok)",
    },
  ];

  return (
    <>
      <Topbar
        kicker={`${weekday} · ${date}`}
        title={`${greetingFor(now.getHours())}${firstName ? `, ${firstName}` : ""}.`}
        sub="Here's where the workforce and hiring pipeline stand today."
        actions={
          <>
            {/* <button className="btn btn-ghost btn-sm">Export report</button> */}
            <button
              className="btn btn-sm"
              onClick={() => router.push("/employer/jobs/new")}
            >
              <Icon name="plus" size={15} /> Create job
            </button>
          </>
        }
      />

      <div className="content">
        {/* quick-jump tiles */}
        <div className="grid-3" style={{ marginBottom: 22 }}>
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
