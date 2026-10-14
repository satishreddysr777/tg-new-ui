"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Users, Clock, Briefcase } from "lucide-react";
import { Topbar } from "@/components/portal/Topbar";
import { Body, Tile, Panel, StageBadge } from "@/components/console/ui";
import { Button } from "@/components/ui/button";
import { employeesApi } from "@/lib/employer/employees-api";
import { employerApi } from "@/lib/employer/invites-api";
import { jobsApi } from "@/lib/employer/jobs-api";
import {
  applicationsApi,
  STAGES,
  type Stage,
} from "@/lib/employer/applications-api";

function greetingFor(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function EmployerDashboard() {
  const [firstName, setFirstName] = useState("");
  const [employeeTotal, setEmployeeTotal] = useState(0);
  const [active, setActive] = useState(0);
  const [onboarding, setOnboarding] = useState(0);
  const [jobsTotal, setJobsTotal] = useState(0);
  const [jobsOpen, setJobsOpen] = useState(0);
  const [stageCounts, setStageCounts] = useState<Record<Stage, number>>(() =>
    Object.fromEntries(STAGES.map((s) => [s, 0])) as Record<Stage, number>,
  );

  useEffect(() => {
    employerApi
      .me()
      .then((u) => setFirstName(u.name.split(" ")[0] ?? ""))
      .catch(() => setFirstName(""));

    employeesApi
      .list()
      .then((rows) => {
        setEmployeeTotal(rows.length);
        setActive(rows.filter((e) => e.status === "Active").length);
        setOnboarding(rows.filter((e) => e.status === "Onboarding").length);
      })
      .catch(() => {
        setEmployeeTotal(0);
        setActive(0);
        setOnboarding(0);
      });

    jobsApi
      .list()
      .then(async (rows) => {
        setJobsTotal(rows.length);
        setJobsOpen(rows.filter((j) => j.status === "Published").length);
        const lists = await Promise.all(
          rows.map((j) =>
            applicationsApi.listByJob(j.jobCode).catch(() => [] as const),
          ),
        );
        const all = lists.flat();
        const counts = Object.fromEntries(
          STAGES.map((s) => [s, all.filter((a) => a.stage === s).length]),
        ) as Record<Stage, number>;
        setStageCounts(counts);
      })
      .catch(() => {
        setJobsTotal(0);
        setJobsOpen(0);
        setStageCounts(
          Object.fromEntries(STAGES.map((s) => [s, 0])) as Record<Stage, number>,
        );
      });
  }, []);

  const now = new Date();
  const kicker = now
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    .replace(",", " ·");

  return (
    <>
      <Topbar
        kicker={kicker}
        title={`${greetingFor(now.getHours())}${firstName ? `, ${firstName}` : ""}.`}
        sub="Here's where the workforce and hiring pipeline stand today."
        actions={
          <Button asChild variant="navy">
            <Link href="/employer/jobs/new">Create job</Link>
          </Button>
        }
      />
      <Body>
        <div className="grid gap-4 md:grid-cols-3">
          <Tile
            to="/employer/employees"
            icon={<Users className="h-4 w-4" />}
            label="Employees"
            big={`${employeeTotal} on payroll`}
            small={`${active} active · ${onboarding} onboarding`}
          />
          <Tile
            to="/employer/timesheets"
            icon={<Clock className="h-4 w-4" />}
            label="Timesheets"
            big="Coming soon"
            small="Not yet available"
          />
          <Tile
            to="/employer/jobs"
            icon={<Briefcase className="h-4 w-4" />}
            label="Open jobs"
            big={`${jobsOpen} open`}
            small={`${jobsTotal} requisition${jobsTotal === 1 ? "" : "s"} total`}
          />
        </div>
        <Panel title="Hiring pipeline">
          <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
            {STAGES.map((s) => (
              <div key={s} className="rounded-md border p-4">
                <StageBadge stage={s} />
                <p className="mt-3 text-2xl font-semibold text-navy">{stageCounts[s]}</p>
              </div>
            ))}
          </div>
        </Panel>
      </Body>
    </>
  );
}
