"use client";

import {
  STAGES,
  stageColor,
  appliedAgo,
  resumeUrl,
  type PortalApplication,
} from "@/lib/portal/me-api";
import { fmtDate } from "@/lib/portal/format";

/** Labelled value row. */
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
 * Read-only view of one of the employee's own applications. Mirrors the admin
 * candidate modal — résumé preview on the left, details on the right — minus
 * the staff-only stage controls; the employee can see where they stand but not
 * move themselves.
 */
export function ApplicationModal({
  application,
  onClose,
}: {
  application: PortalApplication;
  onClose: () => void;
}) {
  const a = application;
  const stageIndex = STAGES.indexOf(a.stage);
  const url = resumeUrl(a.id);
  const isPdf = (a.resumeName ?? "").toLowerCase().endsWith(".pdf");

  return (
    <div className="modal-bg" onClick={onClose}>
      <div
        className="modal"
        style={{ width: "94vw", maxWidth: 1180, height: "90vh", maxHeight: "90vh", display: "flex", flexDirection: "column" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="between" style={{ padding: "16px 22px", borderBottom: "1px solid var(--line)", alignItems: "flex-start", flex: "none" }}>
          <div>
            <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>
              {a.jobCode} · {a.applicationCode}
            </span>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 20, marginTop: 4 }}>
              {a.jobTitle}
            </div>
            <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 3 }}>
              {a.jobClientName ?? "Technograph"} · Applied {appliedAgo(a.appliedAt)}
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            Close ✕
          </button>
        </div>

        {/* body: résumé preview | details */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 360px", flex: 1, minHeight: 0 }}>
          {/* résumé */}
          <div style={{ borderRight: "1px solid var(--line)", padding: 18, display: "flex", flexDirection: "column", minHeight: 0, background: "var(--paper-2)" }}>
            <div className="between" style={{ marginBottom: 12, flex: "none" }}>
              <span className="eyebrow" style={{ gap: 0 }}>Résumé</span>
              {a.resumeName && (
                <div style={{ display: "flex", gap: 8 }}>
                  <a className="btn btn-ghost btn-sm" href={url} target="_blank" rel="noreferrer">
                    Open ↗
                  </a>
                  <a className="btn btn-sm" href={url} download={a.resumeName}>
                    Download ↓
                  </a>
                </div>
              )}
            </div>

            {!a.resumeName ? (
              <div style={{ flex: 1, display: "grid", placeItems: "center", color: "var(--muted)", border: "1px dashed var(--line)", borderRadius: 10 }}>
                No résumé attached to this application.
              </div>
            ) : isPdf ? (
              <iframe
                title="Résumé preview"
                src={`${url}#view=FitH`}
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

          {/* details */}
          <div style={{ padding: 22, overflow: "auto", display: "flex", flexDirection: "column", gap: 18 }}>
            {/* stage tracker */}
            <div>
              <span className="eyebrow" style={{ gap: 0 }}>Pipeline stage</span>
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                {STAGES.map((s, i) => {
                  const reached = stageIndex >= 0 && i <= stageIndex && a.stage !== "Rejected";
                  const current = s === a.stage;
                  return (
                    <div
                      key={s}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 9,
                        padding: "9px 13px",
                        borderRadius: 9,
                        border: "1px solid var(--line)",
                        background: current ? "var(--ink)" : "var(--paper-2)",
                        color: current ? "#fff" : reached ? "var(--ink)" : "var(--muted)",
                        fontSize: 13,
                        fontWeight: 500,
                      }}
                    >
                      <span className="dot" style={{ background: current ? "#fff" : stageColor[s] }} />
                      {s}
                      {current && (
                        <span className="mono" style={{ marginLeft: "auto", fontSize: 10.5, opacity: 0.8 }}>
                          CURRENT
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="eyebrow" style={{ gap: 0 }}>Application</span>
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 11 }}>
                <Row label="Role" value={a.jobTitle} />
                <Row label="Client" value={a.jobClientName ?? "—"} />
                <Row label="Source" value={a.source ?? "—"} />
                <Row label="Comp ask" value={a.compAsk ?? "—"} />
                <Row label="Match" value={a.matchPct != null ? `${a.matchPct}%` : "—"} />
                <Row label="Applied" value={fmtDate(a.appliedAt)} />
                <Row label="Reference" value={<span className="mono" style={{ fontSize: 12 }}>{a.applicationCode}</span>} />
              </div>
            </div>

            {a.summary && (
              <div>
                <span className="eyebrow" style={{ gap: 0 }}>Your note</span>
                <p style={{ marginTop: 8, fontSize: 13.5, lineHeight: 1.6, color: "var(--ink-2)" }}>
                  {a.summary}
                </p>
              </div>
            )}

            {a.skills.length > 0 && (
              <div>
                <span className="eyebrow" style={{ gap: 0 }}>Skills submitted</span>
                <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {a.skills.map((s) => (
                    <span key={s} className="tag tag-copper">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
