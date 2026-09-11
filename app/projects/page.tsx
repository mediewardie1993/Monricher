import { FeaturedProjects } from "@/components/featured-projects";
import { LagImageWindow } from "@/components/lag-image-window";
import { PageShell } from "@/components/page-shell";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SkipToRail } from "@/components/skip-to-rail";
import { TiltCard } from "@/components/tilt-card";
import { withBasePath } from "@/lib/base-path";

const projectDetails = [
  {
    title: "The Medical City Clinics",
    detail: "Built across TriNoma, SM City Sta. Rosa, Robinsons Antipolo, SM City Olongapo, SM City Roxas, SM Grand Central, and SM City Cauayan."
  },
  {
    title: "Ricardo L. Laxamana Hospital",
    detail: "A full hospital construction project in Bulacan, from structural works through interior fit-out."
  },
  {
    title: "Moldex Residences",
    detail: "Residential builds across the Jasmine, Ivanah, and Blanche house models."
  }
];

export default function ProjectsPage() {
  return (
    <PageShell>
      <SkipToRail
        items={[
          { label: "Overview", href: "#projects-overview" },
          { label: "Featured", href: "#projects-featured" },
          { label: "Details", href: "#projects-all" },
          { label: "Start a Project", href: "#projects-cta" }
        ]}
      />

      <section id="projects-overview" className="section-space">
        <div className="container-shell">
          <SectionHeading
            kicker="Projects"
            title="A focused project page built for fast client review."
            text="A dedicated view of Monricher's completed work across medical, hospital, and residential builds."
          />
        </div>
      </section>

      <LagImageWindow
        image="/photos/rll-hospital-2.jpg"
        heightClassName="min-h-[18rem] sm:min-h-[22rem] md:min-h-[28rem] lg:min-h-[34rem]"
        kicker="Portfolio Focus"
        title="Built work speaks louder with clean presentation."
      />

      <section id="projects-featured" className="section-space bg-white/[0.02]">
        <FeaturedProjects />
      </section>

      <section id="projects-all" className="section-space">
        <div className="container-shell">
          <SectionHeading
            kicker="Where We've Built"
            title="A closer look at each project's scope."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projectDetails.map((project, index) => (
              <Reveal key={project.title} delay={index * 0.04}>
                <TiltCard className="glass-panel h-full rounded-[24px] p-6">
                  <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                  <p className="mt-3 text-base leading-7 text-muted">{project.detail}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="projects-cta" className="section-space bg-white/[0.02]">
        <div className="container-shell">
          <Reveal className="glass-panel rounded-[28px] p-8 text-center md:p-12">
            <p className="section-kicker">Next Step</p>
            <h2 className="text-balance text-4xl font-bold text-white md:text-5xl">
              Let's Build Something Together
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted md:text-lg">
              Share your requirements and our team will map out the right plan and timeline.
            </p>
            <div className="mt-8 flex justify-center">
              <a href={withBasePath("/contact")} className="button-primary w-full sm:w-auto">
                <span>Reach Out Now</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
