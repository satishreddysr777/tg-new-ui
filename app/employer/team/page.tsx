"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Topbar } from "@/components/portal/Topbar";
import { Body, Tile, Table, td, StatusBadge } from "@/components/console/ui";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/auth-api";
import { employerApi, type Invite } from "@/lib/employer/invites-api";

const roleLabel: Record<string, string> = {
  EMPLOYEE: "Employee",
  EMPLOYER: "Talent team",
  ADMIN: "Admin",
};

function formatExpires(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function TeamPage() {
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
      /* ignore */
    }
  }

  const c = (s: Invite["status"]) => invites.filter((i) => i.status === s).length;

  return (
    <>
      <Topbar
        kicker="Admin · Onboarding"
        title="Team & invites"
        sub="Invite employees and staff. Each onboarding link is single-use and expires."
        actions={
          <Button asChild variant="navy">
            <Link href="/employer/employees/new">Invite people</Link>
          </Button>
        }
      />
      <Body>
        <div className="grid gap-4 md:grid-cols-3">
          <Tile label="Pending" big={c("PENDING")} small="Awaiting onboarding" />
          <Tile label="Accepted" big={c("ACCEPTED")} small="Joined via invite" />
          <Tile label="Total invites" big={invites.length} small="All time" />
        </div>
        {error ? (
          <p className="text-center text-muted-foreground">{error}</p>
        ) : loading ? (
          <p className="text-center text-muted-foreground">Loading…</p>
        ) : (
          <Table head={["Invitee", "Role", "Status", "Expires", ""]}>
            {invites.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  No invites yet. Click Invite people to onboard someone.
                </td>
              </tr>
            ) : (
              invites.map((inv) => (
                <tr key={inv.id}>
                  <td className={td}>
                    <p className="font-medium text-navy">{inv.name ?? inv.email}</p>
                    {inv.name && (
                      <p className="text-xs text-muted-foreground">{inv.email}</p>
                    )}
                  </td>
                  <td className={td}>{roleLabel[inv.role] ?? inv.role}</td>
                  <td className={td}>
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className={td}>{formatExpires(inv.expiresAt)}</td>
                  <td className={td + " text-right"}>
                    {inv.status === "PENDING" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => revoke(inv.id)}
                      >
                        Revoke
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </Table>
        )}
      </Body>
    </>
  );
}
