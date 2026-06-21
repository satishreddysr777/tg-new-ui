import { Icon, type IconName } from "./Icon";

const FEATURES: [string, IconName][] = [
  ["Log time against your engagement", "clock"],
  ["Track pay and tax documents", "cash"],
  ["Line up what’s next, matched to you", "bolt"],
];

export function AuthAside() {
  return (
    <aside className="aside">
      <div className="engrave" />

      <div className="brand">
        <span className="glyph">T</span>
        <span className="word">Technograph</span>
      </div>

      <div style={{ position: "relative" }}>
        <span className="eyebrow" style={{ color: "var(--copper)" }}>
          <span className="tick" style={{ background: "var(--copper)" }} />
          Employee portal
        </span>
        <h1>
          Your engagement,
          <br />
          hours, and pay —<br />
          in one place.
        </h1>
        <div className="feats">
          {FEATURES.map(([label, icon]) => (
            <div key={label} className="feat">
              <span className="ic">
                <Icon name={icon} size={15} />
              </span>
              {label}
            </div>
          ))}
        </div>
      </div>

      <div className="foot">
        <span>© 2026 TECHNOGRAPH</span>
        <span>SOC 2 · SSO READY</span>
      </div>
    </aside>
  );
}
