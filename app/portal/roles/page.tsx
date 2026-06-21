"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/portal/Topbar";
import { Icon } from "@/components/portal/icons";
import { RoleModal } from "@/components/portal/RoleModal";
import { meApi, type PortalRole } from "@/lib/portal/me-api";
import { formatComp, postedAgo } from "@/lib/portal/format";

const matchTone = (pct: number) =>
  pct >= 67 ? "tag-ok" : pct >= 34 ? "tag-copper" : "tag";

export default function RolesPage() {
  const [roles, setRoles] = useState<PortalRole[] | null>(null);
  const [error, setError] = useState<string>();
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<PortalRole | null>(null);

  function load() {
    setRoles(null);
    setError(undefined);
    meApi
      .roles()
      .then(setRoles)
      .catch(() => setError("Couldn't load open roles."));
  }

  useEffect(() => {
    load();
  }, []);

  // Reflect an apply without a refetch.
  function markApplied(jobCode: string) {
    setRoles((prev) =>
      prev ? prev.map((r) => (r.jobCode === jobCode ? { ...r, applied: true } : r)) : prev,
    );
    setSelected((s) => (s && s.jobCode === jobCode ? { ...s, applied: true } : s));
  }

  const filtered =
    roles?.filter(
      (r) =>
        q === "" ||
        (r.title + (r.clientName ?? "") + r.stack.join(" "))
          .toLowerCase()
          .includes(q.toLowerCase()),
    ) ?? [];

  const open = roles?.filter((r) => !r.applied).length ?? 0;

  return (
    <>
      <Topbar
        kicker="My career"
        title="Open roles"
        sub={
          roles === null
            ? "Loading roles…"
            : `${open} role${open === 1 ? "" : "s"} open · matched to your stack`
        }
        actions={
          <div className="search" style={{ width: 260 }}>
            <Icon name="search" size={16} />
            <input
              className="input"
              placeholder="Search roles…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
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
        ) : roles === null ? (
          <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
            Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <span className="ic">
              <Icon name="bolt" size={22} />
            </span>
            <h3>No open roles right now</h3>
            <p style={{ maxWidth: 420, margin: "8px auto 0" }}>
              {roles.length === 0
                ? "There are no published roles at the moment. Check back soon."
                : "No roles match that search."}
            </p>
          </div>
        ) : (
          <div className="grid-3">
            {filtered.map((r) => (
              <button
                key={r.jobCode}
                className="card"
                onClick={() => setSelected(r)}
                style={{ textAlign: "left", cursor: "pointer", display: "flex", flexDirection: "column", gap: 12 }}
              >
                <div className="between" style={{ alignItems: "flex-start" }}>
                  <span className="mono" style={{ fontSize: 10.5, color: "var(--muted-2)" }}>
                    {r.jobCode}
                  </span>
                  {r.applied ? (
                    <span className="tag tag-ok">Applied ✓</span>
                  ) : (
                    <span className={"tag " + matchTone(r.matchPct)}>{r.matchPct}% match</span>
                  )}
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 17, letterSpacing: "-0.01em" }}>
                    {r.title}
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 3 }}>
                    {[r.clientName, r.location].filter(Boolean).join(" · ") || "—"}
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {r.engagementType && <span className="tag">{r.engagementType}</span>}
                  <span className="tag">{formatComp(r)}</span>
                </div>
                {r.stack.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {r.stack.slice(0, 4).map((s) => (
                      <span key={s} className="tag tag-copper" style={{ fontSize: 10.5 }}>
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                <div className="between" style={{ marginTop: "auto", paddingTop: 4 }}>
                  <span className="mono" style={{ fontSize: 10, color: "var(--muted-2)", textTransform: "uppercase" }}>
                    {postedAgo(r.createdAt)}
                  </span>
                  <span className="link" style={{ fontSize: 12.5 }}>
                    {r.applied ? "View" : "View & apply"} →
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <RoleModal
          role={selected}
          onClose={() => setSelected(null)}
          onApplied={() => markApplied(selected.jobCode)}
        />
      )}
    </>
  );
}
