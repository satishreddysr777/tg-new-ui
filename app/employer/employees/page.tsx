"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/portal/Topbar";
import { Body, Table, td, StatusBadge, Segmented, Tile } from "@/components/console/ui";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  employeesApi,
  formatDate,
  displayClient,
  type Employee,
} from "@/lib/employer/employees-api";

const STATUS = ["All", "Active", "Onboarding", "On bench"] as const;

export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [q, setQ] = useState("");
  const [st, setSt] = useState<(typeof STATUS)[number]>("All");
  const [view, setView] = useState<"Table" | "Grid">("Table");

  function load() {
    setLoading(true);
    employeesApi
      .list()
      .then((rows) => {
        setEmployees(rows);
        setError(undefined);
      })
      .catch(() => setError("Couldn't load employees."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  const c = (s: string) => employees.filter((e) => e.status === s).length;

  const list = useMemo(
    () =>
      employees.filter(
        (e) =>
          (st === "All" || e.status === st) &&
          (q === "" ||
            (e.name + (e.title ?? "") + (e.clientName ?? ""))
              .toLowerCase()
              .includes(q.toLowerCase())),
      ),
    [employees, st, q],
  );

  const open = (e: Employee) => router.push(`/employer/employees/${e.employeeCode}`);

  return (
    <>
      <Topbar
        kicker="Workforce · Directory"
        title="Employees"
        sub={
          loading
            ? "Loading the workforce…"
            : `${employees.length} on payroll · ${c("Active")} active · ${c("Onboarding")} onboarding · ${c("On bench")} on bench`
        }
        actions={
          <Button asChild variant="navy">
            <Link href="/employer/employees/new">Add employee</Link>
          </Button>
        }
      />
      <Body>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Tile label="Active" big={c("Active")} small="On engagement" />
          <Tile label="Onboarding" big={c("Onboarding")} small="Starting soon" />
          <Tile label="On bench" big={c("On bench")} small="Available now" />
          <Tile label="Total" big={employees.length} small="On payroll" />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            className="max-w-xs"
            placeholder="Search employees…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Segmented value={st} options={STATUS} onChange={setSt} />
          <div className="ml-auto">
            <Segmented value={view} options={["Table", "Grid"] as const} onChange={setView} />
          </div>
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
        ) : view === "Table" ? (
          <Table
            head={[
              "Name",
              "Role / Client",
              "Type",
              "Bill rate",
              "Manager",
              "Status",
              "End date",
            ]}
          >
            {list.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  No employees match that search.
                </td>
              </tr>
            ) : (
              list.map((e) => (
                <tr
                  key={e.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => open(e)}
                >
                  <td className={td}>
                    <p className="font-medium text-navy">{e.name}</p>
                    <p className="font-mono text-xs text-muted-foreground">{e.employeeCode}</p>
                  </td>
                  <td className={td}>
                    <p>{e.title ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{displayClient(e)}</p>
                  </td>
                  <td className={td}>{e.employmentType ?? "—"}</td>
                  <td className={td}>{e.billRate ?? "—"}</td>
                  <td className={td}>{e.managerName ?? "—"}</td>
                  <td className={td}>
                    {e.status ? <StatusBadge status={e.status} /> : "—"}
                  </td>
                  <td className={td}>{formatDate(e.endDate)}</td>
                </tr>
              ))
            )}
          </Table>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((e) => (
              <Link
                key={e.id}
                href={`/employer/employees/${e.employeeCode}`}
                className="rounded-lg border bg-card p-5 shadow-card hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">{e.employeeCode}</span>
                  {e.status && <StatusBadge status={e.status} />}
                </div>
                <p className="mt-3 font-semibold text-navy">{e.name}</p>
                <p className="text-sm text-muted-foreground">
                  {e.title ?? "—"} · {displayClient(e)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </Body>
    </>
  );
}
