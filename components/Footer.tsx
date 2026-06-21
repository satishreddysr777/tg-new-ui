import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link
              className="brand"
              href="/"
              style={{ marginBottom: "18px" }}
            >
              <span
                className="glyph"
                style={{ background: "var(--cream)", color: "var(--ink)" }}
              >
                T
              </span>
              <span className="word">TECHNOGRAPH</span>
            </Link>
            <p
              className="body"
              style={{
                color: "var(--on-dark)",
                maxWidth: "300px",
                fontSize: "14.5px",
              }}
            >
              Smarter talent. Stronger systems. Future-ready IT — engineered for
              long-term impact.
            </p>
          </div>
          <div>
            <h5>Services</h5>
            <ul>
              <li>
                <Link href="/services/cloud">Cloud &amp; Data Analytics</Link>
              </li>
              <li>
                <Link href="/services/aem">Adobe Experience Manager</Link>
              </li>
              <li>
                <Link href="/services/big-data">Big Data Solutions</Link>
              </li>
              <li>
                <Link href="/services/emerging-tech">
                  Emerging Technologies
                </Link>
              </li>
              <li>
                <Link href="/services/digital-transformation">
                  Digital Transformation
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5>Company</h5>
            <ul>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="/careers">Careers</Link>
              </li>
            </ul>
          </div>
          <div>
            <h5>Get in touch</h5>
            <ul>
              <li>
                <a href="mailto:hello@technograph.com">hello@technograph.com</a>
              </li>
              <li>
                <a href="tel:+18005551234">+1 (800) 555-1234</a>
              </li>
              <li>
                <Link href="/contact">Talk to a manager →</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Technograph. All rights reserved.</span>
          <span>IT Staffing &amp; Consulting</span>
        </div>
      </div>
    </footer>
  );
}
