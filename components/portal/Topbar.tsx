import type { ReactNode } from "react";
import { PageHeader } from "@/components/console/ui";

export function Topbar({
  kicker,
  title,
  sub,
  actions,
}: {
  kicker?: string;
  title: ReactNode;
  sub?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <PageHeader
      kicker={kicker ?? ""}
      title={title}
      sub={sub}
      actions={actions}
    />
  );
}
