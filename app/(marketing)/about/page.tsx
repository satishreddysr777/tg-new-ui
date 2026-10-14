import Link from "next/link";
import type { Metadata } from "next";
import {
  Accent,
  SectionHead,
  Photo,
  PageHero,
} from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Technograph | IT Staffing & Digital Innovation Partner",
  description:
    "Discover our 20-year legacy of innovation across cloud, big data, and next-gen infrastructure.",
};

const values = [
  [
    "01",
    "Precision in Talent",
    "We don't just place candidates — we integrate experts who understand your industry, your tools, and your timeline.",
  ],
  [
    "02",
    "Partnership, Not Just Placement",
    "Every client engagement is a collaboration. We embed ourselves in your challenges and act as strategic allies.",
  ],
  [
    "03",
    "Visionary Recruiting",
    "We scout not just for skills, but for foresight — identifying individuals who can grow with your business, not just fit into it today.",
  ],
];

const focus = [
  [
    "01",
    "Next-Gen Infrastructure",
    "Build the digital backbone your business needs to scale. We deploy experts who architect modern, cloud-based, and hybrid infrastructures that support agility, security, and long-term growth.",
  ],
  [
    "02",
    "Human Capital Tech",
    "Empower your workforce through smarter platforms. From HCM tools to employee engagement systems, we implement technology that elevates how your people work, collaborate, and grow.",
  ],
  [
    "03",
    "Data Visualisation & Analytics",
    "Find the signal in the noise — and act on it. Our analytics professionals design dashboards and reporting systems that turn raw data into real-time insights for faster, smarter decisions.",
  ],
  [
    "04",
    "Master Data Management",
    "Make your data clean, complete, and trustworthy. We help organizations build centralized, accurate, and consistent data environments that support reporting, compliance, and transformation.",
  ],
  [
    "05",
    "Enterprise Collaboration",
    "Unleash the full potential of team productivity. Whether Microsoft Teams, Slack, Confluence, or custom suites, we improve communication, content management, and knowledge sharing.",
  ],
  [
    "06",
    "Pervasive Computing",
    "Bring intelligent technology into everyday workflows. From IoT to edge computing, we embed smart devices and systems that drive automation, efficiency, and smarter interactions in real time.",
  ],
  [
    "07",
    "Cybersecurity Strategy",
    "Protect what matters most with proactive defence. Our consultants develop comprehensive strategies that secure your data, safeguard infrastructure, and ensure compliance in an evolving threat landscape.",
  ],
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Technograph"
        title={
          <>
            Tech talent that moves business <Accent>forward.</Accent>
          </>
        }
        lead="We don't just scout talent — we engineer long-term impact. For more than two decades, Technograph has been the trusted partner to businesses seeking future-ready IT solutions."
        image="/images/leadership.jpg"
        imageLabel="Technograph leadership & consultants"
      />

      <section className="container-x grid gap-12 py-24 lg:grid-cols-2">
        <SectionHead
          eyebrow="Who we are"
          title="Born at the intersection of innovation and integrity."
        />
        <div className="space-y-5 text-lg text-muted-foreground">
          <p>
            For more than 20 years, Technograph has been a trusted partner to businesses
            seeking future-ready IT solutions. We exist to bridge the gap between
            high-growth ambitions and the technical talent that brings them to life.
          </p>
          <p>
            Our roots run deep in the IT ecosystem — spanning Java-based frameworks,
            open-source solutions, cloud platforms, cybersecurity, and data science. But
            what truly sets us apart is how we match the right people to the right
            problems, and deliver results that last.
          </p>
        </div>
      </section>

      <section className="border-y bg-card py-24">
        <div className="container-x">
          <SectionHead
            eyebrow="What we stand for"
            title="Principles that shape every placement."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map(([n, t, d]) => (
              <div key={n} className="border-t-2 border-primary pt-6">
                <p className="font-mono text-sm text-primary">{n}</p>
                <h3 className="mt-3 text-xl font-semibold text-navy">{t}</h3>
                <p className="mt-3 text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-24">
        <SectionHead
          eyebrow="Our focus areas"
          title="Talent that transforms entire ecosystems."
          lead="We deliver the kind of strategic talent that shapes how organizations operate, scale, and succeed — where innovation meets execution."
        />
        <div className="mt-12 divide-y border-y">
          {focus.map(([n, t, d]) => (
            <div
              key={n}
              className="grid gap-3 py-7 md:grid-cols-[4rem_18rem_1fr] md:gap-8"
            >
              <span className="font-mono text-sm text-primary">{n}</span>
              <h3 className="text-lg font-semibold text-navy">{t}</h3>
              <p className="text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-navy-gradient py-24">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHead
              light
              eyebrow="Our signature offering"
              title="Custom Talent Integration Solutions"
            />
            <div className="mt-6 space-y-4 text-navy-muted">
              <p>
                This isn't just a staffing model — it's a precision-built process to
                identify, align, and integrate the right minds into your business.
              </p>
              <p>
                Every placement is shaped by your unique goals, culture, and vision. We go
                beyond the resume — assessing adaptability, foresight, and long-term
                potential — ensuring every hire is a strategic match, not just a technical
                one.
              </p>
            </div>
          </div>
          <Photo
            src="/images/strategy.jpg"
            label="Integration workshop · whiteboard"
            className="aspect-[4/3]"
          />
        </div>
      </section>

      <section className="container-x py-24 text-center">
        <p className="eyebrow">A final note</p>
        <p className="mx-auto mt-5 max-w-3xl text-2xl font-medium leading-snug text-navy md:text-3xl">
          At Technograph, we believe talent is the true engine of digital transformation.
          If you're building something that matters, we'll help you build it right.
        </p>
        <Button asChild size="lg" variant="navy" className="mt-8">
          <Link href="/contact">Let's talk →</Link>
        </Button>
      </section>
    </>
  );
}
