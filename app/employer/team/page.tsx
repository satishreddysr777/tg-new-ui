"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/portal/Topbar";
import { Icon, initials } from "@/components/portal/icons";
import { ApiError } from "@/lib/auth-api";
import { employerApi, type Invite } from "@/lib/employer/invites-api";

const statusTag = (s: Invite["status"]) =>
  s === "ACCEPTED" ? "tag tag-ok" : s === "REVOKED" ? "tag tag-bad" : "tag tag-warn";

const roleLabel: Record<string, string> = {
  EMPLOYEE: "Employee",
  EMPLOYER: "Talent team",
  ADMIN: "Admin",
};

export default function TeamPage() {
  const router = useRouter();
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const load = useCallback(() => {
    setLoading(true);
    employerApi
      .listInvites()
      .then((rows) => {
        setInvites(rows);
        setError(undefined);
      })
      .catch((err) => {
        setError(
          err instanceof ApiError && err.status === 403
            ? "Only an admin can manage invites."
            : "Couldn't load invites.",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function revoke(id: string) {
    try {
      await employerApi.revokeInvite(id);
      load();
    } catch {
      // Surface via reload; ignore here.
    }
  }

  const pending = invites.filter((i) => i.status === "PENDING").length;
  const accepted = invites.filter((i) => i.status === "ACCEPTED").length;

  const KPIS: [string, string, string][] = [
    ["Pending", String(pending), "Awaiting onboarding"],
    ["Accepted", String(accepted), "Joined via invite"],
    ["Total invites", String(invites.length), "All time"],
  ];

  return (
    <>
      <Topbar
        kicker="Admin · Onboarding"
        title="Team & invites"
        sub="Invite employees and staff. Each onboarding link is single-use and expires."
        actions={
          <button
            className="btn btn-sm"
            onClick={() => router.push("/employer/employees/new")}
          >
            <Icon name="plus" size={15} /> Invite people
          </button>
        }
      />
      <div className="content">
        <div className="grid-3" style={{ marginBottom: 18 }}>
          {KPIS.map(([l, n, f]) => (
            <div key={l} className="card kpi">
              <div className="lbl">{l}</div>
              <div className="num">{n}</div>
              <div className="foot">{f.toUpperCase()}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div
            className="between"
            style={{ padding: "15px 20px", borderBottom: "1px solid var(--line)" }}
          >
            <h3 style={{ fontSize: 17 }}>Invites</h3>
          </div>

          {error ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
              {error}
            </div>
          ) : loading ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
              Loading…
            </div>
          ) : invites.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
              No invites yet. Click <strong>Invite people</strong> to onboard someone.
            </div>
          ) : (
            <table className="tbl">
              <thead>
                <tr>
                  <th>Invitee</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Expires</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {invites.map((inv) => (
                  <tr key={inv.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                        <span className="av av-sm">
                          {initials(inv.name ?? inv.email)}
                        </span>
                        <div>
                          <div style={{ fontWeight: 600 }}>
                            {inv.name ?? inv.email}
                          </div>
                          <div
                            className="mono"
                            style={{ fontSize: 10.5, color: "var(--muted)" }}
                          >
                            {inv.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{roleLabel[inv.role] ?? inv.role}</td>
                    <td>
                      <span className={statusTag(inv.status)}>
                        {inv.status.charAt(0) + inv.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td
                      className="num-c"
                      style={{ fontSize: 12, color: "var(--muted)" }}
                    >
                      {new Date(inv.expiresAt).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      {inv.status === "PENDING" && (
                        <button
                          className="link-muted"
                          style={{ color: "var(--bad)", borderColor: "transparent" }}
                          onClick={() => revoke(inv.id)}
                        >
                          Revoke
                        </button>
                      )}
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
