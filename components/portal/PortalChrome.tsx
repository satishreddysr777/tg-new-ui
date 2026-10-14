"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Home, Briefcase, Clock, Wallet, Search, FileText } from "lucide-react";
import { ConsoleShell } from "@/components/console/Shell";
import { useMe } from "@/lib/portal/me-context";
import { meApi } from "@/lib/portal/me-api";

export function PortalChrome({ children }: { children: ReactNode }) {
  const me = useMe();
  const [rolesBadge, setRolesBadge] = useState<number | undefined>();
  const [appsBadge, setAppsBadge] = useState<number | undefined>();

  useEffect(() => {
    let active = true;
    Promise.all([
      meApi.roles().catch(() => []),
      meApi.applications().catch(() => []),
    ]).then(([roles, apps]) => {
      if (!active) return;
      const notApplied = roles.filter((r) => !r.applied).length;
      setRolesBadge(notApplied > 0 ? notApplied : undefined);
      setAppsBadge(apps.length > 0 ? apps.length : undefined);
    });
    return () => {
      active = false;
    };
  }, []);

  const code = me.employeeCode ?? me.email;
  const sub = [me.title, me.clientName].filter(Boolean).join(" · ") || "Technograph";

  return (
    <ConsoleShell
      accountTo="/portal/account"
      footer={{ name: me.name, sub: `${sub}${code ? ` · ${code}` : ""}` }}
      groups={[
        {
          title: "My work",
          items: [
            { to: "/portal", label: "Home", icon: Home, exact: true },
            { to: "/portal/engagement", label: "My engagement", icon: Briefcase },
            { to: "/portal/timesheet", label: "Timesheet", icon: Clock },
            { to: "/portal/pay", label: "Pay", icon: Wallet },
          ],
        },
        {
          title: "My career",
          items: [
            {
              to: "/portal/roles",
              label: "Open roles",
              icon: Search,
              badge: rolesBadge,
            },
            {
              to: "/portal/applications",
              label: "My applications",
              icon: FileText,
              badge: appsBadge,
            },
          ],
        },
      ]}
    >
      {children}
    </ConsoleShell>
  );
}
