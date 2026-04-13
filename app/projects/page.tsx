import { FeaturedProjects } from "@/components/featured-projects";
import { LagImageWindow } from "@/components/lag-image-window";
import { PageShell } from "@/components/page-shell";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SkipToRail } from "@/components/skip-to-rail";
import { featuredProjects } from "@/lib/site-data";

export default function ProjectsPage() {
  return (
    <PageShell>
      <SkipToRail
        items={[
          { label: "Overview", href: "#projects-overview" },
          { label: "Featured", href: "#projects-featured" },
          { label: "All Projects", href: "#projects-all" },
          { label: "Start a Project", href: "#projects-cta" }
        ]}
      />

      <section id="projects-overview" className="section-space">
        <div className="container-shell">
          <SectionHeading
            kicker="Projects"
            title="A focused project page built for fast client review."
            text="This page gives decision-makers a clean, dedicated view of Monricher's construction portfolio."
          />
        </div>
      </section>

      <LagImageWindow
        image="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1800&q=80"
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
            kicker="Project Library"
            title="More completed work across residential and commercial categories."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <Reveal key={project.title} delay={index * 0.04}>
                <article className="glass-panel rounded-[24px] p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                    {project.subtitle}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold text-white">{project.title}</h3>
                </article>
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
              Let's Build Your Vision
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted md:text-lg">
              Share your requirements and our team will map out the right plan and timeline.
            </p>
            <div className="mt-8 flex justify-center">
              <a href="/contact" className="button-primary w-full sm:w-auto">
                <span>Request a Free Consultation</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
