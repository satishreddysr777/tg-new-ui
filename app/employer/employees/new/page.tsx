"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Topbar } from "@/components/portal/Topbar";
import { Icon } from "@/components/portal/icons";
import { ApiError, type Role } from "@/lib/auth-api";
import {
  employerApi,
  type ClientRow,
  type CreateInviteInput,
  type EmploymentType,
  type Manager,
} from "@/lib/employer/invites-api";

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: "EMPLOYEE", label: "Employee · placed engineer" },
  { value: "EMPLOYER", label: "Talent team (staff)" },
  { value: "ADMIN", label: "Admin" },
];

const EMPLOYMENT_TYPES: EmploymentType[] = ["W-2", "1099"];

/** Reusable labelled field wrapper for the form grid. */
function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
      {hint && (
        <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 6 }}>
          {hint}
        </div>
      )}
    </div>
  );
}

function SectionCard({
  step,
  title,
  desc,
  children,
}: {
  step: string;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card">
      <div className="between" style={{ alignItems: "flex-start" }}>
        <div>
          <span className="eyebrow" style={{ gap: 0 }}>
            {step}
          </span>
          <h3 style={{ fontSize: 17, marginTop: 4 }}>{title}</h3>
          <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 3 }}>
            {desc}
          </p>
        </div>
      </div>
      <div className="rule" style={{ margin: "16px 0 18px" }} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function AddEmployeeForm() {
  const router = useRouter();
  const params = useSearchParams();
  const initialRole = (params.get("role") as Role) ?? "EMPLOYEE";

  const [role, setRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [clientId, setClientId] = useState("");
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);

  // placement + compensation (employee only)
  const [title, setTitle] = useState("");
  const [employmentType, setEmploymentType] = useState<EmploymentType>("W-2");
  const [managerName, setManagerName] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [payRate, setPayRate] = useState("");

  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [link, setLink] = useState<string>();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    employerApi
      .listClients()
      .then(setClients)
      .catch(() => setClients([]));
    employerApi
      .listManagers()
      .then(setManagers)
      .catch(() => setManagers([]));
  }, []);

  const isEmployee = role === "EMPLOYEE";

  function reset() {
    setEmail("");
    setName("");
    setClientId("");
    setTitle("");
    setEmploymentType("W-2");
    setManagerName("");
    setLocation("");
    setStartDate("");
    setEndDate("");
    setPayRate("");
    setError(undefined);
    setLink(undefined);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    if (!email) {
      setError("Enter the new hire's work email.");
      return;
    }
    if (isEmployee && !clientId) {
      setError("Pick the client this employee will be placed at.");
      return;
    }
    if (startDate && endDate && endDate < startDate) {
      setError("The end date can't be before the start date.");
      return;
    }
    setBusy(true);
    try {
      const body: CreateInviteInput = {
        email,
        role,
        name: name || undefined,
        clientId: isEmployee ? clientId : undefined,
        ...(isEmployee && {
          title: title || undefined,
          employmentType,
          managerName: managerName || undefined,
          location: location || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          payRate: payRate || undefined,
        }),
      };
      const res = await employerApi.createInvite(body);
      setLink(res.link);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Couldn't create the invite.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <Topbar
        kicker="Workforce · Onboarding"
        title="Add an employee"
        sub="Set up the placement and compensation, then send a single-use onboarding link."
        actions={
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => router.push("/employer/employees")}
          >
            ← Directory
          </button>
        }
      />
      <div className="content">
        {link ? (
          <div className="card" style={{ maxWidth: 640, margin: "0 auto" }}>
            <span className="tag tag-ok" style={{ width: "fit-content" }}>
              Invite sent
            </span>
            <h3 style={{ fontSize: 19, marginTop: 12 }}>
              Onboarding link is ready
            </h3>
            <p
              style={{
                fontSize: 13.5,
                color: "var(--muted)",
                lineHeight: 1.6,
                marginTop: 6,
              }}
            >
              An onboarding email is on its way to <strong>{email}</strong>. In
              dev you can share this single-use magic link directly:
            </p>
            <div
              className="input mono"
              style={{
                fontSize: 11.5,
                wordBreak: "break-all",
                background: "var(--paper-2)",
                cursor: "default",
                marginTop: 14,
              }}
            >
              {link}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button type="button" className="btn btn-sm" onClick={copy}>
                {copied ? "Copied ✓" : "Copy link"}
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={reset}
              >
                Add another
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => router.push("/employer/employees")}
              >
                Done → Directory
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={submit}
            noValidate
            style={{
              maxWidth: 820,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <SectionCard
              step="Step 1"
              title="Account"
              desc="Who you're inviting and the access they get."
            >
              <Field label="Role">
                <select
                  className="select"
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Work email">
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field label="Full name (optional)" hint="The new hire can confirm this during onboarding.">
                <input
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>
            </SectionCard>

            {isEmployee && (
              <>
                <SectionCard
                  step="Step 2"
                  title="Placement"
                  desc="Where and how this engineer is engaged."
                >
                  <Field label="Client (placement)">
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
                  </Field>
                  <Field label="Title">
                    <input
                      className="input"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Field>
                  <Field label="Employment type">
                    <select
                      className="select"
                      value={employmentType}
                      onChange={(e) =>
                        setEmploymentType(e.target.value as EmploymentType)
                      }
                    >
                      {EMPLOYMENT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Manager">
                    <select
                      className="select"
                      value={managerName}
                      onChange={(e) => setManagerName(e.target.value)}
                    >
                      <option value="">Select a manager…</option>
                      {managers.map((m) => (
                        <option key={m.id} value={m.name}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Start date">
                    <input
                      className="input"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </Field>
                  <Field label="End date (optional)">
                    <input
                      className="input"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </Field>
                  <Field label="Work location (optional)" hint="The new hire can refine this during onboarding.">
                    <input
                      className="input"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </Field>
                </SectionCard>

                <SectionCard
                  step="Step 3"
                  title="Compensation"
                  desc="Internal rate — never shown to the client."
                >
                  <Field label="Pay rate" hint="What the engineer is paid.">
                    <input
                      className="input"
                      value={payRate}
                      onChange={(e) => setPayRate(e.target.value)}
                    />
                  </Field>
                </SectionCard>
              </>
            )}

            {error && (
              <p className="err" role="alert">
                {error}
              </p>
            )}

            <div
              className="card"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                padding: 16,
              }}
            >
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => router.push("/employer/employees")}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-sm" disabled={busy}>
                <Icon name="plus" size={15} />
                {busy ? " Sending…" : " Send onboarding invite"}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

export default function AddEmployeePage() {
  return (
    <Suspense fallback={null}>
      <AddEmployeeForm />
    </Suspense>
  );
}
