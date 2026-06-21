"use client";

import { useState } from "react";
import { initials } from "@/components/portal/icons";
import { ApiError } from "@/lib/auth-api";
import {
  applicationsApi,
  appliedAgo,
  STAGES,
  stageColor,
  type Application,
  type Stage,
} from "@/lib/employer/applications-api";

const RESUME_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";

function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

/** Labelled value row used in the details panel. */
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="between" style={{ alignItems: "baseline", gap: 12 }}>
      <span className="eyebrow" style={{ gap: 0 }}>{label}</span>
      <span style={{ fontWeight: 500, fontSize: 13, textAlign: "right", wordBreak: "break-word" }}>
        {value}
      </span>
    </div>
  );
}

/**
 * Candidate detail popup — a large dialog with an inline résumé preview, every
 * field captured on the application, and a "Move to" rail to advance the
 * candidate through the pipeline.
 */
export function CandidateModal({
  application,
  jobTitle,
  onClose,
  onUpdated,
}: {
  application: Application;
  jobTitle: string;
  onClose: () => void;
  onUpdated: (a: Application) => void;
}) {
  const [a, setA] = useState(application);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  async function move(stage: Stage) {
    if (stage === a.stage || busy) return;
    setError(undefined);
    setBusy(true);
    try {
      const updated = await applicationsApi.updateStage(a.id, stage);
      setA(updated);
      onUpdated(updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't move candidate.");
    } finally {
      setBusy(false);
    }
  }

  const resumeUrl = `${RESUME_BASE}/applications/${a.id}/resume`;
  const isPdf = (a.resumeName ?? "").toLowerCase().endsWith(".pdf");
  const linkedinHref = a.linkedin
    ? a.linkedin.startsWith("http")
      ? a.linkedin
      : `https://${a.linkedin}`
    : null;

  return (
    <div className="modal-bg" onClick={onClose}>
      <div
        className="modal"
        style={{ width: "94vw", maxWidth: 1180, height: "90vh", maxHeight: "90vh", display: "flex", flexDirection: "column" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div
          className="between"
          style={{ padding: "16px 22px", borderBottom: "1px solid var(--line)", alignItems: "center", flex: "none" }}
        >
          <div style={{ display: "flex", gap: 13, alignItems: "center" }}>
            <span className="av av-lg">{initials(a.name)}</span>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 20 }}>
                {a.name}
              </div>
              <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
                {jobTitle} · Applied {appliedAgo(a.appliedAt)} · {a.applicationCode}
              </div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            Close ✕
          </button>
        </div>

        {/* body: résumé preview | details + move-to */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 360px", flex: 1, minHeight: 0 }}>
          {/* résumé */}
          <div style={{ borderRight: "1px solid var(--line)", padding: 18, display: "flex", flexDirection: "column", minHeight: 0, background: "var(--paper-2)" }}>
            <div className="between" style={{ marginBottom: 12, flex: "none" }}>
              <span className="eyebrow" style={{ gap: 0 }}>Résumé</span>
              {a.resumeName && (
                <div style={{ display: "flex", gap: 8 }}>
                  <a className="btn btn-ghost btn-sm" href={resumeUrl} target="_blank" rel="noreferrer">
                    Open ↗
                  </a>
                  <a className="btn btn-sm" href={resumeUrl} download={a.resumeName}>
                    Download ↓
                  </a>
                </div>
              )}
            </div>

            {!a.resumeName ? (
              <div style={{ flex: 1, display: "grid", placeItems: "center", color: "var(--muted)", border: "1px dashed var(--line)", borderRadius: 10 }}>
                No résumé uploaded.
              </div>
            ) : isPdf ? (
              <iframe
                title="Résumé preview"
                src={`${resumeUrl}#view=FitH`}
                style={{ flex: 1, width: "100%", border: "1px solid var(--line)", borderRadius: 10, background: "#fff", minHeight: 0 }}
              />
            ) : (
              <div style={{ flex: 1, display: "grid", placeItems: "center", border: "1px dashed var(--line)", borderRadius: 10, textAlign: "center", padding: 24 }}>
                <div>
                  <div style={{ fontSize: 40 }}>📄</div>
                  <div style={{ fontWeight: 600, marginTop: 8, wordBreak: "break-all" }}>{a.resumeName}</div>
                  <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 6, maxWidth: 340 }}>
                    Inline preview isn&apos;t available for this file type. Use
                    Open or Download above to view it.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* details + move-to */}
          <div style={{ padding: 22, overflow: "auto", display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <span className="eyebrow" style={{ gap: 0 }}>Applicant</span>
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 11 }}>
                <Row label="Email" value={a.email ? <a className="link" href={`mailto:${a.email}`} style={{ fontSize: 13 }}>{a.email}</a> : "—"} />
                <Row label="Phone" value={a.phone ?? "—"} />
                <Row label="Location" value={a.location ?? "—"} />
                <Row label="Years" value={a.years != null ? `${a.years}` : "—"} />
                <Row
                  label="LinkedIn"
                  value={linkedinHref ? (
                    <a className="link" href={linkedinHref} target="_blank" rel="noreferrer" style={{ fontSize: 13 }}>
                      View ↗
                    </a>
                  ) : "—"}
                />
                <Row label="Source" value={a.source ?? "—"} />
                <Row label="Comp ask" value={a.compAsk ?? "—"} />
                <Row label="Match" value={a.matchPct != null ? `${a.matchPct}%` : "—"} />
                <Row label="Applied" value={fmtDate(a.appliedAt)} />
                <Row label="Reference" value={<span className="mono" style={{ fontSize: 12 }}>{a.applicationCode}</span>} />
              </div>
            </div>

            {a.summary && (
              <div>
                <span className="eyebrow" style={{ gap: 0 }}>Summary</span>
                <p style={{ marginTop: 8, fontSize: 13.5, lineHeight: 1.6, color: "var(--ink-2)" }}>
                  {a.summary}
                </p>
              </div>
            )}

            {a.skills.length > 0 && (
              <div>
                <span className="eyebrow" style={{ gap: 0 }}>Skills</span>
                <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {a.skills.map((s) => (
                    <span key={s} className="tag tag-copper">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {a.experience.length > 0 && (
              <div>
                <span className="eyebrow" style={{ gap: 0 }}>Experience</span>
                <div style={{ marginTop: 8 }}>
                  {a.experience.map((x, i) => (
                    <div key={i} style={{ padding: "10px 0", borderBottom: i < a.experience.length - 1 ? "1px solid var(--line-2)" : 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{x.title}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>{x.company} · {x.period}</div>
                      {x.detail && <div style={{ fontSize: 12.5, color: "var(--ink-2)", marginTop: 4 }}>{x.detail}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <span className="eyebrow" style={{ gap: 0 }}>Move to</span>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                {STAGES.map((s) => {
                  const on = s === a.stage;
                  return (
                    <button
                      key={s}
                      onClick={() => move(s)}
                      disabled={busy}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 9,
                        padding: "10px 13px",
                        borderRadius: 9,
                        border: "1px solid var(--line)",
                        background: on ? "var(--ink)" : "var(--paper-2)",
                        color: on ? "#fff" : "var(--ink)",
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: busy ? "default" : "pointer",
                        textAlign: "left",
                      }}
                    >
                      <span className="dot" style={{ background: on ? "#fff" : stageColor[s] }} />
                      {s}
                    </button>
                  );
                })}
              </div>
              {error && (
                <p className="err" role="alert" style={{ marginTop: 12 }}>
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
