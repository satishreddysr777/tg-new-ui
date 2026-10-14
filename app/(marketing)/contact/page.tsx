import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Accent, PageHero } from "@/components/site/SiteShell";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Technograph | Let's Build a Future-Ready Workforce",
  description:
    "Talk to a Technograph talent acquisition manager. Whether you're hiring, applying, or partnering — let's shape the future of your workforce together.",
};

function Item({
  icon: Icon,
  t,
  children,
}: {
  icon: typeof Mail;
  t: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-4">
      <Icon className="mt-0.5 h-5 w-5 text-teal" />
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-navy-muted">{t}</p>
        <p className="mt-1">{children}</p>
      </div>
    </li>
  );
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact us"
        title={
          <>
            Let's shape the future of your workforce, <Accent>together.</Accent>
          </>
        }
        lead="Tell us what you're building. A talent acquisition manager will get back to you within one business day."
      />
      <section className="container-x grid gap-10 py-20 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-xl border bg-card p-8 shadow-card md:p-10">
          <ContactForm />
        </div>
        <aside className="rounded-xl bg-navy-gradient p-8 text-navy-foreground md:p-10">
          <h2 className="text-2xl font-semibold">Talk to a person.</h2>
          <p className="mt-2 text-navy-muted">Prefer to reach us directly? We're here.</p>
          <ul className="mt-8 space-y-6 text-sm">
            <Item icon={Mail} t="Email">
              <a href="mailto:hello@technograph.com" className="hover:underline">
                hello@technograph.com
              </a>
            </Item>
            <Item icon={Phone} t="Phone">
              +1 (800) 555-1234
              <br />
              <span className="text-navy-muted">Mon–Fri · 8am–6pm ET</span>
            </Item>
            <Item icon={MapPin} t="Offices">
              New York · Austin · Remote-first
              <br />
              <span className="text-navy-muted">Serving enterprise clients worldwide.</span>
            </Item>
            <Item icon={Clock} t="Response time">Within 1 business day</Item>
          </ul>
        </aside>
      </section>
    </>
  );
}
