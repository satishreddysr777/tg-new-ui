"use client";

import { useState } from "react";
import { ApiError } from "@/lib/auth-api";
import { meApi, type PortalRole } from "@/lib/portal/me-api";
import { formatComp, postedAgo } from "@/lib/portal/format";

/**
 * Role detail dialog with an inline one-click apply. The employee's profile
 * (name, email, location, stack) is submitted server-side; here they only add
 * optional context (a note, comp ask, or portfolio link).
 */
export function RoleModal({
  role,
  onClose,
  onApplied,
}: {
  role: PortalRole;
  onClose: () => void;
  onApplied: (code: string) => void;
}) {
  const [summary, setSummary] = useState("");
  const [compAsk, setCompAsk] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [applied, setApplied] = useState(role.applied);

  const MAX_RESUME = 4 * 1024 * 1024; // 4MB

  function onResume(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (file && file.size > MAX_RESUME) {
      setError("Résumé must be under 4MB.");
      e.target.value = "";
      return;
    }
    setError(undefined);
    setResume(file);
  }

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
      reader.onerror = () => reject(new Error("Couldn't read the file."));
      reader.readAsDataURL(file);
    });
  }

  async function apply() {
    if (busy || applied) return;
    setError(undefined);
    setBusy(true);
    try {
      const resumeFields = resume
        ? {
            resumeName: resume.name,
            resumeMime: resume.type || "application/octet-stream",
            resumeData: await fileToBase64(resume),
          }
        : {};
      const res = await meApi.applyToRole(role.jobCode, {
        summary: summary.trim() || undefined,
        compAsk: compAsk.trim() || undefined,
        linkedin: linkedin.trim() || undefined,
        ...resumeFields,
      });
      setApplied(true);
      onApplied(res.applicationCode);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't apply. Try again.");
    } finally {
      setBusy(false);
    }
  }

  const facts: [string, string][] = [
    ["Client", role.clientName ?? "—"],
    ["Department", role.department ?? "—"],
    ["Engagement", role.engagementType ?? "—"],
    ["Location", role.location ?? "—"],
    ["Compensation", formatComp(role)],
    ["Posted", postedAgo(role.createdAt)],
  ];

  return (
    <div className="modal-bg" onClick={onClose}>
      <div
        className="modal"
        style={{ width: "94vw", maxWidth: 760, maxHeight: "90vh", display: "flex", flexDirection: "column" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="between" style={{ padding: "18px 22px", borderBottom: "1px solid var(--line)", alignItems: "flex-start", flex: "none" }}>
          <div>
            <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>
              {role.jobCode}
            </span>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 21, marginTop: 4 }}>
              {role.title}
            </div>
            <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 3 }}>
              {[role.clientName, role.location].filter(Boolean).join(" · ") || "—"}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="tag tag-copper">{role.matchPct}% match</span>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>
              Close ✕
            </button>
          </div>
        </div>

        {/* body */}
        <div style={{ padding: 22, overflow: "auto", display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11, fontSize: 13 }}>
            {facts.map(([k, v]) => (
              <div key={k} className="between">
                <span className="eyebrow" style={{ gap: 0 }}>{k}</span>
                <span style={{ fontWeight: 500, textAlign: "right" }}>{v}</span>
              </div>
            ))}
          </div>

          {role.summary && (
            <div>
              <span className="eyebrow"><span className="tick" />Summary</span>
              <p style={{ marginTop: 10, fontSize: 13.5, lineHeight: 1.6, color: "var(--ink-2)" }}>
                {role.summary}
              </p>
            </div>
          )}

          {role.responsibilities && (
            <div>
              <span className="eyebrow"><span className="tick" />Responsibilities</span>
              <pre style={{ marginTop: 10, fontSize: 13.5, lineHeight: 1.65, color: "var(--ink-2)", fontFamily: "inherit", whiteSpace: "pre-wrap" }}>
                {role.responsibilities}
              </pre>
            </div>
          )}

          {role.stack.length > 0 && (
            <div>
              <span className="eyebrow"><span className="tick" />Required stack</span>
              <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {role.stack.map((s) => (
                  <span key={s} className="tag tag-copper">{s}</span>
                ))}
              </div>
            </div>
          )}

          <div className="rule" />

          {applied ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--ok)", fontWeight: 600, fontSize: 14 }}>
              <span className="dot" style={{ background: "var(--ok)" }} />
              Application submitted — track it under My applications.
            </div>
          ) : (
            <div className="stack" style={{ gap: 14 }}>
              <span className="eyebrow"><span className="tick" />Apply to this role</span>
              <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: -6 }}>
                Your profile and skills are sent automatically. Add anything else
                the talent team should know (optional).
              </p>
              <div>
                <label className="field-label">Note to the talent team</label>
                <textarea
                  className="textarea"
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Why you're a fit for this role…"
                />
              </div>
              <div className="grid-2">
                <div>
                  <label className="field-label">Comp expectation</label>
                  <input className="input" value={compAsk} onChange={(e) => setCompAsk(e.target.value)} placeholder="e.g. $120/hr" />
                </div>
                <div>
                  <label className="field-label">Portfolio / LinkedIn</label>
                  <input className="input" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="(optional)" />
                </div>
              </div>
              <div>
                <label className="field-label">Résumé (PDF or Word, up to 4MB)</label>
                <label
                  htmlFor="portal-resume"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "11px 13px",
                    border: "1.5px dashed var(--line)",
                    borderRadius: "var(--r-sm)",
                    cursor: "pointer",
                    background: "var(--paper-2)",
                    fontSize: 13.5,
                  }}
                >
                  <span className="btn btn-dark btn-sm" style={{ pointerEvents: "none" }}>
                    Choose file
                  </span>
                  <span style={{ color: resume ? "var(--ink)" : "var(--muted)", wordBreak: "break-all" }}>
                    {resume ? resume.name : "No file selected"}
                  </span>
                </label>
                <input
                  id="portal-resume"
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={onResume}
                  style={{ display: "none" }}
                />
              </div>
              {error && <p className="err" role="alert">{error}</p>}
              <button className="btn" onClick={apply} disabled={busy} style={{ alignSelf: "flex-start" }}>
                {busy ? "Submitting…" : "Submit application →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
