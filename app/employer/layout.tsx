import type { Metadata } from "next";
import { EmployerChrome } from "@/components/employer/EmployerChrome";

export const metadata: Metadata = {
  title: "Employer Console · Technograph",
};

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen" style={{ position: "relative" }}>
      <EmployerChrome>{children}</EmployerChrome>
    </div>
  );
}
