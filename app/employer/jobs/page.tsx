"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/portal/Topbar";
import { Icon } from "@/components/portal/icons";
import { jobsApi, type Job } from "@/lib/employer/jobs-api";

const DEPARTMENTS = ["Cloud", "Data", "Engineering", "Security", "Digital"];

/** "185000" → "185k"; "150" → "150". */
function short(v: string): string {
  const n = Number(v.replace(/[^\d.]/g, ""));
  if (!Number.isFinite(n)) return v;
  return n >= 1000 ? `${Math.round(n / 1000)}k` : String(n);
}

function formatComp(j: Job): string {
  if (!j.compMin && !j.compMax) return "—";
  const unit = j.compType === "Hourly" ? "/hr" : "";
  const lo = j.compMin ? short(j.compMin) : null;
  const hi = j.compMax ? short(j.compMax) : null;
  const range = lo && hi ? `${lo}–${hi}` : (lo ?? hi);
  return `$${range}${unit}`;
}

/** Relative "posted" label from an ISO date. */
function postedAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (Number.isNaN(days)) return "—";
  if (days <= 0) return "today";
  if (days === 1) return "1d ago";
  return `${days}d ago`;
}

const statusTag = (s: string) =>
  s === "Published" ? "tag tag-ok" : "tag tag-warn";

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All departments");

  function load() {
    setLoading(true);
    jobsApi
      .list()
      .then((rows) => {
        setJobs(rows);
        setError(undefined);
      })
      .catch(() => setError("Couldn't load jobs."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  const rows = jobs.filter(
    (j) =>
      (dept === "All departments" || j.department === dept) &&
      (q === "" ||
        (j.title + (j.clientName ?? "") + (j.department ?? ""))
          .toLowerCase()
          .includes(q.toLowerCase())),
  );

  const published = jobs.filter((j) => j.status === "Published").length;
  const draft = jobs.filter((j) => j.status === "Draft").length;

  return (
    <>
      <Topbar
        kicker="Hiring · Pipeline"
        title="Jobs"
        sub={
          loading
            ? "Loading jobs…"
            : `${jobs.length} job${jobs.length === 1 ? "" : "s"} · ${published} published · ${draft} draft`
        }
        actions={
          <>
            {/* <button className="btn btn-ghost btn-sm">Export</button> */}
            <button className="btn btn-sm" onClick={() => router.push("/employer/jobs/new")}>
              <Icon name="plus" size={15} /> Create job
            </button>
          </>
        }
      />
      <div className="content">
        <div className="between" style={{ marginBottom: 14 }}>
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
            style={{ width: 170 }}
            value={dept}
            onChange={(e) => setDept(e.target.value)}
          >
            <option>All departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {error ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
              {error}{" "}
              <button className="link" onClick={load} style={{ fontSize: 13 }}>
                Retry
              </button>
            </div>
          ) : loading ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
              Loading…
            </div>
          ) : rows.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
              {jobs.length === 0
                ? "No jobs yet. Click Create job to add one."
                : "No jobs match that filter."}
            </div>
          ) : (
            <table className="tbl">
              <thead>
                <tr>
                  <th>Job · Client</th>
                  <th>Engagement</th>
                  <th>Comp</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Owner</th>
                  <th>Posted</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((j) => (
                  <tr
                    key={j.id}
                    className="click"
                    onClick={() => router.push(`/employer/jobs/${j.jobCode}`)}
                  >
                    <td>
                      <div style={{ fontWeight: 600 }}>{j.title}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>
                        {[j.clientName, j.location].filter(Boolean).join(" · ") ||
                          "—"}
                      </div>
                      <div className="mono" style={{ fontSize: 10.5, color: "var(--muted-2)" }}>
                        {j.jobCode}
                      </div>
                    </td>
                    <td>
                      <span className="tag">{j.engagementType ?? "—"}</span>
                    </td>
                    <td className="num-c" style={{ fontSize: 12.5 }}>
                      {formatComp(j)}
                    </td>
                    <td>{j.department ?? "—"}</td>
                    <td>
                      <span className={statusTag(j.status)}>{j.status}</span>
                    </td>
                    <td>{j.hiringManager ?? "—"}</td>
                    <td className="num-c" style={{ fontSize: 12, color: "var(--muted)" }}>
                      {postedAgo(j.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
