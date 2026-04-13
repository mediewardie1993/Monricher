import { LagImageWindow } from "@/components/lag-image-window";
import { PageShell } from "@/components/page-shell";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SkipToRail } from "@/components/skip-to-rail";

const teamMembers = [
  {
    name: "Miguel Santos",
    role: "Project Director",
    bio: "Leads major construction programs with a strong focus on schedule discipline and client visibility."
  },
  {
    name: "Carla Mendoza",
    role: "Lead Architect",
    bio: "Brings modern design direction while ensuring buildability, compliance, and practical long-term value."
  },
  {
    name: "Rafael Cruz",
    role: "Construction Manager",
    bio: "Coordinates site execution, quality standards, and daily operations for smooth project delivery."
  },
  {
    name: "Isabella Reyes",
    role: "Client Relations Lead",
    bio: "Keeps communication clear across every phase, helping clients feel informed and confident."
  }
];

export default function TeamPage() {
  return (
    <PageShell>
      <SkipToRail
        items={[
          { label: "Overview", href: "#team-overview" },
          { label: "Leadership", href: "#team-members" },
          { label: "Culture", href: "#team-culture" },
          { label: "Work With Us", href: "#team-cta" }
        ]}
      />

      <section id="team-overview" className="section-space">
        <div className="container-shell">
          <SectionHeading
            kicker="Team"
            title="A trusted team built around workmanship, accountability, and professional care."
            text="Monricher combines technical expertise and client-focused communication to keep each build clear and dependable."
          />
        </div>
      </section>

      <section id="team-members" className="section-space bg-white/[0.02]">
        <div className="container-shell">
          <div className="grid gap-5 md:grid-cols-2">
            {teamMembers.map((member, index) => (
              <Reveal key={member.name} delay={index * 0.06}>
                <article className="glass-panel rounded-[26px] p-7">
                  <p className="section-kicker">{member.role}</p>
                  <h3 className="mt-2 text-3xl font-bold text-white">{member.name}</h3>
                  <p className="mt-4 text-base leading-8 text-muted">{member.bio}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <LagImageWindow
        image="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=80"
        kicker="Team Culture"
        title="Clear coordination and strong field execution create calmer project experiences."
      />

      <section id="team-culture" className="section-space">
        <div className="container-shell">
          <SectionHeading
            kicker="How We Work"
            title="Professional standards that support both project quality and client confidence."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[
              "Transparent milestone updates",
              "Safety and quality-first operations",
              "Cross-functional collaboration",
              "Strong documentation practices",
              "Timely issue resolution",
              "Respectful client support"
            ].map((item, index) => (
              <Reveal key={item} delay={index * 0.04}>
                <article className="glass-panel rounded-[22px] p-6">
                  <p className="text-lg font-semibold text-white">{item}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="team-cta" className="section-space bg-white/[0.02]">
        <div className="container-shell">
          <Reveal className="glass-panel rounded-[28px] p-8 text-center md:p-12">
            <p className="section-kicker">Let's Collaborate</p>
            <h2 className="text-4xl font-bold text-white md:text-5xl">Talk to the Monricher Team</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted md:text-lg">
              Tell us about your project and our team will guide you through the next steps.
            </p>
            <div className="mt-8 flex justify-center">
              <a href="/contact" className="button-primary w-full sm:w-auto">
                <span>Contact the Team</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
