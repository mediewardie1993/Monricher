import { FeaturedProjects } from "@/components/featured-projects";
import { LagImageWindow } from "@/components/lag-image-window";
import { PageShell } from "@/components/page-shell";
import { ProjectGalleryCard } from "@/components/project-gallery-card";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SkipToRail } from "@/components/skip-to-rail";
import { TiltCard } from "@/components/tilt-card";
import { withBasePath } from "@/lib/base-path";
import { additionalProjects, projectGalleries } from "@/lib/site-data";

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
            text="Click any photo to view it larger."
          />

          <div className="mt-10 space-y-16">
            {projectGalleries.map((group) => (
              <div key={group.category}>
                <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
                  {group.category}
                </h3>
                <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {group.projects.map((project, index) => (
                    <Reveal key={project.title} delay={index * 0.04}>
                      <ProjectGalleryCard project={project} />
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
              Extra Projects
            </h3>
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {additionalProjects.map((project, index) => (
                <Reveal key={project.title} delay={index * 0.04}>
                  <TiltCard className="glass-panel h-full overflow-hidden rounded-[24px]">
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-6">
                      <h4 className="text-2xl font-bold text-white">{project.title}</h4>
                      <p className="mt-3 text-base leading-7 text-muted">{project.detail}</p>
                    </div>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
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
