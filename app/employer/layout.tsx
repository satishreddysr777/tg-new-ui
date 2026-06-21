import type { Metadata } from "next";
import { Sidebar } from "@/components/employer/Sidebar";

export const metadata: Metadata = {
  title: "Employer Console · Technograph",
};

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // position: relative so the applicant-detail modal (position: absolute)
    // covers the whole console rather than the document.
    <div className="tgc" style={{ height: "100dvh", position: "relative" }}>
      <div className="app">
        <Sidebar />
        <div className="main">{children}</div>
      </div>
    </div>
  );
}
