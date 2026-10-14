"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Topbar } from "@/components/portal/Topbar";
import { Body, Panel, Segmented, TagInput } from "@/components/console/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/auth-api";
import {
  employerApi,
  type ClientRow,
  type Manager,
} from "@/lib/employer/invites-api";
import { jobsApi, type JobStatus } from "@/lib/employer/jobs-api";
import { formatJobComp } from "@/lib/employer/job-format";

const DEPARTMENTS = ["Cloud", "Data", "Engineering", "Security", "Digital"];
const ENGAGEMENTS = ["Direct hire", "Contract"] as const;
const COMP_TYPES = ["Yearly", "Hourly"] as const;

const sel = "h-9 w-full rounded-md border border-input bg-background px-3 text-sm";

function CreateJobForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editCode = searchParams.get("edit");
  const editing = Boolean(editCode);

  const [jobCode, setJobCode] = useState("…");
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);

  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState("");
  const [hiringManager, setHiringManager] = useState("");
  const [department, setDepartment] = useState("Cloud");
  const [engagementType, setEngagementType] = useState<string>(ENGAGEMENTS[1]);
  const [location, setLocation] = useState("");
  const [headcount, setHeadcount] = useState(1);
  const [compType, setCompType] = useState<string>(COMP_TYPES[0]);
  const [compMin, setCompMin] = useState("");
  const [compMax, setCompMax] = useState("");
  const [stack, setStack] = useState<string[]>([]);
  const [summary, setSummary] = useState("");
  const [responsibilities, setResponsibilities] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    employerApi.listClients().then(setClients).catch(() => setClients([]));
    employerApi.listManagers().then(setManagers).catch(() => setManagers([]));
    if (editCode) {
      jobsApi
        .get(editCode)
        .then((j) => {
          setJobCode(j.jobCode);
          setTitle(j.title);
          setClientId(j.clientId ?? "");
          setHiringManager(j.hiringManager ?? "");
          setDepartment(j.department ?? "Cloud");
          setEngagementType(j.engagementType ?? ENGAGEMENTS[1]);
          setLocation(j.location ?? "");
          setHeadcount(j.headcount);
          setCompType(j.compType ?? COMP_TYPES[0]);
          setCompMin(j.compMin ?? "");
          setCompMax(j.compMax ?? "");
          setStack(j.stack);
          setSummary(j.summary ?? "");
          setResponsibilities(j.responsibilities ?? "");
        })
        .catch(() => setError("Couldn't load this job."));
    } else {
      jobsApi.nextCode().then(setJobCode).catch(() => setJobCode("JOB-0001"));
    }
  }, [editCode]);

  const clientName = clients.find((c) => c.id === clientId)?.name ?? null;

  const previewJob = {
    compMin,
    compMax,
    compType,
    engagementType,
    clientName,
    title,
    location,
    stack,
  };

  async function save(status: JobStatus) {
    setError(undefined);
    if (!title.trim()) {
      setError("Enter a job title.");
      return;
    }
    if (status === "Published" && !clientId) {
      setError("Pick a client before publishing.");
      return;
    }
    setBusy(true);
    const body = {
      title: title.trim(),
      status,
      clientId: clientId || undefined,
      hiringManager: hiringManager || undefined,
      department,
      engagementType,
      location: location.trim() || undefined,
      headcount,
      compType,
      compMin: compMin.trim() || undefined,
      compMax: compMax.trim() || undefined,
      stack,
      summary: summary.trim() || undefined,
      responsibilities: responsibilities.trim() || undefined,
    };
    try {
      if (editCode) {
        await jobsApi.update(editCode, body);
        router.push(`/employer/jobs/${editCode}`);
      } else {
        await jobsApi.create(body);
        router.push("/employer/jobs");
      }
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Couldn't save the job.",
      );
      setBusy(false);
    }
  }

  return (
    <>
      <Topbar
        kicker={editing ? `Hiring · ${jobCode}` : "Hiring · New requisition"}
        title={editing ? "Edit job" : "Create a job"}
        sub={
          editing
            ? "Update the spec, then save or publish your changes."
            : "Fill the spec, then publish it or save it as a draft."
        }
        actions={
          <>
            <Button asChild variant="outline">
              <Link href={editing ? `/employer/jobs/${editCode}` : "/employer/jobs"}>
                {editing ? "Cancel" : "← Discard"}
              </Link>
            </Button>
            <Button variant="outline" onClick={() => save("Draft")} disabled={busy}>
              Save draft
            </Button>
            <Button variant="navy" onClick={() => save("Published")} disabled={busy}>
              {busy ? "Saving…" : editing ? "Save & publish" : "Publish job"}
            </Button>
          </>
        }
      />
      <Body>
        {error && (
          <p className="rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6">
            <Panel title="The basics">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Job title</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Job ID</Label>
                  <Input readOnly value={jobCode} className="bg-muted font-mono" />
                </div>
                <div className="space-y-1.5">
                  <Label>Client</Label>
                  <select
                    className={sel}
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                  >
                    <option value="">Select a client…</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Hiring manager</Label>
                  <select
                    className={sel}
                    value={hiringManager}
                    onChange={(e) => setHiringManager(e.target.value)}
                  >
                    <option value="">Select…</option>
                    {managers.map((m) => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Department</Label>
                  <select
                    className={sel}
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Engagement</Label>
                  <Segmented
                    value={engagementType}
                    options={ENGAGEMENTS}
                    onChange={setEngagementType}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Location</Label>
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Headcount</Label>
                  <Input
                    type="number"
                    min={1}
                    value={headcount}
                    onChange={(e) =>
                      setHeadcount(Math.max(1, Number(e.target.value) || 1))
                    }
                  />
                </div>
              </div>
            </Panel>
            <Panel title="Compensation">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label>Type</Label>
                  <Segmented value={compType} options={COMP_TYPES} onChange={setCompType} />
                </div>
                <div className="space-y-1.5">
                  <Label>Min</Label>
                  <Input
                    type="number"
                    value={compMin}
                    onChange={(e) => setCompMin(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Max</Label>
                  <Input
                    type="number"
                    value={compMax}
                    onChange={(e) => setCompMax(e.target.value)}
                  />
                </div>
              </div>
            </Panel>
            <Panel title="The work">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Required tech stack</Label>
                  <TagInput value={stack} onChange={setStack} />
                </div>
                <div className="space-y-1.5">
                  <Label>Summary</Label>
                  <Textarea rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Responsibilities</Label>
                  <Textarea
                    rows={5}
                    value={responsibilities}
                    onChange={(e) => setResponsibilities(e.target.value)}
                    placeholder="One per line"
                  />
                </div>
              </div>
            </Panel>
          </div>
          <div className="xl:sticky xl:top-6 xl:h-fit">
            <p className="mb-3 font-mono text-[0.68rem] uppercase tracking-widest text-muted-foreground">
              Live preview
            </p>
            <div className="rounded-lg bg-navy-gradient p-6 text-navy-foreground shadow-float">
              <p className="font-mono text-xs text-teal">
                {clientName?.split(" ")[0] ?? "Client"} · {engagementType}
              </p>
              <h3 className="mt-3 text-xl font-semibold">{title || "Untitled role."}</h3>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {location && (
                  <span className="rounded-sm bg-navy-foreground/10 px-2 py-0.5 text-xs">
                    {location}
                  </span>
                )}
                {stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-sm bg-navy-foreground/10 px-2 py-0.5 font-mono text-xs"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <p className="mt-5 text-lg font-semibold">
                {compMin || compMax
                  ? formatJobComp({ compMin, compMax, compType })
                  : "—"}
              </p>
            </div>
          </div>
        </div>
      </Body>
    </>
  );
}

export default function CreateJobPage() {
  return (
    <Suspense fallback={null}>
      <CreateJobForm />
    </Suspense>
  );
}
