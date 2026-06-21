import type { Metadata } from "next";
import { PortalGate } from "@/components/portal/PortalGate";

export const metadata: Metadata = {
  title: "Employee Console · Technograph",
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="tgc" style={{ height: "100dvh" }}>
      <PortalGate>{children}</PortalGate>
    </div>
  );
}
