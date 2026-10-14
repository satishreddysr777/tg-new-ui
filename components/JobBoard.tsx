"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { careersApi, type PublicJob } from "@/lib/careers-api";
import { SectionHead } from "@/components/site/SiteShell";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function JobBoard() {
  const [jobs, setJobs] = useState<PublicJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [dept, setDept] = useState("All");
  const [q, setQ] = useState("");

  useEffect(() => {
    careersApi
      .listJobs()
      .then(setJobs)
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  const depts = useMemo(() => {
    const set = new Set(
      jobs.map((j) => j.department).filter((d): d is string => Boolean(d)),
    );
    return ["All", ...Array.from(set).sort()];
  }, [jobs]);

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return jobs.filter((j) => {
      const matchDept = dept === "All" || j.department === dept;
      const hay = `${j.title} ${j.department ?? ""} ${j.location ?? ""} ${j.engagementType ?? ""}`;
      return matchDept && (!query || hay.toLowerCase().includes(query));
    });
  }, [jobs, dept, q]);

  const countLabel = loading
    ? "Loading…"
    : `${list.length} open role${list.length === 1 ? "" : "s"}`;

  return (
    <section id="openings" className="scroll-mt-20 border-y bg-card py-24">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHead eyebrow="Open roles" title="Find your next role." />
          <p className="font-mono text-sm text-muted-foreground">{countLabel}</p>
        </div>
        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {depts.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDept(d)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium",
                  dept === d
                    ? "border-navy bg-navy text-navy-foreground"
                    : "bg-background hover:bg-muted",
                )}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="relative md:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Search roles"
              placeholder="Search roles"
              className="pl-9"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-8 divide-y rounded-lg border bg-background">
          {!loading && jobs.length === 0 ? (
            <p className="p-10 text-center text-muted-foreground">
              No open roles right now. Check back soon — or send us your résumé below.
            </p>
          ) : !loading && list.length === 0 ? (
            <p className="p-10 text-center text-muted-foreground">
              No roles match that search. Try a different keyword.
            </p>
          ) : (
            list.map((j) => (
              <Link
                key={j.jobCode}
                href={`/careers/${j.jobCode}`}
                className="group grid items-center gap-2 p-6 transition-colors hover:bg-muted/50 md:grid-cols-[2fr_1fr_1fr_1fr_auto] md:gap-6"
              >
                <span className="font-semibold text-navy group-hover:text-primary">
                  {j.title}
                </span>
                <span className="text-sm text-muted-foreground">{j.department ?? "—"}</span>
                <span className="text-sm text-muted-foreground">{j.location ?? "—"}</span>
                <span className="text-sm text-muted-foreground">
                  {j.engagementType ?? "—"}
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Apply <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
