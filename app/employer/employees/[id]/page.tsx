"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Topbar } from "@/components/portal/Topbar";
import { Icon, initials, type IconName } from "@/components/portal/icons";
import { ApiError } from "@/lib/auth-api";
import {
  employeesApi,
  formatDate,
  displayClient,
  type Employee,
  type EngagementHistory,
} from "@/lib/employer/employees-api";

const todayISO = () => new Date().toISOString().slice(0, 10);

const DOCS = ["I-9 · Verified", "W-4 · 2026", "NDA · Signed", "Direct deposit", "BG check · 2024"];

/** Gross margin from the bill/pay rate display strings, e.g. "$165/hr" → 32.1%. */
function marginPct(bill: string | null, pay: string | null): string {
  const num = (s: string | null) => {
    const m = s?.match(/[\d.]+/);
    return m ? Number(m[0]) : NaN;
  };
  const b = num(bill);
  const p = num(pay);
  if (!Number.isFinite(b) || !Number.isFinite(p) || b <= 0) return "—";
  return `${(((b - p) / b) * 100).toFixed(1)}%`;
}

const ACTIVITY: [IconName, string, string, string][] = [
  ["clock", "Timesheet submitted", "26.5h · Week 19", "2h"],
  ["cal", "1:1 with manager", "Quarterly check-in", "4d"],
  ["cash", "Pay run", "$8,128.40 net", "May 2"],
  ["bolt", "Cert added", "AWS SAA-Pro", "Apr 28"],
];

