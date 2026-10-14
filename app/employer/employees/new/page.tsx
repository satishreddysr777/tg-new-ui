"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Topbar } from "@/components/portal/Topbar";
import { Body, Panel, Segmented } from "@/components/console/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const EMPLOYMENT_TYPES = ["W-2", "1099"] as const;
const sel = "h-9 w-full rounded-md border border-input bg-background px-3 text-sm";

function AddEmployeeForm() {
  const params = useSearchParams();
  const initialRole = (params.get("role") as Role) ?? "EMPLOYEE";

  const [role, setRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [clientId, setClientId] = useState("");
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);

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
    employerApi.listClients().then(setClients).catch(() => setClients([]));
    employerApi.listManagers().then(setManagers).catch(() => setManagers([]));
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
          <Button asChild variant="outline">
            <Link href="/employer/employees">← Directory</Link>
          </Button>
        }
      />
      <Body className="max-w-3xl">
        {link ? (
          <Panel>
            <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-medium text-success">
              Invite sent
            </span>
            <h2 className="mt-4 text-xl font-semibold text-navy">
              Onboarding link is ready
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              An onboarding email is on its way to{" "}
              <b className="text-foreground">{email}</b>. In dev you can share
              this single-use magic link directly:
            </p>
            <code className="mt-4 block truncate rounded-md bg-muted px-3 py-2 font-mono text-xs">
              {link}
            </code>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={copy}>
                {copied ? "Copied ✓" : "Copy link"}
              </Button>
              <Button type="button" variant="outline" onClick={reset}>
                Add another
              </Button>
              <Button asChild variant="navy">
                <Link href="/employer/employees">Done → Directory</Link>
              </Button>
            </div>
          </Panel>
        ) : (
          <form onSubmit={submit} className="space-y-6" noValidate>
            <Panel
              title={
                <>
                  Step 1 — Account{" "}
                  <span className="font-normal text-muted-foreground">
                    · Who you&apos;re inviting and the access they get.
                  </span>
                </>
              }
            >
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Role</Label>
                  <select
                    className={sel}
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Work email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Full name (optional)</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                  <p className="text-xs text-muted-foreground">
                    The new hire can confirm this during onboarding.
                  </p>
                </div>
              </div>
            </Panel>

            {isEmployee && (
              <>
                <Panel
                  title={
                    <>
                      Step 2 — Placement{" "}
                      <span className="font-normal text-muted-foreground">
                        · Where and how this engineer is engaged.
                      </span>
                    </>
                  }
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label>Client (placement)</Label>
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
                      <Label>Title</Label>
                      <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Employment type</Label>
                      <Segmented
                        value={employmentType}
                        options={EMPLOYMENT_TYPES}
                        onChange={(v) => setEmploymentType(v as EmploymentType)}
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label>Manager</Label>
                      <select
                        className={sel}
                        value={managerName}
                        onChange={(e) => setManagerName(e.target.value)}
                      >
                        <option value="">Select a manager…</option>
                        {managers.map((m) => (
                          <option key={m.id} value={m.name}>{m.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Start date</Label>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>End date (optional)</Label>
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label>Work location (optional)</Label>
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>
                </Panel>

                <Panel
                  title={
                    <>
                      Step 3 — Compensation{" "}
                      <span className="font-normal text-muted-foreground">
                        · Internal rate — never shown to the client.
                      </span>
                    </>
                  }
                >
                  <div className="max-w-xs space-y-1.5">
                    <Label>Pay rate</Label>
                    <Input
                      placeholder="$/hr"
                      value={payRate}
                      onChange={(e) => setPayRate(e.target.value)}
                    />
                  </div>
                </Panel>
              </>
            )}

            {error && (
              <p className="text-sm text-destructive" role="alert">{error}</p>
            )}

            <div className="flex justify-end gap-2">
              <Button asChild variant="outline" type="button">
                <Link href="/employer/employees">Cancel</Link>
              </Button>
              <Button variant="navy" type="submit" disabled={busy}>
                {busy ? "Sending…" : "Send onboarding invite"}
              </Button>
            </div>
          </form>
        )}
      </Body>
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
