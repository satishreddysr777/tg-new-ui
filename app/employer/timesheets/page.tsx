import { Topbar } from "@/components/portal/Topbar";
import { Body, Placeholder } from "@/components/console/ui";

export default function TimesheetsPage() {
  return (
    <>
      <Topbar kicker="Workforce · Approval queue" title="Timesheets" />
      <Body>
        <Placeholder
          title="Timesheets is coming next"
          blurb="Weekly timesheet submission and approvals are coming soon. You'll review hours per employee and approve them right here."
        />
      </Body>
    </>
  );
}
