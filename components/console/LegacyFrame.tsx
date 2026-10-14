import type { ReactNode } from "react";

/**
 * Wraps portal/employer page bodies so legacy `console.css` rules (`.kpi`, `.tbl`, `.seg`, …) apply.
 * New Lovable chrome lives in ConsoleShell; inner pages still use the old class names.
 */
export function ConsoleLegacyFrame({ children }: { children: ReactNode }) {
  return (
    <div className="tgc tgc-inner flex min-h-0 flex-1 flex-col">
      <div className="main flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
