"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Topbar } from "@/components/portal/Topbar";
import {
  Body,
  Panel,
  Tile,
  Facts,
  Table,
  td,
  Empty,
  Chip,
} from "@/components/console/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { ApiError } from "@/lib/auth-api";
import {
  employeesApi,
  formatDate,
  displayClient,
  type Employee,
  type EngagementHistory,
} from "@/lib/employer/employees-api";

const todayISO = () => new Date().toISOString().slice(0, 10);

const DOCS = [
  ["I-9", "Verified"],
  ["W-4", "2026"],
  ["NDA", "Signed"],
  ["Direct deposit", ""],
  ["BG check", "2024"],
] as const;

const ACTIVITY = [
  ["Timesheet submitted", "26.5h · Week 19", "2h"],
  ["1:1 with manager", "Quarterly check-in", "4d"],
  ["Pay run", "$8,128.40 net", "May 2"],
  ["Cert added", "AWS SAA-Pro", "Apr 28"],
] as const;

function marginPct(bill: string | null, pay: string | null): string {
  const num = (s: string | null) => {
    const m = s?.match(/[\d.]+/);
    return m ? Number(m[0]) : NaN;
  };
  const b = num(bill);
  const p = num(pay);
  if (!Number.isFinite(b) || !Number.isFinite(p) || b <= 0) return "—";
  return `${(((b - p) / b) * 100).toFixed(1)}%`;
}

