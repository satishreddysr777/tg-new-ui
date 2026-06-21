"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Topbar } from "@/components/portal/Topbar";
import { Icon, initials } from "@/components/portal/icons";
import { jobsApi, type Job } from "@/lib/employer/jobs-api";
import {
  applicationsApi,
  appliedAgo,
  STAGES,
  stageColor,
  type Application,
  type Stage,
} from "@/lib/employer/applications-api";
import { CandidateModal } from "@/components/employer/CandidateModal";
import { AddCandidateModal } from "@/components/employer/AddCandidateModal";

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

function postedAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (Number.isNaN(days)) return "—";
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

const statusTag = (s: string) =>
  s === "Published" ? "tag tag-ok" : "tag tag-warn";

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [j, setJ] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<"notfound" | "error">();

  const [apps, setApps] = useState<Application[]>([]);
  const [q, setQ] = useState("");
  const [source, setSource] = useState("All sources");
  const [selected, setSelected] = useState<Application | null>(null);
  const [adding, setAdding] = useState(false);

  const loadApps = useCallback(() => {
    applicationsApi
      .listByJob(params.id)
      .then(setApps)
      .catch(() => setApps([]));
  }, [params.id]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    jobsApi
      .get(params.id)
      .then((job) => {
        if (!active) return;
        setJ(job);
        loadApps();
      })
      .catch((err) =>
        active && setError(err?.status === 404 ? "notfound" : "error"),
      )
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [params.id, loadApps]);

  const [pubBusy, setPubBusy] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<Stage | null>(null);

  // Reflect a stage change / new candidate without a full refetch.
  function upsert(a: Application) {
    setApps((prev) => {
      const i = prev.findIndex((x) => x.id === a.id);
      if (i === -1) return [...prev, a];
      const next = [...prev];
      next[i] = a;
      return next;
    });
    setSelected((s) => (s && s.id === a.id ? a : s));
  }

  // Move a candidate to a new stage (drag-and-drop), optimistic with revert.
  async function moveStage(id: string, stage: Stage) {
    const a = apps.find((x) => x.id === id);
    if (!a || a.stage === stage) return;
    upsert({ ...a, stage });
    try {
      const updated = await applicationsApi.updateStage(id, stage);
      upsert(updated);
    } catch {
      loadApps(); // revert to server truth on failure
    }
  }

  async function togglePublish() {
    if (!j) return;
    const next = j.status === "Published" ? "Draft" : "Published";
    setPubBusy(true);
    try {
      const updated = await jobsApi.update(j.jobCode, { status: next });
      setJ(updated);
    } catch {
      // leave as-is on failure
    } finally {
      setPubBusy(false);
    }
  }

  if (loading) {
    return (
      <>
        <Topbar kicker="Hiring" title="Job" />
        <div className="content">
          <div className="card" style={{ textAlign: "center", color: "var(--muted)", padding: 40 }}>
            Loading…
          </div>
        </div>
      </>
    );
  }

  if (error || !j) {
    return (
      <>
        <Topbar kicker="Hiring" title="Job not found" />
        <div className="content">
          <div className="card" style={{ textAlign: "center", color: "var(--muted)", padding: 40 }}>
            {error === "notfound" ? "No job with that id." : "Couldn't load this job."}{" "}
            <button className="link" style={{ fontSize: 13 }} onClick={() => router.push("/employer/jobs")}>
              Back to jobs
            </button>
          </div>
        </div>
      </>
    );
  }

  const facts: [string, string][] = [
    ["Client", j.clientName ?? "—"],
    ["Department", j.department ?? "—"],
    ["Engagement", j.engagementType ?? "—"],
    ["Location", j.location ?? "—"],
    ["Headcount", String(j.headcount)],
    ["Compensation", `${formatComp(j)}${j.compType ? ` · ${j.compType}` : ""}`],
    ["Hiring manager", j.hiringManager ?? "—"],
    ["Posted", postedAgo(j.createdAt)],
  ];

  return (
    <>
      <Topbar
        kicker={`Hiring · ${j.jobCode}`}
        title={j.title}
        sub={[j.clientName, j.location].filter(Boolean).join(" · ") || "—"}
        actions={
          <>
            <button className="btn btn-ghost btn-sm" onClick={() => router.push("/employer/jobs")}>
              ← Jobs
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => router.push(`/employer/jobs/new?edit=${j.jobCode}`)}
            >
              Edit job
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={togglePublish}
              disabled={pubBusy}
            >
              {pubBusy
                ? "Saving…"
                : j.status === "Published"
                  ? "Unpublish"
                  : "Publish"}
            </button>
            <button className="btn btn-sm" onClick={() => setAdding(true)}>
              <Icon name="plus" size={15} /> Add candidate
            </button>
          </>
        }
      />
      <div className="content">
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 18, alignItems: "start" }}>
          {/* overview card */}
          <div className="card">
            <div className="between" style={{ alignItems: "center" }}>
              <span className="mono" style={{ fontSize: 11.5, color: "var(--muted)" }}>
                {j.jobCode}
              </span>
              <span className={statusTag(j.status)}>{j.status}</span>
            </div>
            <div className="rule" style={{ margin: "16px 0" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 11, fontSize: 13 }}>
              {facts.map(([k, v]) => (
                <div key={k} className="between">
                  <span className="eyebrow" style={{ gap: 0 }}>
                    {k}
                  </span>
                  <span style={{ fontWeight: 500, textAlign: "right" }}>{v}</span>
                </div>
              ))}
            </div>
            {j.stack.length > 0 && (
              <>
                <div className="rule" style={{ margin: "16px 0" }} />
                <span className="eyebrow">
                  <span className="tick" />
                  Required stack
                </span>
                <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {j.stack.map((s) => (
                    <span key={s} className="tag tag-copper">
                      {s}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* spec */}
          <div className="stack">
            <div className="card">
              <span className="eyebrow">
                <span className="tick" />
                Summary
              </span>
              <p style={{ marginTop: 12, fontSize: 14, lineHeight: 1.65, color: "var(--ink-2)" }}>
                {j.summary || "No summary provided."}
              </p>
            </div>
            <div className="card">
              <span className="eyebrow">
                <span className="tick" />
                Responsibilities
              </span>
              {j.responsibilities ? (
                <pre
                  style={{
                    marginTop: 12,
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "var(--ink-2)",
                    fontFamily: "inherit",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {j.responsibilities}
                </pre>
              ) : (
                <p style={{ marginTop: 12, fontSize: 14, color: "var(--muted)" }}>
                  No responsibilities listed.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* job applications board */}
        {(() => {
          const sources = [
            "All sources",
            ...Array.from(new Set(apps.map((a) => a.source).filter(Boolean))),
          ] as string[];
          const filtered = apps.filter(
            (a) =>
              (source === "All sources" || a.source === source) &&
              (q === "" ||
                (a.name + a.skills.join(" "))
                  .toLowerCase()
                  .includes(q.toLowerCase())),
          );

          return (
            <div style={{ marginTop: 24 }}>
              <div className="between" style={{ marginBottom: 14 }}>
                <h3 style={{ fontSize: 18 }}>
                  Job applications{" "}
                  <span style={{ color: "var(--muted)", fontWeight: 400 }}>
                    · {apps.length}
                  </span>
                </h3>
                <div style={{ display: "flex", gap: 10 }}>
                  <div className="search" style={{ width: 240 }}>
                    <Icon name="search" size={16} />
                    <input
                      className="input"
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                    />
                  </div>
                  <select
                    className="select"
                    style={{ width: 160 }}
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                  >
                    {sources.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {apps.length === 0 ? (
                <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
                  No applications yet. Click <strong>Add candidate</strong> to add
                  one to <strong>{j.title}</strong>.
                </div>
              ) : (
                <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8, alignItems: "flex-start" }}>
                  {STAGES.map((st) => {
                    const cards = filtered.filter((a) => a.stage === st);
                    return (
                      <div
                        key={st}
                        className="card"
                        onDragOver={(e) => {
                          e.preventDefault();
                          if (dragOver !== st) setDragOver(st);
                        }}
                        onDragLeave={(e) => {
                          if (!e.currentTarget.contains(e.relatedTarget as Node))
                            setDragOver((s) => (s === st ? null : s));
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragOver(null);
                          if (dragId) moveStage(dragId, st);
                          setDragId(null);
                        }}
                        style={{
                          flex: "0 0 230px",
                          padding: 0,
                          background: "var(--paper-2)",
                          outline:
                            dragOver === st ? "2px dashed var(--copper)" : "none",
                          outlineOffset: -2,
                          transition: "outline-color 0.12s",
                        }}
                      >
                        <div
                          className="between"
                          style={{ padding: "12px 14px", borderBottom: "1px solid var(--line)" }}
                        >
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                            <span className="dot" style={{ background: stageColor[st] }} />
                            {st}
                          </span>
                          <span className="mono" style={{ fontSize: 11.5, color: "var(--muted)" }}>
                            {cards.length}
                          </span>
                        </div>
                        <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 10, minHeight: 80 }}>
                          {cards.map((a) => (
                            <button
                              key={a.id}
                              draggable
                              onDragStart={(e) => {
                                setDragId(a.id);
                                e.dataTransfer.effectAllowed = "move";
                              }}
                              onDragEnd={() => {
                                setDragId(null);
                                setDragOver(null);
                              }}
                              onClick={() => setSelected(a)}
                              className="card"
                              style={{
                                textAlign: "left",
                                cursor: "grab",
                                padding: 13,
                                background: "var(--paper)",
                                opacity: dragId === a.id ? 0.5 : 1,
                              }}
                            >
                              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                <span className="av av-sm">{initials(a.name)}</span>
                                <div>
                                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>{a.name}</div>
                                  <div style={{ fontSize: 11.5, color: "var(--muted)" }}>
                                    {[a.years != null ? `${a.years}y` : null, a.location].filter(Boolean).join(" · ") || "—"}
                                  </div>
                                </div>
                              </div>
                              {a.skills.length > 0 && (
                                <div style={{ marginTop: 9, display: "flex", flexWrap: "wrap", gap: 5 }}>
                                  {a.skills.slice(0, 3).map((s) => (
                                    <span key={s} className="tag" style={{ fontSize: 10.5 }}>{s}</span>
                                  ))}
                                </div>
                              )}
                              <div className="between mono" style={{ marginTop: 10, fontSize: 10, color: "var(--muted)" }}>
                                <span>{appliedAgo(a.appliedAt).toUpperCase()}</span>
                                {a.matchPct != null && <span>{a.matchPct}% MATCH</span>}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {selected && (
        <CandidateModal
          application={selected}
          jobTitle={j.title}
          onClose={() => setSelected(null)}
          onUpdated={upsert}
        />
      )}
      {adding && (
        <AddCandidateModal
          jobIdOrCode={params.id}
          onClose={() => setAdding(false)}
          onCreated={(a) => {
            upsert(a);
            setAdding(false);
          }}
        />
      )}
    </>
  );
}