export default function EmployeeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [e, setE] = useState<Employee | null>(null);
  const [history, setHistory] = useState<EngagementHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  // End-engagement modal state.
  const [endOpen, setEndOpen] = useState(false);
  const [endDate, setEndDate] = useState(todayISO());
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string>();
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string>();

  const load = useCallback(
    (active: () => boolean) => {
      setLoading(true);
      employeesApi
        .get(params.id)
        .then((emp) => {
          if (!active()) return;
          setE(emp);
          return employeesApi
            .engagements(params.id)
            .then((rows) => active() && setHistory(rows))
            .catch(() => active() && setHistory([]));
        })
        .catch((err) =>
          active() && setError(err?.status === 404 ? "notfound" : "error"),
        )
        .finally(() => active() && setLoading(false));
    },
    [params.id],
  );

  useEffect(() => {
    let alive = true;
    load(() => alive);
    return () => {
      alive = false;
    };
  }, [load]);

  async function confirmEnd() {
    if (!e) return;
    setActionError(undefined);
    if (!endDate) {
      setActionError("Pick an end date.");
      return;
    }
    setBusy(true);
    try {
      await employeesApi.endEngagement(e.employeeCode ?? e.id, {
        endDate,
        reason: reason.trim() || undefined,
      });
      setEndOpen(false);
      setReason("");
      setEndDate(todayISO());
      load(() => true);
    } catch (err) {
      setActionError(
        err instanceof ApiError
          ? err.message
          : "Couldn't end the engagement. Try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function removeEmployee() {
    if (!e) return;
    if (
      !window.confirm(
        `Delete ${e.name}? This permanently removes their account and history and can't be undone.`,
      )
    )
      return;
    setDeleteError(undefined);
    setDeleting(true);
    try {
      await employeesApi.remove(e.employeeCode ?? e.id);
      router.push("/employer/employees");
    } catch (err) {
      setDeleteError(
        err instanceof ApiError
          ? err.message
          : "Couldn't delete this employee. Try again.",
      );
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <>
        <Topbar kicker="Workforce" title="Employee" />
        <div className="content">
          <div className="card" style={{ textAlign: "center", color: "var(--muted)", padding: 40 }}>
            Loading…
          </div>
        </div>
      </>
    );
  }

  if (error || !e) {
    return (
      <>
        <Topbar kicker="Workforce" title="Employee not found" />
        <div className="content">
          <div className="card" style={{ textAlign: "center", color: "var(--muted)", padding: 40 }}>
            {error === "notfound" ? "No employee with that id." : "Couldn't load this employee."}{" "}
            <button className="link" style={{ fontSize: 13 }} onClick={() => router.push("/employer/employees")}>
              Back to directory
            </button>
          </div>
        </div>
      </>
    );
  }

  const email = e.email;

  return (
    <>
      <Topbar
        kicker={`Workforce · ${e.employeeCode ?? "—"}`}
        title={e.name}
        sub={`${e.title ?? "New hire"} · ${displayClient(e)}`}
        actions={
          <>
            <button className="btn btn-ghost btn-sm" onClick={() => router.push("/employer/employees")}>
              ← Directory
            </button>
            <button className="btn btn-ghost btn-sm">Edit</button>
            {e.clientId && (
              <button
                className="btn btn-sm btn-dark"
                onClick={() => {
                  setActionError(undefined);
                  setEndDate(todayISO());
                  setEndOpen(true);
                }}
              >
                End engagement
              </button>
            )}
            {e.status === "On bench" && (
              <button
                className="btn btn-sm btn-dark"
                onClick={removeEmployee}
                disabled={deleting}
                style={{ background: "var(--bad)", borderColor: "var(--bad)" }}
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            )}
          </>
        }
      />
      <div className="content">
        {deleteError && (
          <div
            className="card"
            role="alert"
            style={{
              marginBottom: 18,
              borderColor: "var(--bad)",
              color: "var(--bad)",
              fontSize: 13,
            }}
          >
            {deleteError}
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 18, alignItems: "start" }}>
          {/* identity card */}
          <div className="card">
            <div style={{ display: "flex", gap: 13, alignItems: "center" }}>
              <span className="av av-lg">{initials(e.name)}</span>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 19, lineHeight: 1.1 }}>
                  {e.name}
                </div>
                <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{e.title ?? "New hire"}</div>
              </div>
            </div>
            <div className="rule" style={{ margin: "18px 0" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 11, fontSize: 13 }}>
              {(
                [
                  ["Email", email],
                  ["Based in", e.location ?? "—"],
                  ["Status", e.status ?? "—"],
                  ["Type", e.employmentType ?? "—"],
                  ["Manager", e.managerName ?? "—"],
                ] as [string, string][]
              ).map(([k, v]) => (
                <div key={k} className="between">
                  <span className="eyebrow" style={{ gap: 0 }}>
                    {k}
                  </span>
                  <span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
            {e.stack.length > 0 && (
              <>
                <div className="rule" style={{ margin: "18px 0" }} />
                <span className="eyebrow">
                  <span className="tick" />
                  Skills
                </span>
                <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {e.stack.map((s) => (
                    <span key={s} className="tag tag-copper">
                      {s}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* right column */}
          <div className="stack">
            <div className="grid-4">
              {(
                [
                  ["Bill rate", e.billRate ?? "—"],
                  ["Pay rate", e.payRate ?? "—"],
                  ["Margin", marginPct(e.billRate, e.payRate)],
                  ["YTD billed", "$58.4k"],
                ] as [string, string][]
              ).map(([l, v]) => (
                <div key={l} className="card kpi" style={{ padding: 16 }}>
                  <div className="lbl">{l}</div>
                  <div className="num" style={{ fontSize: 30 }}>
                    {v}
                  </div>
                </div>
              ))}
            </div>

            <div className="card">
              <div className="between">
                <h3 style={{ fontSize: 18 }}>Current engagement</h3>
                <span className="mono" style={{ fontSize: 11.5, color: "var(--muted)" }}>
                  {formatDate(e.startDate)} → {formatDate(e.endDate)}
                </span>
              </div>
              <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, fontSize: 13 }}>
                {(
                  [
                    ["Client", displayClient(e)],
                    ["Hiring mgr", e.managerName ?? "—"],
                    ["SOW #", "SOW-2026-0093"],
                    ["PO #", "PO-NB-44218"],
                  ] as [string, string][]
                ).map(([k, v]) => (
                  <div key={k}>
                    <div className="eyebrow" style={{ gap: 0 }}>
                      {k}
                    </div>
                    <div
                      style={{
                        marginTop: 5,
                        fontFamily: k.includes("#") ? "var(--font-mono)" : "inherit",
                        fontSize: k.includes("#") ? 12 : 13,
                      }}
                    >
                      {v}
                    </div>
                  </div>
                ))}
              </div>
              <div className="bar" style={{ marginTop: 18 }}>
                <span style={{ width: "46%" }} />
              </div>
              <div className="between mono" style={{ marginTop: 7, fontSize: 10.5, color: "var(--muted)" }}>
                <span>IN PROGRESS</span>
                <span>{(e.status ?? "—").toUpperCase()}</span>
              </div>
            </div>

            {history.length > 0 && (
              <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: "15px 20px", borderBottom: "1px solid var(--line)" }}>
                  <h3 style={{ fontSize: 17 }}>Placement history</h3>
                </div>
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Title</th>
                      <th>Period</th>
                      <th>Bill rate</th>
                      <th>Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h) => (
                      <tr key={h.id}>
                        <td style={{ fontWeight: 600 }}>{h.clientName}</td>
                        <td>{h.title ?? "—"}</td>
                        <td className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>
                          {formatDate(h.startDate)} → {formatDate(h.endDate)}
                        </td>
                        <td className="num-c">{h.billRate ?? "—"}</td>
                        <td style={{ color: "var(--muted)" }}>{h.reason ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="grid-2" style={{ alignItems: "start" }}>
              <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: "15px 20px", borderBottom: "1px solid var(--line)" }}>
                  <h3 style={{ fontSize: 17 }}>Documents</h3>
                </div>
                <div style={{ padding: "6px 20px 14px" }}>
                  {DOCS.map((d, i) => (
                    <div
                      key={d}
                      className="between"
                      style={{ padding: "11px 0", borderBottom: i < DOCS.length - 1 ? "1px solid var(--line-2)" : 0 }}
                    >
                      <span style={{ fontSize: 13 }}>{d}</span>
                      <button className="link-muted">Download</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: "15px 20px", borderBottom: "1px solid var(--line)" }}>
                  <h3 style={{ fontSize: 17 }}>Recent activity</h3>
                </div>
                <ul className="feed" style={{ padding: "4px 20px 10px" }}>
                  {ACTIVITY.map(([icon, t, s, w], i) => (
                    <li key={i}>
                      <span className="ic">
                        <Icon name={icon} size={15} />
                      </span>
                      <div>
                        <div className="t">{t}</div>
                        <div className="s">{s}</div>
                      </div>
                      <span className="w">{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {endOpen && (
        <div className="modal-bg" onClick={() => !busy && setEndOpen(false)}>
          <div
            className="modal"
            style={{ maxWidth: 460, height: "auto", maxHeight: "90%" }}
            onClick={(ev) => ev.stopPropagation()}
          >
            <div
              className="between"
              style={{ padding: "18px 24px", borderBottom: "1px solid var(--line)" }}
            >
              <div>
                <span className="eyebrow" style={{ gap: 0 }}>
                  Workforce
                </span>
                <h3 style={{ fontSize: 19, marginTop: 4 }}>End engagement</h3>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setEndOpen(false)}
                disabled={busy}
              >
                Close ✕
              </button>
            </div>
            <div className="stack" style={{ padding: 24 }}>
              <p style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.6 }}>
                End <strong>{e.name}</strong>&apos;s placement at{" "}
                <strong>{displayClient(e)}</strong>. They&apos;ll move to{" "}
                <strong>On bench</strong> and the placement will be recorded in
                their history.
              </p>
              <div>
                <label className="field-label">Engagement end date</label>
                <input
                  className="input"
                  type="date"
                  value={endDate}
                  onChange={(ev) => setEndDate(ev.target.value)}
                />
              </div>
              <div>
                <label className="field-label">Reason (optional)</label>
                <textarea
                  className="textarea"
                  rows={3}
                  value={reason}
                  onChange={(ev) => setReason(ev.target.value)}
                />
              </div>
              {actionError && (
                <p className="err" role="alert">
                  {actionError}
                </p>
              )}
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button
                  type="button"
                  className="btn btn-sm btn-dark"
                  onClick={confirmEnd}
                  disabled={busy}
                >
                  {busy ? "Ending…" : "End engagement"}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setEndOpen(false)}
                  disabled={busy}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
