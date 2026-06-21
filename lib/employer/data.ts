// Employer-console data — mirrors the design prototype's console-data.jsx.
// Static fixtures for now; these map onto tg-api endpoints as the console grows.
import type { IconName } from "@/components/portal/icons";

// ── the signed-in admin (sidebar footer) ─────────────────────
export const ME = {
  name: "Noé Aguilar",
  role: "Head of Talent",
  scope: "Admin",
};

// Employees now come from the API — see lib/employer/employees-api.ts and the
// /employer/employees pages. (Jobs/timesheets/applicants below are still
// fixtures until those screens are wired up.)

// ── jobs ─────────────────────────────────────────────────────
export interface Job {
  id: string;
  title: string;
  client: string;
  dept: string;
  loc: string;
  type: string;
  comp: string;
  posted: string;
  owner: string;
  funnel: number[]; // [new, screen, interview, offer, hired]
}

export const JOBS: Job[] = [
  { id: "REQ-0042", title: "Senior Platform Engineer", client: "Northbeam Logistics", dept: "Cloud", loc: "Remote · US", type: "Direct hire", comp: "$185–215k", posted: "2d", owner: "Wendy P.", funnel: [12, 8, 6, 2, 1] },
  { id: "REQ-0041", title: "Data Engineer · Spark / Kafka", client: "Klein Financial", dept: "Data", loc: "Austin, TX", type: "Contract", comp: "$150/hr", posted: "4d", owner: "Andrés H.", funnel: [9, 5, 4, 1, 0] },
  { id: "REQ-0039", title: "AEM Developer", client: "Lumen Health", dept: "Digital", loc: "Remote · US", type: "Contract", comp: "$135/hr", posted: "6d", owner: "Wendy P.", funnel: [14, 7, 5, 3, 1] },
  { id: "REQ-0037", title: "Cybersecurity Consultant", client: "Northwind Bank", dept: "Security", loc: "New York, NY", type: "Direct hire", comp: "$170–190k", posted: "8d", owner: "Wendy P.", funnel: [6, 4, 2, 1, 0] },
  { id: "REQ-0035", title: "Java Full-Stack Engineer", client: "Halcyon Health", dept: "Engineering", loc: "Remote · US", type: "Contract-to-hire", comp: "$145/hr", posted: "11d", owner: "Andrés H.", funnel: [10, 6, 3, 1, 0] },
  { id: "REQ-0033", title: "DevOps / Platform Engineer", client: "Avalon Robotics", dept: "Cloud", loc: "Remote · US", type: "Direct hire", comp: "$175–200k", posted: "14d", owner: "Wendy P.", funnel: [8, 5, 3, 2, 1] },
  { id: "REQ-0030", title: "Machine Learning Engineer", client: "Avalon Robotics", dept: "Data", loc: "Boston, MA", type: "Direct hire", comp: "$190–220k", posted: "18d", owner: "Andrés H.", funnel: [7, 3, 2, 1, 0] },
];

// ── applicants (kanban) ──────────────────────────────────────
export type Stage = "New" | "Screening" | "Interview" | "Offer" | "Hired" | "Rejected";
export const STAGES: Stage[] = ["New", "Screening", "Interview", "Offer", "Hired", "Rejected"];

export const stageColor = (s: Stage): string =>
  ({
    New: "var(--copper)",
    Screening: "var(--plum)",
    Interview: "var(--teal)",
    Offer: "var(--ok)",
    Hired: "var(--ink)",
    Rejected: "var(--muted-2)",
  }[s] || "var(--ink)");

export interface Applicant {
  id: string;
  name: string;
  stage: Stage;
  when: string;
  stack: string[];
  yrs: number;
  comp: string;
  loc: string;
  match: number;
}

export const APPLICANTS: Applicant[] = [
  { id: "A-2104", name: "Jordan Yamaguchi", stage: "New", when: "2h ago", stack: ["Kubernetes", "Go", "AWS"], yrs: 9, comp: "$190k", loc: "Remote · CA", match: 92 },
  { id: "A-2099", name: "Eliana Crespo", stage: "New", when: "5h ago", stack: ["EKS", "Terraform", "Python"], yrs: 8, comp: "$185k", loc: "Austin, TX", match: 88 },
  { id: "A-2086", name: "Idris Olufemi", stage: "Screening", when: "1d ago", stack: ["Kubernetes", "Rust", "AWS"], yrs: 11, comp: "$210k", loc: "Remote · GA", match: 84 },
  { id: "A-2071", name: "Mei-Ling Park", stage: "Screening", when: "2d ago", stack: ["GKE", "Go", "Helm"], yrs: 7, comp: "$175k", loc: "Seattle, WA", match: 78 },
  { id: "A-2058", name: "Tomás Ferrari", stage: "Interview", when: "3d ago", stack: ["Kubernetes", "Go"], yrs: 10, comp: "$200k", loc: "NYC", match: 91 },
  { id: "A-2049", name: "Nadia Volkov", stage: "Interview", when: "4d ago", stack: ["EKS", "Linkerd", "Go"], yrs: 9, comp: "$195k", loc: "Remote · MA", match: 86 },
  { id: "A-2031", name: "Henry Bell", stage: "Offer", when: "6d ago", stack: ["Kubernetes", "Go", "AWS"], yrs: 12, comp: "$220k", loc: "Remote · CO", match: 95 },
  { id: "A-2007", name: "Aki Tanaka", stage: "Hired", when: "12d ago", stack: ["EKS", "Istio", "Go"], yrs: 8, comp: "$192k", loc: "Remote · WA", match: 89 },
  { id: "A-2002", name: "Lena Kowalski", stage: "Rejected", when: "14d ago", stack: ["ECS", "Python"], yrs: 5, comp: "$155k", loc: "Chicago, IL", match: 54 },
];

