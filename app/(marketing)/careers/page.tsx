import type { Metadata } from "next";
import { Globe2, GraduationCap, TrendingUp, HeartPulse } from "lucide-react";
import {
  Accent,
  SectionHead,
  PageHero,
  CtaStrip,
} from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import JobBoard from "@/components/JobBoard";

export const metadata: Metadata = {
  title: "Careers at Technograph | Build What's Next",
  description:
    "Join Technograph — a remote-first IT staffing and consulting firm. Work alongside elite engineers, consultants, and technologists.",
};

const perks = [
  {
    i: Globe2,
    t: "Remote-first",
    d: "Work from anywhere in the US. We're built for distributed teams, not mandatory desks.",
  },
  {
    i: GraduationCap,
    t: "Learn from the best",
    d: "Sit alongside senior architects and consultants on Fortune-class problems every day.",
  },
  {
    i: TrendingUp,
    t: "Real growth paths",
    d: "Certifications, mentorship, and clear ladders — we invest in where you're headed.",
  },
  {
    i: HeartPulse,
    t: "Benefits that matter",
    d: "Full medical, 401(k) match, generous PTO, and a learning stipend that's actually usable.",
  },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title={
          <>
            Build a career that builds the <Accent>future.</Accent>
          </>
        }
        lead="We're a team of former engineers, consultants, and technologists who solve real business problems. If you want to work on the technology that defines the modern enterprise — with people who take the craft seriously — you'll fit right in."
        image="/images/careers.jpg"
        imageLabel="Life at Technograph · team"
      >
        <Button asChild size="lg" variant="navy">
          <a href="#openings">See open roles →</a>
        </Button>
      </PageHero>

      <section className="container-x py-24">
        <SectionHead
          eyebrow="Life at Technograph"
          title="Work that respects your craft — and your life."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map(({ i: Icon, t, d }) => (
            <div key={t} className="rounded-lg border bg-card p-7 shadow-card">
              <Icon className="h-6 w-6 text-primary" />
              <h3 className="mt-5 font-semibold text-navy">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <JobBoard />

      <CtaStrip
        eyebrow="Don't see your role?"
        title="We're always looking for exceptional people."
        lead="Send us your résumé and tell us what you're great at. When the right opening appears, you'll be first to know."
        button="Send your résumé →"
        to="/contact"
      />
    </>
  );
}
