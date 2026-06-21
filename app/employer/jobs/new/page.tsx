"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Topbar } from "@/components/portal/Topbar";
import { ApiError } from "@/lib/auth-api";
import {
  employerApi,
  type ClientRow,
  type Manager,
} from "@/lib/employer/invites-api";
import { jobsApi, type JobStatus } from "@/lib/employer/jobs-api";

const DEPARTMENTS = ["Cloud", "Data", "Engineering", "Security", "Digital"];
const ENGAGEMENTS = ["Direct hire", "Contract"];
const COMP_TYPES = ["Yearly", "Hourly"];

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
  const [engagementType, setEngagementType] = useState("Direct hire");
  const [location, setLocation] = useState("");
  const [headcount, setHeadcount] = useState(1);
  const [compType, setCompType] = useState("Yearly");
  const [compMin, setCompMin] = useState("");
  const [compMax, setCompMax] = useState("");
  const [stack, setStack] = useState<string[]>([]);
  const [add, setAdd] = useState("");
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
          setEngagementType(j.engagementType ?? "Direct hire");
          setLocation(j.location ?? "");
          setHeadcount(j.headcount);
          setCompType(j.compType ?? "Yearly");
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

  const addStack = () => {
    const v = add.trim();
    if (v && !stack.includes(v)) setStack((s) => [...s, v]);
    setAdd("");
  };

  const clientName = clients.find((c) => c.id === clientId)?.name ?? null;

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
            ? "Update the spec, then publish it or keep it as a draft."
            : "Fill the spec, then publish it or save it as a draft."
        }
        actions={
          <>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() =>
                router.push(
                  editing ? `/employer/jobs/${editCode}` : "/employer/jobs",
                )
              }
            >
              ← {editing ? "Cancel" : "Discard"}
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => save("Draft")}
              disabled={busy}
            >
              Save draft
            </button>
            <button
              className="btn btn-sm"
              onClick={() => save("Published")}
              disabled={busy}
            >
              {busy ? "Saving…" : editing ? "Save & publish" : "Publish job"}
            </button>
          </>
        }
      />
      <div className="content">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 312px", gap: 18, alignItems: "start" }}>
          {/* form */}
          <div className="card" style={{ padding: 26 }}>
            <span className="eyebrow">
              <span className="tick" />
              The basics
            </span>
            <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 15 }}>
              <div>
                <label className="field-label">Job title</label>
                <input
                  className="input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="field-label">Job ID</label>
                <input
                  className="input mono"
                  value={jobCode}
                  readOnly
                  aria-readonly="true"
                  style={{ opacity: 0.7, cursor: "not-allowed" }}
                />
              </div>
              <div>
                <label className="field-label">Client</label>
                <select
                  className="select"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                >
                  <option value="">Select a client…</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label">Hiring manager</label>
                <select
                  className="select"
                  value={hiringManager}
                  onChange={(e) => setHiringManager(e.target.value)}
                >
                  <option value="">Select a manager…</option>
                  {managers.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label">Department</label>
                <select
                  className="select"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label">Engagement</label>
                <select
                  className="select"
                  value={engagementType}
                  onChange={(e) => setEngagementType(e.target.value)}
                >
                  {ENGAGEMENTS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label">Location</label>
                <input
                  className="input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div>
                <label className="field-label">Headcount</label>
                <input
                  className="input"
                  type="number"
                  min={1}
                  value={headcount}
                  onChange={(e) =>
                    setHeadcount(Math.max(1, Number(e.target.value) || 1))
                  }
                />
              </div>
            </div>

            <div className="rule" style={{ margin: "24px 0" }} />
            <span className="eyebrow">
              <span className="tick" />
              Compensation
            </span>
            <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 13 }}>
              <div>
                <label className="field-label">Type</label>
                <select
                  className="select"
                  value={compType}
                  onChange={(e) => setCompType(e.target.value)}
                >
                  {COMP_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label">Min</label>
                <input
                  className="input mono"
                  value={compMin}
                  onChange={(e) => setCompMin(e.target.value)}
                />
              </div>
              <div>
                <label className="field-label">Max</label>
                <input
                  className="input mono"
                  value={compMax}
                  onChange={(e) => setCompMax(e.target.value)}
                />
              </div>
            </div>

            <div className="rule" style={{ margin: "24px 0" }} />
            <span className="eyebrow">
              <span className="tick" />
              The work
            </span>
            <div style={{ marginTop: 14, display: "grid", gap: 15 }}>
              <div>
                <label className="field-label">Required tech stack</label>
                <div
                  className="input"
                  style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", minHeight: 46, padding: 8 }}
                >
                  {stack.map((s) => (
                    <span
                      key={s}
                      className="tag tag-copper"
                      style={{ cursor: "pointer" }}
                      onClick={() => setStack((x) => x.filter((y) => y !== s))}
                    >
                      {s} ✕
                    </span>
                  ))}
                  <input
                    value={add}
                    onChange={(e) => setAdd(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addStack();
                      }
                    }}
                    onBlur={addStack}
                    style={{
                      border: 0,
                      background: "transparent",
                      outline: "none",
                      fontSize: 13,
                      flex: 1,
                      minWidth: 70,
                      color: "var(--ink)",
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="field-label">Summary</label>
                <textarea
                  className="textarea"
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </div>
              <div>
                <label className="field-label">Responsibilities</label>
                <textarea
                  className="textarea"
                  rows={4}
                  value={responsibilities}
                  onChange={(e) => setResponsibilities(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <p className="err" role="alert" style={{ marginTop: 18 }}>
                {error}
              </p>
            )}
          </div>

          {/* live preview */}
          <div className="stack" style={{ position: "sticky", top: 0 }}>
            <div className="card">
              <span className="eyebrow">
                <span className="tick" />
                Live preview
              </span>
              <div style={{ marginTop: 12, padding: 18, background: "var(--paper-2)", borderRadius: 12, border: "1px solid var(--line)" }}>
                <span className="eyebrow" style={{ color: "var(--copper)" }}>
                  {(clientName?.split(" ")[0] ?? "Client")} · {engagementType}
                </span>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 22, marginTop: 8, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
                  {title || "Untitled role"}.
                </div>
                <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[location, ...stack.slice(0, 2)]
                    .filter(Boolean)
                    .map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                </div>
                {(compMin || compMax) && (
                  <div className="mono" style={{ marginTop: 12, fontSize: 11.5, color: "var(--muted)" }}>
                    {compMin || "—"}–{compMax || "—"} · {compType}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
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
