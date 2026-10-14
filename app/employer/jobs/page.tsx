"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/portal/Topbar";
import { Body, Table, td, StatusBadge } from "@/components/console/ui";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { jobsApi, type Job } from "@/lib/employer/jobs-api";
import { formatJobComp, postedAgo } from "@/lib/employer/job-format";

const DEPARTMENTS = ["All departments", "Cloud", "Data", "Engineering", "Security", "Digital"];

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All departments");

  function load() {
    setLoading(true);
    jobsApi
      .list()
      .then((rows) => {
        setJobs(rows);
        setError(undefined);
      })
      .catch(() => setError("Couldn't load jobs."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  const list = jobs.filter(
    (j) =>
      (dept === "All departments" || j.department === dept) &&
      (q === "" ||
        (j.title + (j.clientName ?? "") + j.jobCode)
          .toLowerCase()
          .includes(q.toLowerCase())),
  );

  const pub = jobs.filter((j) => j.status === "Published").length;

  return (
    <>
      <Topbar
        kicker="Hiring · Pipeline"
        title="Jobs"
        sub={
          loading
            ? "Loading jobs…"
            : `${jobs.length} job${jobs.length === 1 ? "" : "s"} · ${pub} published · ${jobs.length - pub} draft`
        }
        actions={
          <Button asChild variant="navy">
            <Link href="/employer/jobs/new">Create job</Link>
          </Button>
        }
      />
      <Body>
        <div className="flex flex-wrap gap-3">
          <Input
            className="max-w-xs"
            placeholder="Search jobs…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="h-9 rounded-md border border-input bg-card px-3 text-sm"
            value={dept}
            onChange={(e) => setDept(e.target.value)}
          >
            {DEPARTMENTS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
        {error ? (
          <p className="text-center text-muted-foreground">
            {error}{" "}
            <button type="button" className="text-primary underline" onClick={load}>
              Retry
            </button>
          </p>
        ) : loading ? (
          <p className="text-center text-muted-foreground">Loading…</p>
        ) : (
          <Table
            head={[
              "Job · Client",
              "Engagement",
              "Comp",
              "Department",
              "Status",
              "Owner",
              "Posted",
            ]}
          >
            {list.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  {jobs.length
                    ? "No jobs match that filter."
                    : "No jobs yet. Click Create job to add one."}
                </td>
              </tr>
            ) : (
              list.map((j) => (
                <tr
                  key={j.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/employer/jobs/${j.jobCode}`)}
                >
                  <td className={td}>
                    <p className="font-medium text-navy">{j.title}</p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-mono">{j.jobCode}</span>
                      {j.clientName ? ` · ${j.clientName}` : ""}
                    </p>
                  </td>
                  <td className={td}>{j.engagementType ?? "—"}</td>
                  <td className={td}>{formatJobComp(j)}</td>
                  <td className={td}>{j.department ?? "—"}</td>
                  <td className={td}>
                    <StatusBadge status={j.status} />
                  </td>
                  <td className={td}>{j.hiringManager ?? "—"}</td>
                  <td className={td}>{postedAgo(j.createdAt)}</td>
                </tr>
              ))
            )}
          </Table>
        )}
      </Body>
    </>
  );
}
