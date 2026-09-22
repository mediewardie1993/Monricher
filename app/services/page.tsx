import { LagImageWindow } from "@/components/lag-image-window";
import { PageShell } from "@/components/page-shell";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCard } from "@/components/service-card";
import { SkipToRail } from "@/components/skip-to-rail";
import { TiltCard } from "@/components/tilt-card";
import { serviceItems } from "@/lib/site-data";
import { withBasePath } from "@/lib/base-path";

export default function ServicesPage() {
  return (
    <PageShell>
      <SkipToRail
        items={[
          { label: "Overview", href: "#services-overview" },
          { label: "Core Services", href: "#services-core" },
          { label: "Process", href: "#services-process" },
          { label: "Get a Quote", href: "#services-cta" }
        ]}
      />

      <section id="services-overview" className="section-space">
        <div className="container-shell">
          <SectionHeading
            kicker="Services"
            title="High quality design and construction, for all industries."
            text="From consultation and design through demolition, electrical, mechanical, and plumbing works — handled by our own certified team."
          />
        </div>
      </section>

      <section id="services-core" className="section-space bg-white/[0.02]">
        <div className="container-shell">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {serviceItems.map((item, index) => (
              <ServiceCard key={item.title} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      <LagImageWindow
        image="/photos/medical-city-counter.jpg"
        kicker="Execution"
        title="Every service is delivered with structure, visibility, and professional pace."
      />

      <section id="services-process" className="section-space">
        <div className="container-shell">
          <SectionHeading
            kicker="Process"
            title="Simple steps that keep projects organized from planning to handover."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              "Consultation and site assessment",
              "Scope, costing, and planning",
              "Execution with milestone updates",
              "Final quality review and turnover"
            ].map((item, index) => (
              <Reveal key={item} delay={index * 0.05}>
                <TiltCard className="glass-panel rounded-[22px] p-6">
                  <p className="text-lg font-semibold text-white">{item}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="services-cta" className="section-space bg-white/[0.02]">
        <div className="container-shell">
          <Reveal className="glass-panel rounded-[28px] p-8 text-center md:p-12">
            <p className="section-kicker">Ready To Start</p>
            <h2 className="text-4xl font-bold text-white md:text-5xl">Request a Project Quote</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted md:text-lg">
              Share your project details and we will guide you to the best service package.
            </p>
            <div className="mt-8 flex justify-center">
              <a href={withBasePath("/contact")} className="button-primary w-full sm:w-auto">
                <span>Get a Free Quote</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
