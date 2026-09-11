import { LagImageWindow } from "@/components/lag-image-window";
import { PageShell } from "@/components/page-shell";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SkipToRail } from "@/components/skip-to-rail";
import { TiltCard } from "@/components/tilt-card";
import { WordReveal } from "@/components/word-reveal";
import { reasons } from "@/lib/site-data";
import { withBasePath } from "@/lib/base-path";

const aboutPoints = [
  ["100% Filipino-Owned", "A proudly Filipino capitalized corporation committed to excellent construction services with honesty and integrity."],
  ["Client-Focused Results", "We transform our clients' visions into reality and build relationships with them to ensure a client-focused result."],
  ["Certified Professionals", "Our team of professionals guarantees that every project meets the highest standards of quality and workmanship."],
  ["Safety-First Culture", "We value our people as our greatest resource and most valuable asset, embedding their safety in our company culture."]
];

export default function AboutPage() {
  return (
    <PageShell>
      <SkipToRail
        items={[
          { label: "Overview", href: "#about-overview" },
          { label: "Mission & Vision", href: "#about-mission" },
          { label: "Why Us", href: "#about-why-us" },
          { label: "Our Vision", href: "#about-vision" }
        ]}
      />

      <section id="about-overview" className="section-space">
        <div className="container-shell">
          <SectionHeading
            kicker="About Monricher"
            title="MONRICHER Construction & Development Corporation is a 100% Filipino capitalized corporation."
            text="We are committed to providing excellent construction services with honesty and integrity — transforming our clients' visions into reality and building relationships with them to ensure a client-focused result."
          />

          <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-2 xl:grid-cols-4">
            {aboutPoints.map(([title, text], index) => (
              <Reveal key={title} delay={index * 0.08}>
                <TiltCard className="glass-panel h-full rounded-[26px] p-5 md:p-6">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-sm font-bold text-white">
                    {`0${index + 1}`}
                  </div>
                  <h3 className="text-xl font-bold text-white">{title}</h3>
                  <p className="mt-3 text-base leading-7 text-muted">{text}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <LagImageWindow
        image="/photos/medical-city-desk.png"
        heightClassName="min-h-[16rem] sm:min-h-[20rem] md:min-h-[24rem] lg:min-h-[30rem]"
        kicker="Built Environment"
        title="High quality design and construction for every industry."
        text="From hospital wards to retail clinics, we deliver spaces that hold up to real-world use without losing their finish."
      />

      <section id="about-mission" className="section-space bg-white/[0.02]">
        <div className="container-shell">
          <div className="grid gap-5 md:grid-cols-2">
            <Reveal delay={0.1}>
              <TiltCard className="glass-panel h-full rounded-[26px] p-6 md:p-8">
                <span className="section-kicker">Mission</span>
                <p className="mt-3 text-base leading-8 text-slate-100">
                  To perform for our customers the highest level of quality construction — honesty and integrity
                  with a personal touch that builds long-term relationships and growth. To deliver quality,
                  cost-effective projects on schedule by employing motivated, flexible, and focused teams, and
                  to serve with character and purpose.
                </p>
              </TiltCard>
            </Reveal>
            <Reveal delay={0.16}>
              <TiltCard className="glass-panel h-full rounded-[26px] p-6 md:p-8">
                <span className="section-kicker">Vision</span>
                <p className="mt-3 text-base leading-8 text-slate-100">
                  To form and maintain a team of highly skilled construction professionals who serve our
                  clients with honesty, integrity, trust, and respect — whether owner, architect, engineer, or
                  supplier. Open project leadership yields not only successful builds, but satisfied customers.
                </p>
              </TiltCard>
            </Reveal>
          </div>
        </div>
      </section>

      <LagImageWindow
        image="/photos/rll-hospital-corridor.jpg"
        heightClassName="min-h-[16rem] sm:min-h-[20rem] md:min-h-[24rem] lg:min-h-[30rem]"
        kicker="Modern Delivery"
        title="New construction, renovation, expansion, and demolition."
      />

      <section id="about-why-us" className="section-space">
        <div className="container-shell">
          <SectionHeading
            kicker="Why Choose Us"
            title="Modern presentation backed by dependable project discipline."
            text="We value the importance of customer relationships and remain fair and true in our dealings with employees, clients, and partners."
          />

          <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-2 xl:grid-cols-3">
            {reasons.map((item, index) => (
              <Reveal key={item} delay={index * 0.05}>
                <TiltCard className="glass-panel rounded-[24px] p-6">
                  <p className="text-lg font-semibold leading-8 text-white">{item}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="about-vision" className="section-space bg-white/[0.02]">
        <div className="container-shell">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="section-kicker mx-auto justify-center">Our Vision</span>
            <WordReveal
              as="blockquote"
              text={`"You are a respected member of our team — regardless of whether you are an owner, architect, engineer, or supplier."`}
              className="mt-4 text-balance font-display text-[1.7rem] italic leading-[1.35] text-white sm:text-[2.2rem] md:text-[2.7rem]"
            />
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.24em] text-muted">
              — Monricher Vision Statement
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell">
          <Reveal className="glass-panel rounded-[28px] p-8 text-center md:p-12">
            <p className="section-kicker">Ready To Start</p>
            <h2 className="text-4xl font-bold text-white md:text-5xl">Let's discuss your next project</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted md:text-lg">
              Share your project details and the Monricher team will respond with clear next steps.
            </p>
            <div className="mt-8 flex justify-center">
              <a href={withBasePath("/contact")} className="button-primary w-full sm:w-auto">
                <span>Inquire Now</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
