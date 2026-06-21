import type { IconName } from "./icons";

export interface NavItem {
  label: string;
  href: string;
  icon: IconName;
  badge?: string;
}

export interface NavGroup {
  group: string;
  items: NavItem[];
}

export const PORTAL_NAV: NavGroup[] = [
  {
    group: "My work",
    items: [
      { label: "Home", href: "/portal", icon: "grid" },
      { label: "My engagement", href: "/portal/engagement", icon: "brief" },
      { label: "Timesheet", href: "/portal/timesheet", icon: "clock" },
      { label: "Pay", href: "/portal/pay", icon: "cash" },
    ],
  },
  {
    group: "My career",
    items: [
      { label: "Open roles", href: "/portal/roles", icon: "bolt" },
      { label: "My applications", href: "/portal/applications", icon: "users" },
    ],
  },
];
