"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/portal/Topbar";
import { Icon, initials } from "@/components/portal/icons";
import { ApplicationModal } from "@/components/portal/ApplicationModal";
import {
  meApi,
  STAGES,
  stageColor,
  appliedAgo,
  type ApplicationStage,
  type PortalApplication,
} from "@/lib/portal/me-api";
import { fmtDate } from "@/lib/portal/format";

const ALL = "All stages";

export default function ApplicationsPage() {
  const router = useRouter();
  const [apps, setApps] = useState<PortalApplication[] | null>(null);
  const [error, setError] = useState<string>();
  const [selected, setSelected] = useState<PortalApplication | null>(null);
  const [q, setQ] = useState("");
  const [stage, setStage] = useState<string>(ALL);

  function load() {
    setApps(null);
    setError(undefined);
    meApi
      .applications()
      .then(setApps)
      .catch(() => setError("Couldn't load your applications."));
  }

  useEffect(() => {
    load();
  }, []);

  const active = apps?.filter((a) => a.stage !== "Rejected" && a.stage !== "Hired").length ?? 0;
  const rows =
    apps?.filter(
      (a) =>
        (stage === ALL || a.stage === stage) &&
        (q === "" ||
          (a.jobTitle + (a.jobClientName ?? "") + a.skills.join(" "))
            .toLowerCase()
            .includes(q.toLowerCase())),
    ) ?? [];

  return (
    <>
      <Topbar
        kicker="My career"
        title="My applications"
        sub={
          apps === null
            ? "Loading your applications…"
            : `${apps.length} application${apps.length === 1 ? "" : "s"} · ${active} active`
        }
        actions={
          <button className="btn btn-sm" onClick={() => router.push("/portal/roles")}>
            <Icon name="bolt" size={15} /> Browse open roles
          </button>
        }
      />
      <div className="content">
        {error ? (
          <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
            {error}{" "}
            <button className="link" onClick={load} style={{ fontSize: 13 }}>
              Retry
            </button>
          </div>
        ) : apps === null ? (
          <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
            Loading…
          </div>
        ) : apps.length === 0 ? (
          <div className="empty">
            <span className="ic">
              <Icon name="users" size={22} />
            </span>
            <h3>No applications yet</h3>
            <p style={{ maxWidth: 420, margin: "8px auto 0" }}>
              When you apply to an open role it shows up here, and you can track
              it through every stage of the pipeline.
            </p>
          </div>
        ) : (
          <>
            <div className="between" style={{ marginBottom: 14 }}>
              <div className="search" style={{ width: 280 }}>
                <Icon name="search" size={16} />
                <input
                  className="input"
                  placeholder="Search your applications…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
              <select
                className="select"
                style={{ width: 170 }}
                value={stage}
                onChange={(e) => setStage(e.target.value)}
              >
                <option>{ALL}</option>
                {STAGES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              {rows.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
                  No applications match that filter.
                </div>
              ) : (
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Role · Client</th>
                      <th>Stage</th>
                      <th>Match</th>
                      <th>Applied</th>
                      <th>Reference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((a) => (
                      <tr key={a.id} className="click" onClick={() => setSelected(a)}>
                        <td>
                          <div style={{ display: "flex", gap: 11, alignItems: "center" }}>
                            <span className="av av-sm">{initials(a.jobTitle)}</span>
                            <div>
                              <div style={{ fontWeight: 600 }}>{a.jobTitle}</div>
                              <div style={{ fontSize: 12, color: "var(--muted)" }}>
                                {a.jobClientName ?? "Technograph"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            className="tag"
                            style={{
                              color: stageColor[a.stage as ApplicationStage],
                              borderColor: "var(--line)",
                            }}
                          >
                            <span className="dot" style={{ background: stageColor[a.stage as ApplicationStage] }} />
                            {a.stage}
                          </span>
                        </td>
                        <td className="num-c" style={{ fontSize: 12.5 }}>
                          {a.matchPct != null ? `${a.matchPct}%` : "—"}
                        </td>
                        <td className="num-c" style={{ fontSize: 12, color: "var(--muted)" }}>
                          {fmtDate(a.appliedAt)} · {appliedAgo(a.appliedAt)}
                        </td>
                        <td className="mono" style={{ fontSize: 11.5, color: "var(--muted-2)" }}>
                          {a.applicationCode}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>

      {selected && (
        <ApplicationModal application={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
