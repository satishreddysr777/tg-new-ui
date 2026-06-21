import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Technograph | Let's Build a Future-Ready Workforce",
  description:
    "Talk to a Technograph talent acquisition manager. Whether you're hiring, applying, or partnering — let's shape the future of your workforce together.",
};

export default function ContactPage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="page-hero" style={{ paddingBottom: 0 }}>
        <div className="wrap">
          <span className="eyebrow">
            <span className="tick"></span>Contact us
          </span>
          <h1 className="display">
            Let&apos;s shape the future of your workforce,{" "}
            <span className="accent">together.</span>
          </h1>
          <p className="lead">
            Tell us what you&apos;re building. A talent acquisition manager will
            get back to you within one business day.
          </p>
        </div>
      </section>

      {/* ============ FORM + ASIDE ============ */}
      <section className="section">
        <div className="wrap contact-grid">
          <ContactForm />

          <aside className="contact-aside reveal d2">
            <h3>Talk to a person.</h3>
            <p
              className="body"
              style={{
                color: "var(--on-dark)",
                marginTop: "12px",
                fontSize: "15px",
              }}
            >
              Prefer to reach us directly? We&apos;re here.
            </p>
            <div style={{ marginTop: "24px" }}>
              <div className="info-block">
                <div className="lbl">Email</div>
                <div className="val">
                  <a href="mailto:hello@technograph.com">
                    hello@technograph.com
                  </a>
                </div>
              </div>
              <div className="info-block">
                <div className="lbl">Phone</div>
                <div className="val">
                  <a href="tel:+18005551234">+1 (800) 555-1234</a>
                </div>
                <div className="sub">Mon–Fri · 8am–6pm ET</div>
              </div>
              <div className="info-block">
                <div className="lbl">Offices</div>
                <div className="val">New York · Austin · Remote-first</div>
                <div className="sub">Serving enterprise clients worldwide.</div>
              </div>
              <div className="info-block">
                <div className="lbl">Response time</div>
                <div className="val">Within 1 business day</div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
