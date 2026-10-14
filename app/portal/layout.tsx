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
    <div className="min-h-screen">
      <PortalGate>{children}</PortalGate>
    </div>
  );
}
