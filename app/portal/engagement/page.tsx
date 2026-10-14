"use client";

import Link from "next/link";
import { Topbar } from "@/components/portal/Topbar";
import { Body, Panel, Facts, Chip, Empty } from "@/components/console/ui";
import { Button } from "@/components/ui/button";
import { useMe } from "@/lib/portal/me-context";
import { engagementProgress, fmtDate } from "@/lib/portal/format";

export default function EngagementPage() {
  const me = useMe();
  const prog = engagementProgress(me.startDate, me.endDate);
  const onBench = !me.clientName || me.status === "On bench";

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
      <Body>
        {onBench ? (
          <Empty title="No active engagement">
            You&apos;re between placements. Browse open roles to line up your
            next engagement with the Technograph talent team.
            <div className="mt-5">
              <Button asChild variant="navy">
                <Link href="/portal/roles">Browse open roles</Link>
              </Button>
            </div>
          </Empty>
        ) : (
          <>
            {prog && (
              <div className="rounded-lg bg-navy-gradient p-6 text-navy-foreground shadow-float">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-mono text-xs tracking-widest text-teal">
                    WEEK {prog.week} / {prog.total}
                  </p>
                  <p className="font-mono text-xs text-navy-muted">
                    {fmtDate(me.startDate)} → {fmtDate(me.endDate)}
                  </p>
                </div>
                <h2 className="mt-4 text-2xl font-semibold">{me.clientName}</h2>
                <p className="text-navy-muted">{me.title}</p>
                <div className="mt-6 h-2 overflow-hidden rounded-full bg-navy-foreground/15">
                  <div
                    className="h-full rounded-full bg-teal"
                    style={{ width: `${prog.pct}%` }}
                  />
                </div>
                <div className="mt-3 flex justify-between font-mono text-xs text-navy-muted">
                  <span>{prog.remaining} WEEKS REMAINING</span>
                  <span>{prog.pct}% COMPLETE</span>
                </div>
              </div>
            )}
            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <Panel title="Engagement details">
                <Facts
                  cols={3}
                  items={[
                    ["Client", me.clientName ?? "—"],
                    ["Role", me.title ?? "—"],
                    ["Employment type", me.employmentType ?? "—"],
                    ["Talent manager", me.managerName ?? "—"],
                    ["Pay rate", me.payRate ?? "—"],
                    ["Location", me.location ?? "—"],
                    ["Start date", fmtDate(me.startDate)],
                    ["End date", fmtDate(me.endDate)],
                  ]}
                />
              </Panel>
              <Panel title="Skills profile">
                <div className="flex flex-wrap gap-1.5">
                  {me.stack.length
                    ? me.stack.map((s) => <Chip key={s}>{s}</Chip>)
                    : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                </div>
              </Panel>
            </div>
          </>
        )}
      </Body>
    </>
  );
}
