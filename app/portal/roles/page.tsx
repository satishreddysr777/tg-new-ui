"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Topbar } from "@/components/portal/Topbar";
import { Body, Chip, Empty } from "@/components/console/ui";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RoleModal } from "@/components/portal/RoleModal";
import { meApi, type PortalRole } from "@/lib/portal/me-api";
import { formatComp, postedAgo } from "@/lib/portal/format";

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

  function markApplied(jobCode: string) {
    setRoles((prev) =>
      prev
        ? prev.map((r) => (r.jobCode === jobCode ? { ...r, applied: true } : r))
        : prev,
    );
    setSelected((s) =>
      s && s.jobCode === jobCode ? { ...s, applied: true } : s,
    );
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
      />
      <Body>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search roles…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        {error ? (
          <p className="text-center text-sm text-muted-foreground">
            {error}{" "}
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={load}
            >
              Retry
            </button>
          </p>
        ) : roles === null ? (
          <p className="text-center text-sm text-muted-foreground">Loading…</p>
        ) : roles.length === 0 ? (
          <Empty title="No open roles right now">
            There are no published roles at the moment. Check back soon.
          </Empty>
        ) : filtered.length === 0 ? (
          <Empty title="No roles match that search.">
            Try a different keyword.
          </Empty>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((r) => (
              <article
                key={r.jobCode}
                className="flex flex-col rounded-lg border bg-card p-5 shadow-card"
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-muted-foreground">{r.jobCode}</span>
                  {r.applied ? (
                    <span className="text-success">Applied ✓</span>
                  ) : (
                    <span className="text-primary">{r.matchPct}% match</span>
                  )}
                </div>
                <h3 className="mt-3 font-semibold text-navy">{r.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {[r.clientName, r.location].filter(Boolean).join(" · ") || "—"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {[r.engagementType, formatComp(r)].filter(Boolean).join(" · ")}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {r.stack.slice(0, 4).map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </div>
                <div className="mt-auto flex items-center justify-between pt-5">
                  <span className="text-xs text-muted-foreground">
                    Posted {postedAgo(r.createdAt)}
                  </span>
                  <Button
                    size="sm"
                    variant={r.applied ? "outline" : "navy"}
                    onClick={() => setSelected(r)}
                  >
                    {r.applied ? "View →" : "View & apply →"}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </Body>

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