export default function EmployeeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [e, setE] = useState<Employee | null>(null);
  const [history, setHistory] = useState<EngagementHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const [endOpen, setEndOpen] = useState(false);
  const [endDate, setEndDate] = useState(todayISO());
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string>();
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string>();

  const load = useCallback(
    (active: () => boolean) => {
      setLoading(true);
      employeesApi
        .get(params.id)
        .then((emp) => {
          if (!active()) return;
          setE(emp);
          return employeesApi
            .engagements(params.id)
            .then((rows) => active() && setHistory(rows))
            .catch(() => active() && setHistory([]));
        })
        .catch((err) =>
          active() && setError(err?.status === 404 ? "notfound" : "error"),
        )
        .finally(() => active() && setLoading(false));
    },
    [params.id],
  );

  useEffect(() => {
    let alive = true;
    load(() => alive);
    return () => {
      alive = false;
    };
  }, [load]);

  async function confirmEnd() {
    if (!e) return;
    setActionError(undefined);
    if (!endDate) {
      setActionError("Pick an end date.");
      return;
    }
    setBusy(true);
    try {
      await employeesApi.endEngagement(e.employeeCode ?? e.id, {
        endDate,
        reason: reason.trim() || undefined,
      });
      setEndOpen(false);
      setReason("");
      setEndDate(todayISO());
      load(() => true);
    } catch (err) {
      setActionError(
        err instanceof ApiError
          ? err.message
          : "Couldn't end the engagement. Try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function removeEmployee() {
    if (!e) return;
    if (
      !window.confirm(
        `Delete ${e.name}? This permanently removes their account and history and can't be undone.`,
      )
    )
      return;
    setDeleteError(undefined);
    setDeleting(true);
    try {
      await employeesApi.remove(e.employeeCode ?? e.id);
      router.push("/employer/employees");
    } catch (err) {
      setDeleteError(
        err instanceof ApiError
          ? err.message
          : "Couldn't delete this employee. Try again.",
      );
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <>
        <Topbar kicker="Workforce" title="Employee" />
        <Body>
          <p className="text-center text-sm text-muted-foreground">Loading…</p>
        </Body>
      </>
    );
  }

  if (error || !e) {
    return (
      <>
        <Topbar kicker="Workforce" title="Employee not found" />
        <Body>
          <Empty title={error === "notfound" ? "Employee not found" : "Couldn't load employee"}>
            <div className="mt-4">
              <Button asChild variant="navy">
                <Link href="/employer/employees">Back to directory</Link>
              </Button>
            </div>
          </Empty>
        </Body>
      </>
    );
  }

  const margin =
    e.billRate && e.payRate
      ? (() => {
          const b = Number(String(e.billRate).replace(/[^\d.]/g, ""));
          const p = Number(String(e.payRate).replace(/[^\d.]/g, ""));
          if (!Number.isFinite(b) || !Number.isFinite(p)) return null;
          return b - p;
        })()
      : null;

  return (
    <>
      <Topbar
        kicker={`Workforce · ${e.employeeCode ?? "—"}`}
        title={e.name}
        sub={`${e.title ?? "New hire"} · ${displayClient(e)}`}
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/employer/employees">← Directory</Link>
            </Button>
            <Button variant="outline" type="button">Edit</Button>
            {e.clientId && (
              <Button
                variant="navy"
                type="button"
                onClick={() => {
                  setActionError(undefined);
                  setEndDate(todayISO());
                  setEndOpen(true);
                }}
              >
                End engagement
              </Button>
            )}
            {e.status === "On bench" && (
              <Button
                variant="destructive"
                type="button"
                onClick={removeEmployee}
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Delete"}
              </Button>
            )}
          </>
        }
      />
      <Body>
        {deleteError && (
          <p className="rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive" role="alert">
            {deleteError}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Tile
            label="Bill rate"
            big={e.billRate ?? "—"}
            small="Charged to client"
          />
          <Tile label="Pay rate" big={e.payRate ?? "—"} small={e.employmentType ?? "—"} />
          <Tile
            label="Margin"
            big={margin != null ? `$${margin}/hr` : marginPct(e.billRate, e.payRate)}
            small={
              margin != null && e.billRate
                ? `${marginPct(e.billRate, e.payRate)} gross`
                : "No active billing"
            }
          />
          <Tile label="YTD billed" big="$58.4k" small="Since Jan 1" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6">
            {e.clientId && (
              <Panel
                title="Current engagement"
                action={
                  <span className="font-mono text-xs text-primary">IN PROGRESS</span>
                }
              >
                <p className="font-mono text-xs text-muted-foreground">
                  {formatDate(e.startDate)} → {formatDate(e.endDate)}
                </p>
                <div className="mt-4">
                  <Facts
                    cols={3}
                    items={[
                      ["Client", displayClient(e)],
                      ["Hiring mgr", e.managerName ?? "—"],
                      ["SOW #", "SOW-2026-0093"],
                      ["PO #", "PO-NB-44218"],
                      ["Status", e.status ?? "Active"],
                    ]}
                  />
                </div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[46%] rounded-full bg-primary" />
                </div>
              </Panel>
            )}

            <Panel title="Profile">
              <Facts
                items={[
                  ["Email", e.email],
                  ["Based in", e.location ?? "—"],
                  ["Status", e.status ?? "—"],
                  ["Type", e.employmentType ?? "—"],
                  ["Manager", e.managerName ?? "—"],
                ]}
              />
              {e.stack.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {e.stack.map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </div>
              )}
            </Panel>

            <div>
              <h2 className="mb-3 text-sm font-semibold text-navy">
                Placement history
              </h2>
              <Table head={["Client", "Title", "Period", "Bill rate", "Reason"]}>
                {history.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      No previous placements.
                    </td>
                  </tr>
                ) : (
                  history.map((h) => (
                    <tr key={h.id}>
                      <td className={td}>{h.clientName}</td>
                      <td className={td}>{h.title ?? "—"}</td>
                      <td className={td}>
                        {formatDate(h.startDate)} → {formatDate(h.endDate)}
                      </td>
                      <td className={td}>{h.billRate ?? "—"}</td>
                      <td className={td}>{h.reason ?? "—"}</td>
                    </tr>
                  ))
                )}
              </Table>
            </div>
          </div>

          <div className="space-y-6">
            <Panel title="Documents">
              <ul className="divide-y">
                {DOCS.map(([d, s]) => (
                  <li
                    key={d}
                    className="flex items-center justify-between py-2.5 text-sm"
                  >
                    <span>
                      {d}{" "}
                      {s && <span className="text-muted-foreground">· {s}</span>}
                    </span>
                    <button
                      type="button"
                      className="text-xs font-medium text-primary"
                    >
                      Download
                    </button>
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel title="Recent activity">
              <ul className="space-y-4">
                {ACTIVITY.map(([t, d, w]) => (
                  <li key={t} className="flex justify-between gap-3 text-sm">
                    <div>
                      <p className="font-medium">{t}</p>
                      <p className="text-xs text-muted-foreground">{d}</p>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      {w}
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      </Body>

      <Dialog open={endOpen} onOpenChange={setEndOpen}>
        <DialogContent>
          <p className="eyebrow">Workforce</p>
          <DialogTitle className="text-navy">End engagement</DialogTitle>
          <p className="text-sm text-muted-foreground">
            End <b className="text-foreground">{e.name}</b>&apos;s placement at{" "}
            <b className="text-foreground">{displayClient(e)}</b>. They&apos;ll
            move to <b className="text-foreground">On bench</b> and the placement
            will be recorded in their history.
          </p>
          <div className="space-y-1.5">
            <Label>Engagement end date</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(ev) => setEndDate(ev.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Reason (optional)</Label>
            <Textarea
              rows={3}
              value={reason}
              onChange={(ev) => setReason(ev.target.value)}
            />
          </div>
          {actionError && (
            <p className="text-sm text-destructive" role="alert">{actionError}</p>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEndOpen(false)}>
              Cancel
            </Button>
            <Button variant="navy" onClick={confirmEnd} disabled={busy}>
              {busy ? "Ending…" : "End engagement"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