// ── dashboard ────────────────────────────────────────────────
export interface DashTile {
  href: string;
  icon: IconName;
  title: string;
  big: string;
  small: string;
  color: string;
}

export const DASH_TILES: DashTile[] = [
  { href: "/employer/employees", icon: "team", title: "Employees", big: "8 on payroll", small: "7 active · 1 onboarding", color: "var(--copper)" },
  { href: "/employer/timesheets", icon: "clock", title: "Timesheets", big: "2 awaiting approval", small: "Week 19 · May 11–17", color: "var(--teal)" },
  { href: "/employer/jobs", icon: "brief", title: "Open jobs", big: "7 requisitions", small: "47 in funnel", color: "var(--ok)" },
  { href: "/employer/applications", icon: "users", title: "Applications", big: "2 new this week", small: "1 offer extended", color: "var(--plum)" },
];

export interface Kpi {
  label: string;
  num: string;
  foot: string;
  trend?: "up" | "warn";
}

export const DASH_KPIS: Kpi[] = [
  { label: "Active engagements", num: "7", foot: "Across 5 clients" },
  { label: "Avg utilization", num: "88%", foot: "+3% vs last week", trend: "up" },
  { label: "Billed this week", num: "$84,860", foot: "524 billable hrs" },
  { label: "Time-to-fill", num: "14d", foot: "−2d vs Q1", trend: "up" },
];

export interface FeedItem {
  icon: IconName;
  title: string;
  sub: string;
  when: string;
}

export const DASH_FEED: FeedItem[] = [
  { icon: "check", title: "Timesheet submitted", sub: "Marcus Liang · 78.5h · Week 19", when: "12m" },
  { icon: "users", title: "New applicant", sub: "Jordan Yamaguchi → Senior Platform Engineer", when: "2h" },
  { icon: "bolt", title: "Offer accepted", sub: "Aki Tanaka · Senior Platform Engineer", when: "5h" },
  { icon: "cal", title: "Engagement extended", sub: "Renee Boateng · through Aug 22", when: "1d" },
  { icon: "brief", title: "Job published", sub: "Machine Learning Engineer · Avalon Robotics", when: "2d" },
];

// ── timesheets (approval queue) ──────────────────────────────
export interface TimesheetRow {
  n: string;
  c: string;
  d: number[]; // mon..sun
  st: "Draft" | "Submitted" | "Pending" | "Approved" | "Rejected";
  flag?: boolean;
}

export const TIMESHEETS: TimesheetRow[] = [
  { n: "Renee Boateng", c: "Northbeam Logistics", d: [8, 8, 6.5, 4, 0, 0, 0], st: "Draft" },
  { n: "Marcus Liang", c: "Klein Financial", d: [8, 8, 8, 8, 6.5, 0, 0], st: "Submitted" },
  { n: "Priya Subramanian", c: "Halcyon Health", d: [8, 9, 8, 8, 7, 0, 0], st: "Pending", flag: true },
  { n: "Kai Mendoza", c: "Avalon Robotics", d: [8, 8, 8, 4, 0, 0, 0], st: "Draft" },
  { n: "Hana Okonkwo", c: "Northwind Bank", d: [8, 8, 8, 8, 8, 0, 0], st: "Approved" },
  { n: "Dmitri Volkov", c: "Klein Financial", d: [9, 8, 9, 8, 6, 0, 0], st: "Pending", flag: true },
  { n: "Aisha Karimov", c: "Avalon Robotics", d: [8, 8, 8, 8, 6, 0, 0], st: "Submitted" },
];

export const TIMESHEET_DAYS = ["Mon 11", "Tue 12", "Wed 13", "Thu 14", "Fri 15", "Sat 16", "Sun 17"];

// ── sidebar nav ──────────────────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
  icon: IconName;
  badge?: string;
  exact?: boolean;
}
export interface NavGroup {
  group: string;
  items: NavItem[];
}

export const EMPLOYER_NAV: NavGroup[] = [
  {
    group: "Workforce",
    items: [
      { label: "Dashboard", href: "/employer", icon: "grid", exact: true },
      { label: "Employees", href: "/employer/employees", icon: "team", badge: "8" },
      { label: "Timesheets", href: "/employer/timesheets", icon: "clock", badge: "2" },
    ],
  },
  {
    group: "Hiring",
    items: [
      { label: "Jobs", href: "/employer/jobs", icon: "brief", badge: "7" },
      { label: "Create job", href: "/employer/jobs/new", icon: "plus", exact: true },
    ],
  },
  {
    group: "Admin",
    items: [
      { label: "Clients", href: "/employer/clients", icon: "brief" },
      { label: "Team & invites", href: "/employer/team", icon: "users" },
      { label: "Messages", href: "/employer/messages", icon: "mail" },
    ],
  },
];
