"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/portal/Topbar";
import { Icon, initials } from "@/components/portal/icons";
import {
  employeesApi,
  formatDate,
  displayClient,
  type Employee,
  type EmployeeStatus,
} from "@/lib/employer/employees-api";

const statusDot = (s: EmployeeStatus | null) =>
  s === "Active" ? "var(--ok)" : s === "Onboarding" ? "var(--copper)" : "var(--warn)";

export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [q, setQ] = useState("");
  const [stat, setStat] = useState("All");
  const [view, setView] = useState<"Table" | "Grid">("Table");

  function load() {
    setLoading(true);
    employeesApi
      .list()
      .then((rows) => {
        setEmployees(rows);
        setError(undefined);
      })
      .catch(() => setError("Couldn't load employees."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  const rows = employees.filter(
    (e) =>
      (q === "" ||
        (e.name + (e.title ?? "") + (e.clientName ?? "")).toLowerCase().includes(q.toLowerCase())) &&
      (stat === "All" || e.status === stat),
  );

  const counts = {
    active: employees.filter((e) => e.status === "Active").length,
    onboarding: employees.filter((e) => e.status === "Onboarding").length,
    bench: employees.filter((e) => e.status === "On bench").length,
  };
  const KPIS: [string, string, string][] = [
    ["Active", String(counts.active), "On engagement"],
    ["Onboarding", String(counts.onboarding), "Starting soon"],
    ["On bench", String(counts.bench), "Available now"],
    ["Total", String(employees.length), "On payroll"],
  ];

  const open = (e: Employee) => router.push(`/employer/employees/${e.employeeCode}`);

  return (
    <>
      <Topbar
        kicker="Workforce · Directory"
        title="Employees"
        sub={
          loading
            ? "Loading the workforce…"
            : `${employees.length} on payroll · ${counts.active} active · ${counts.onboarding} onboarding · ${counts.bench} on bench`
        }
        actions={
          <>
            {/* <button className="btn btn-ghost btn-sm">Export CSV</button> */}
            <button
              className="btn btn-sm"
              onClick={() => router.push("/employer/employees/new")}
            >
              <Icon name="plus" size={15} /> Add employee
            </button>
          </>
        }
      />
      <div className="content">
        <div className="grid-4" style={{ marginBottom: 18 }}>
          {KPIS.map(([l, n, f]) => (
            <div key={l} className="card kpi">
              <div className="lbl">{l}</div>
              <div className="num">{n}</div>
              <div className="foot">{f.toUpperCase()}</div>
            </div>
          ))}
        </div>

        <div className="between" style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <div className="search" style={{ width: 280 }}>
              <Icon name="search" size={16} />
              <input
                className="input"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <select
              className="select"
              style={{ width: 150 }}
              value={stat}
              onChange={(e) => setStat(e.target.value)}
            >
              {["All", "Active", "Onboarding", "On bench"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="seg">
            {(["Table", "Grid"] as const).map((v) => (
              <button key={v} className={view === v ? "on" : ""} onClick={() => setView(v)}>
                {v}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <div className="card" style={{ textAlign: "center", color: "var(--muted)", padding: 40 }}>
            {error}{" "}
            <button className="link" onClick={load} style={{ fontSize: 13 }}>
              Retry
            </button>
          </div>
        ) : loading ? (
          <div className="card" style={{ textAlign: "center", color: "var(--muted)", padding: 40 }}>
            Loading…
          </div>
        ) : view === "Table" ? (
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role / Client</th>
                  <th>Type</th>
                  <th>Bill rate</th>
                  <th>Manager</th>
                  <th>Status</th>
                  <th>End date</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((e) => (
                  <tr key={e.id} className="click" onClick={() => open(e)}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                        <span className="av av-sm">{initials(e.name)}</span>
                        <div>
                          <div style={{ fontWeight: 600 }}>{e.name}</div>
                          <div className="mono" style={{ fontSize: 10.5, color: "var(--muted)" }}>
                            {e.employeeCode}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{e.title ?? "—"}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>{displayClient(e)}</div>
                    </td>
                    <td>
                      <span className="tag">{e.employmentType ?? "—"}</span>
                    </td>
                    <td className="num-c">{e.billRate ?? "—"}</td>
                    <td>{e.managerName ?? "—"}</td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5 }}>
                        <span className="dot" style={{ background: statusDot(e.status) }} />
                        {e.status ?? "—"}
                      </span>
                    </td>
                    <td className="num-c" style={{ fontSize: 12, color: "var(--muted)" }}>
                      {formatDate(e.endDate)}
                    </td>
                    <td style={{ color: "var(--copper)" }}>
                      <Icon name="arrow" size={16} />
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", color: "var(--muted)", padding: 40 }}>
                      No employees match that search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid-3">
            {rows.map((e) => (
              <button
                key={e.id}
                className="card"
                onClick={() => open(e)}
                style={{ textAlign: "left", cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className="av av-lg">{initials(e.name)}</span>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16 }}>
                      {e.name}
                    </div>
                    <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{e.title ?? "—"}</div>
                  </div>
                </div>
                <div className="rule" style={{ margin: "14px 0" }} />
                <div className="between" style={{ fontSize: 12.5 }}>
                  <span style={{ color: "var(--muted)" }}>{displayClient(e)}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span className="dot" style={{ background: statusDot(e.status) }} />
                    {e.status ?? "—"}
                  </span>
                </div>
                <div className="between" style={{ fontSize: 12.5, marginTop: 8 }}>
                  <span style={{ color: "var(--muted)" }}>Bill rate</span>
                  <span className="mono">{e.billRate ?? "—"}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
