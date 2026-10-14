"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Topbar } from "@/components/portal/Topbar";
import {
  Body,
  Panel,
  Facts,
  Chip,
  Empty,
  StatusBadge,
} from "@/components/console/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { jobsApi, type Job } from "@/lib/employer/jobs-api";
import {
  applicationsApi,
  STAGES,
  type Application,
  type Stage,
} from "@/lib/employer/applications-api";
import { formatJobComp, postedAgo } from "@/lib/employer/job-format";
import { CandidateModal } from "@/components/employer/CandidateModal";
import { AddCandidateModal } from "@/components/employer/AddCandidateModal";
import { cn } from "@/lib/utils";

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const [j, setJ] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<"notfound" | "error">();

  const [apps, setApps] = useState<Application[]>([]);
  const [q, setQ] = useState("");
  const [source, setSource] = useState("All sources");
  const [selected, setSelected] = useState<Application | null>(null);
  const [adding, setAdding] = useState(false);

  const loadApps = useCallback(() => {
    applicationsApi
      .listByJob(params.id)
      .then(setApps)
      .catch(() => setApps([]));
  }, [params.id]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    jobsApi
      .get(params.id)
      .then((job) => {
        if (!active) return;
        setJ(job);
        loadApps();
      })
      .catch((err) =>
        active && setError(err?.status === 404 ? "notfound" : "error"),
      )
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [params.id, loadApps]);

  const [pubBusy, setPubBusy] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<Stage | null>(null);

  function upsert(a: Application) {
    setApps((prev) => {
      const i = prev.findIndex((x) => x.id === a.id);
      if (i === -1) return [...prev, a];
      const next = [...prev];
      next[i] = a;
      return next;
    });
    setSelected((s) => (s && s.id === a.id ? a : s));
  }

  async function moveStage(id: string, stage: Stage) {
    const a = apps.find((x) => x.id === id);
    if (!a || a.stage === stage) return;
    upsert({ ...a, stage });
    try {
      const updated = await applicationsApi.updateStage(id, stage);
      upsert(updated);
    } catch {
      loadApps();
    }
  }

  async function togglePublish() {
    if (!j) return;
    const next = j.status === "Published" ? "Draft" : "Published";
    setPubBusy(true);
    try {
      const updated = await jobsApi.update(j.jobCode, { status: next });
      setJ(updated);
    } catch {
      /* keep state */
    } finally {
      setPubBusy(false);
    }
  }

  if (loading) {
    return (
      <>
        <Topbar kicker="Hiring" title="Job" />
        <Body>
          <p className="text-center text-sm text-muted-foreground">Loading…</p>
        </Body>
      </>
    );
  }

  if (error || !j) {
    return (
      <>
        <Topbar kicker="Hiring" title="Job not found" />
        <Body>
          <Empty title={error === "notfound" ? "Job not found" : "Couldn't load job"}>
            <div className="mt-4">
              <Button asChild variant="navy">
                <Link href="/employer/jobs">Back to jobs</Link>
              </Button>
            </div>
          </Empty>
        </Body>
      </>
    );
  }

  const sources = [
    "All sources",
    ...Array.from(new Set(apps.map((a) => a.source).filter(Boolean))),
  ] as string[];

  const filtered = apps.filter(
    (a) =>
      (source === "All sources" || a.source === source) &&
      (q === "" ||
        (a.name + a.skills.join(" "))
          .toLowerCase()
          .includes(q.toLowerCase())),
  );

  const compLine = `${formatJobComp(j)}${j.compType ? ` · ${j.compType}` : ""}`;

  return (
    <>
      <Topbar
        kicker={`Hiring · ${j.jobCode}`}
        title={
          <span className="flex flex-wrap items-center gap-3">
            {j.title}
            <StatusBadge status={j.status} />
          </span>
        }
        sub={[j.clientName, j.location].filter(Boolean).join(" · ") || "—"}
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/employer/jobs">← Jobs</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/employer/jobs/new?edit=${j.jobCode}`}>Edit job</Link>
            </Button>
            <Button variant="outline" onClick={togglePublish} disabled={pubBusy}>
              {pubBusy
                ? "Saving…"
                : j.status === "Published"
                  ? "Unpublish"
                  : "Publish"}
            </Button>
            <Button variant="navy" onClick={() => setAdding(true)}>
              Add candidate
            </Button>
          </>
        }
      />
      <Body>
        <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
          <Panel title="Overview">
            <Facts
              items={[
                ["Client", j.clientName ?? "—"],
                ["Department", j.department ?? "—"],
                ["Engagement", j.engagementType ?? "—"],
                ["Location", j.location ?? "—"],
                ["Headcount", String(j.headcount)],
                ["Compensation", compLine],
                ["Hiring manager", j.hiringManager ?? "—"],
                ["Posted", postedAgo(j.createdAt)],
              ]}
            />
          </Panel>
          <Panel>
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-navy">Summary</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {j.summary || "No summary provided."}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-navy">Responsibilities</h3>
                {j.responsibilities ? (
                  <ul className="mt-1 list-disc pl-5 text-sm text-muted-foreground">
                    {j.responsibilities.split("\n").map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">
                    No responsibilities listed.
                  </p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-navy">Required stack</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {j.stack.length ? (
                    j.stack.map((s) => <Chip key={s}>{s}</Chip>)
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </div>
              </div>
            </div>
          </Panel>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold text-navy">
            Job applications · {apps.length}
          </h2>
          <div className="flex gap-2">
            <Input
              className="w-56"
              placeholder="Search candidates…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <select
              className="h-9 rounded-md border border-input bg-card px-3 text-sm"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            >
              {sources.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {apps.length === 0 ? (
          <Empty title="No applications yet">
            Click <strong>Add candidate</strong> to add one to{" "}
            <strong>{j.title}</strong>.
          </Empty>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {STAGES.map((st) => {
              const cards = filtered.filter((a) => a.stage === st);
              return (
                <div
                  key={st}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(st);
                  }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={() => {
                    if (dragId) moveStage(dragId, st);
                    setDragId(null);
                    setDragOver(null);
                  }}
                  className={cn(
                    "min-h-48 w-52 shrink-0 rounded-lg border bg-muted/50 p-2 transition-colors xl:w-auto xl:flex-1 xl:min-w-0",
                    dragOver === st && "border-primary bg-accent",
                  )}
                >
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <span className="font-mono text-[0.68rem] uppercase tracking-widest text-muted-foreground">
                      {st}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {cards.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {cards.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        draggable
                        onDragStart={() => setDragId(a.id)}
                        onDragEnd={() => {
                          setDragId(null);
                          setDragOver(null);
                        }}
                        onClick={() => setSelected(a)}
                        className={cn(
                          "w-full cursor-grab rounded-md border bg-card p-3 text-left shadow-card hover:border-primary/40 active:cursor-grabbing",
                          dragId === a.id && "opacity-50",
                        )}
                      >
                        <p className="text-sm font-medium text-navy">{a.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {a.source ?? "—"}
                          {a.matchPct != null ? ` · ${a.matchPct}%` : ""}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Body>

      {selected && (
        <CandidateModal
          application={selected}
          jobTitle={j.title}
          onClose={() => setSelected(null)}
          onUpdated={upsert}
        />
      )}
      {adding && (
        <AddCandidateModal
          jobIdOrCode={params.id}
          onClose={() => setAdding(false)}
          onCreated={(a) => {
            upsert(a);
            setAdding(false);
          }}
        />
      )}
    </>
  );
}
