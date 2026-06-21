import { Topbar } from "./Topbar";
import { Icon, type IconName } from "./icons";

/** Placeholder screen used by employee-console routes not yet implemented. */
export function ComingSoon({
  kicker,
  title,
  sub,
  icon,
  blurb,
}: {
  kicker?: string;
  title: string;
  sub?: string;
  icon: IconName;
  blurb: string;
}) {
  return (
    <>
      <Topbar kicker={kicker} title={title} sub={sub} />
      <div className="content">
        <div className="empty">
          <span className="ic">
            <Icon name={icon} size={22} />
          </span>
          <h3>{title} is coming next</h3>
          <p style={{ maxWidth: 420, margin: "8px auto 0" }}>{blurb}</p>
        </div>
      </div>
    </>
  );
}
