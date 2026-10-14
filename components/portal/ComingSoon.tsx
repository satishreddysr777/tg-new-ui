import { Topbar } from "./Topbar";
import { Body, Placeholder } from "@/components/console/ui";

export function ComingSoon({
  kicker,
  title,
  sub,
  blurb,
}: {
  kicker?: string;
  title: string;
  sub?: string;
  icon?: string;
  blurb: string;
}) {
  return (
    <>
      <Topbar kicker={kicker} title={title} sub={sub} />
      <Body>
        <Placeholder title={`${title} is coming next`} blurb={blurb} />
      </Body>
    </>
  );
}
