"use client";

import { Topbar } from "@/components/portal/Topbar";
import { useMe } from "@/lib/portal/me-context";
import { engagementProgress, fmtDate } from "@/lib/portal/format";

export default function EngagementPage() {
  const me = useMe();
  const prog = engagementProgress(me.startDate, me.endDate);
  const onBench = !me.clientName || me.status === "On bench";

  const facts: [string, string][] = [
    ["Client", me.clientName ?? "—"],
    ["Role", me.title ?? "—"],
    ["Employment", me.employmentType ?? "—"],
    ["Talent manager", me.managerName ?? "—"],
    ["Location", me.location ?? "—"],
    ["Pay rate", me.payRate ?? "—"],
    ["Start date", fmtDate(me.startDate)],
    ["End date", fmtDate(me.endDate)],
  ];

  return (
    <>
      <Topbar
        kicker={`My work · ${me.employeeCode ?? "Employee"}`}
        title="My engagement"
        sub={
          onBench
            ? "You're currently on the bench"
            : `${me.title ?? "Engineer"} · ${me.clientName}`
        }
      />
      <div className="content">
        {onBench ? (
          <div className="empty" style={{ maxWidth: 560, margin: "0 auto" }}>
            <span className="ic">
              <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16M4 8h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2z" />
              </svg>
            </span>
            <h3>No active engagement</h3>
            <p style={{ maxWidth: 420, margin: "8px auto 0" }}>
              You&apos;re between placements. Browse open roles to line up your
              next engagement with the Technograph talent team.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 18, alignItems: "start" }}>
            {/* overview card */}
            <div className="card">
              <div className="between" style={{ alignItems: "center" }}>
                <span className="mono" style={{ fontSize: 11.5, color: "var(--muted)" }}>
                  {me.employeeCode ?? "—"}
                </span>
                <span className="tag tag-ok">{me.status ?? "Active"}</span>
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
              {me.stack.length > 0 && (
                <>
                  <div className="rule" style={{ margin: "16px 0" }} />
                  <span className="eyebrow">
                    <span className="tick" />
                    Skills profile
                  </span>
                  <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {me.stack.map((s) => (
                      <span key={s} className="tag tag-copper">
                        {s}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* timeline + details */}
            <div className="stack">
              <div className="card card-dark">
                <div className="between">
                  <span className="eyebrow" style={{ color: "var(--copper)" }}>
                    Current engagement
                  </span>
                  {prog && (
                    <span className="mono" style={{ fontSize: 10.5, color: "var(--on-dark-2)" }}>
                      WEEK {prog.week} / {prog.total}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 22,
                    marginTop: 12,
                    color: "var(--cream)",
                  }}
                >
                  {me.clientName}
                </div>
                <div style={{ fontSize: 13, color: "var(--on-dark)", marginTop: 3 }}>
                  {me.title} · {fmtDate(me.startDate)} → {fmtDate(me.endDate)}
                </div>
                {prog && (
                  <>
                    <div className="bar" style={{ marginTop: 16, background: "rgba(244,242,236,0.14)" }}>
                      <span style={{ width: prog.pct + "%" }} />
                    </div>
                    <div className="between mono" style={{ marginTop: 8, fontSize: 10.5, color: "var(--on-dark-2)" }}>
                      <span>{prog.remaining} WEEKS REMAINING</span>
                      <span>{prog.pct}% COMPLETE</span>
                    </div>
                  </>
                )}
              </div>

              <div className="card">
                <span className="eyebrow">
                  <span className="tick" />
                  Engagement details
                </span>
                <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, fontSize: 13 }}>
                  <Detail label="Client" value={me.clientName ?? "—"} />
                  <Detail label="Role" value={me.title ?? "—"} />
                  <Detail label="Employment type" value={me.employmentType ?? "—"} />
                  <Detail label="Talent manager" value={me.managerName ?? "—"} />
                  <Detail label="Pay rate" value={me.payRate ?? "—"} />
                  <Detail label="Location" value={me.location ?? "—"} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="eyebrow" style={{ gap: 0 }}>{label}</div>
      <div style={{ fontWeight: 600, marginTop: 5 }}>{value}</div>
    </div>
  );
}
