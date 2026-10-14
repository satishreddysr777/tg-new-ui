"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Briefcase, DollarSign, FileText, Search } from "lucide-react";
import { Topbar } from "@/components/portal/Topbar";
import { Body, Tile } from "@/components/console/ui";
import { Button } from "@/components/ui/button";
import { meApi, type PortalApplication, type PortalRole } from "@/lib/portal/me-api";
import { useMe, firstName } from "@/lib/portal/me-context";
import { engagementProgress, fmtDate } from "@/lib/portal/format";

export default function PortalHome() {
  const me = useMe();
  const [roles, setRoles] = useState<PortalRole[] | null>(null);
  const [apps, setApps] = useState<PortalApplication[] | null>(null);

  useEffect(() => {
    let active = true;
    meApi.roles().then((r) => active && setRoles(r)).catch(() => active && setRoles([]));
    meApi
      .applications()
      .then((a) => active && setApps(a))
      .catch(() => active && setApps([]));
    return () => {
      active = false;
    };
  }, []);

  const prog = engagementProgress(me.startDate, me.endDate);
  const openRoles = roles?.filter((r) => !r.applied) ?? [];
  const matched = openRoles.filter((r) => r.matchPct >= 50).length;
  const activeApps = apps?.filter((a) => a.stage !== "Rejected" && a.stage !== "Hired") ?? [];
  const furthest = apps && apps.length > 0 ? apps[0]!.stage : null;

  return (
    <>
      <Topbar
        kicker={`${me.employeeCode ?? "Employee"} · ${me.status ?? "Active"}`}
        title={`Welcome back, ${firstName(me.name)}.`}
        sub={
          me.clientName
            ? `${me.title ?? "Engineer"} at ${me.clientName}`
            : (me.title ?? "Technograph engineer")
        }
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/portal/engagement">View engagement</Link>
            </Button>
            <Button asChild variant="navy">
              <Link href="/portal/roles">Browse open roles</Link>
            </Button>
          </>
        }
      />
      <Body>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Tile
            to="/portal/engagement"
            icon={<Briefcase className="h-4 w-4" />}
            label="My engagement"
            big={
              prog
                ? `${prog.remaining} weeks left`
                : (me.clientName ?? "No active engagement")
            }
            small={
              me.clientName
                ? `${me.clientName} · through ${fmtDate(me.endDate)}`
                : "On bench"
            }
          />
          <Tile
            to="/portal/pay"
            icon={<DollarSign className="h-4 w-4" />}
            label="Pay rate"
            big={me.payRate ?? "—"}
            small={
              [me.employmentType, me.clientName].filter(Boolean).join(" · ") || "—"
            }
          />
          <Tile
            to="/portal/roles"
            icon={<Search className="h-4 w-4" />}
            label="Open roles"
            big={roles === null ? "…" : `${openRoles.length} open`}
            small={
              roles === null
                ? "Loading roles"
                : matched > 0
                  ? `${matched} match your stack`
                  : "Matched to your profile"
            }
          />
          <Tile
            to="/portal/applications"
            icon={<FileText className="h-4 w-4" />}
            label="My applications"
            big={apps === null ? "…" : `${activeApps.length} active`}
            small={
              apps === null
                ? "Loading applications"
                : furthest
                  ? `Furthest stage · ${furthest}`
                  : "No applications yet"
            }
          />
        </div>
      </Body>
    </>
  );
}
