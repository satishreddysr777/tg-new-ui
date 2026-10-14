"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  Clock,
  Briefcase,
  PlusSquare,
  Building2,
  UserPlus,
  Inbox,
} from "lucide-react";
import { ConsoleShell, type NavGroup } from "@/components/console/Shell";
import { employeesApi } from "@/lib/employer/employees-api";
import { employerApi, type StaffProfile } from "@/lib/employer/invites-api";
import { jobsApi } from "@/lib/employer/jobs-api";
import { messagesApi } from "@/lib/employer/messages-api";

const roleLabel: Record<string, string> = {
  ADMIN: "Admin",
  EMPLOYER: "Talent team",
  EMPLOYEE: "Employee",
};

export function EmployerChrome({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<StaffProfile | null>(null);
  const [employeeCount, setEmployeeCount] = useState<number | null>(null);
  const [jobCount, setJobCount] = useState<number | null>(null);
  const [newMessages, setNewMessages] = useState<number | null>(null);

  useEffect(() => {
    employerApi.me().then(setMe).catch(() => setMe(null));
    employeesApi
      .list()
      .then((rows) => setEmployeeCount(rows.length))
      .catch(() => setEmployeeCount(0));
    jobsApi
      .list()
      .then((rows) => setJobCount(rows.length))
      .catch(() => setJobCount(0));
    messagesApi
      .list()
      .then((rows) => setNewMessages(rows.filter((m) => m.status === "NEW").length))
      .catch(() => setNewMessages(0));
  }, []);

  const groups: NavGroup[] = [
    {
      title: "Workforce",
      items: [
        { to: "/employer", label: "Dashboard", icon: LayoutDashboard, exact: true },
        {
          to: "/employer/employees",
          label: "Employees",
          icon: Users,
          badge: employeeCount ?? undefined,
        },
        { to: "/employer/timesheets", label: "Timesheets", icon: Clock },
      ],
    },
    {
      title: "Hiring",
      items: [
        {
          to: "/employer/jobs",
          label: "Jobs",
          icon: Briefcase,
          badge: jobCount ?? undefined,
        },
        { to: "/employer/jobs/new", label: "Create job", icon: PlusSquare, exact: true },
      ],
    },
    {
      title: "Admin",
      items: [
        { to: "/employer/clients", label: "Clients", icon: Building2 },
        { to: "/employer/team", label: "Team & invites", icon: UserPlus },
        {
          to: "/employer/messages",
          label: "Messages",
          icon: Inbox,
          badge: newMessages ? `${newMessages} NEW` : undefined,
        },
      ],
    },
  ];

  const footerName = me?.name ?? "Technograph";
  const footerSub = me?.role ? roleLabel[me.role] ?? me.role : "Talent team";

  return (
    <ConsoleShell footer={{ name: footerName, sub: footerSub }} groups={groups}>
      {children}
    </ConsoleShell>
  );
}
