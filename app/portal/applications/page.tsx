"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/portal/Topbar";
import {
  Body,
  Empty,
  Table,
  td,
  StageBadge,
} from "@/components/console/ui";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ApplicationModal } from "@/components/portal/ApplicationModal";
import {
  meApi,
  STAGES,
  appliedAgo,
  type PortalApplication,
} from "@/lib/portal/me-api";
import { cn } from "@/lib/utils";

const ALL = "All stages";

export default function ApplicationsPage() {
  const [apps, setApps] = useState<PortalApplication[] | null>(null);
  const [error, setError] = useState<string>();
  const [selected, setSelected] = useState<PortalApplication | null>(null);
  const [q, setQ] = useState("");
  const [stage, setStage] = useState<string>(ALL);

  function load() {
    setApps(null);
    setError(undefined);
    meApi
      .applications()
      .then(setApps)
      .catch(() => setError("Couldn't load your applications."));
  }

  useEffect(() => {
    load();
  }, []);

  const active =
    apps?.filter((a) => a.stage !== "Rejected" && a.stage !== "Hired").length ??
    0;
  const rows =
    apps?.filter(
      (a) =>
        (stage === ALL || a.stage === stage) &&
        (q === "" ||
          (a.jobTitle + (a.jobClientName ?? "") + a.skills.join(" "))
            .toLowerCase()
            .includes(q.toLowerCase())),
    ) ?? [];

  return (
    <>
      <Topbar
        kicker="My career"
        title="My applications"
        sub={
          apps === null
            ? "Loading your applications…"
            : `${apps.length} application${apps.length === 1 ? "" : "s"} · ${active} active`
        }
        actions={
          <Button asChild variant="navy">
            <Link href="/portal/roles">Browse open roles</Link>
          </Button>
        }
      />
      <Body>
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
        ) : apps === null ? (
          <p className="text-center text-sm text-muted-foreground">Loading…</p>
        ) : apps.length === 0 ? (
          <Empty title="No applications yet">
            When you apply to an open role it shows up here, and you can track
            it through every stage of the pipeline.
          </Empty>
        ) : (
          <>
            <div className="flex flex-wrap gap-3">
              <Input
                className="max-w-xs"
                placeholder="Search your applications…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <select
                className="h-9 rounded-md border border-input bg-card px-3 text-sm"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
              >
                <option>{ALL}</option>
                {STAGES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            {rows.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">
                No applications match that filter.
              </p>
            ) : (
              <Table
                head={["Role · Client", "Stage", "Match", "Applied", "Reference"]}
              >
                {rows.map((a) => (
                  <tr
                    key={a.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelected(a)}
                  >
                    <td className={td}>
                      <p className="font-medium text-navy">{a.jobTitle}</p>
                      <p className="text-xs text-muted-foreground">
                        {a.jobClientName ?? "Technograph"}
                      </p>
                    </td>
                    <td className={td}>
                      <StageBadge stage={a.stage} />
                    </td>
                    <td className={td}>
                      {a.matchPct != null ? `${a.matchPct}%` : "—"}
                    </td>
                    <td className={td}>{appliedAgo(a.appliedAt)}</td>
                    <td className={cn(td, "font-mono text-xs")}>
                      {a.applicationCode}
                    </td>
                  </tr>
                ))}
              </Table>
            )}
          </>
        )}
      </Body>

      {selected && (
        <ApplicationModal
          application={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
