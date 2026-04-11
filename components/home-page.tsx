import { FeaturedProjects } from "@/components/featured-projects";
import { ConstructionChatbot } from "@/components/construction-chatbot";
import { Reveal } from "@/components/reveal";
import { reasons, serviceItems, testimonials } from "@/lib/site-data";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

function SectionHeading({
  kicker,
  title,
  text,
  align = "center"
}: {
  kicker: string;
  title: string;
  text: string;
  align?: "center" | "left";
}) {
  return (
    <Reveal className={align === "left" ? "max-w-2xl" : "mx-auto max-w-3xl text-center"}>
      <span className="section-kicker">{kicker}</span>
      <h2 className="text-balance text-3xl font-bold leading-tight text-white md:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-lg leading-8 text-muted">{text}</p>
    </Reveal>
  );
}

export function HomePage() {
  return (
    <div className="relative overflow-x-clip">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-hero-grid bg-[size:120px_120px] opacity-20 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        aria-hidden="true"
      />
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden pb-20 pt-14 md:pb-28 md:pt-24">
          <div
            className="absolute inset-0 bg-[linear-gradient(120deg,rgba(6,12,20,0.88),rgba(6,12,20,0.62),rgba(6,12,20,0.9)),url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center"
            aria-hidden="true"
          />
          <div className="container-shell relative grid items-end gap-10 lg:grid-cols-[1.2fr_0.78fr]">
            <Reveal className="max-w-3xl py-10 md:py-20">
              <span className="section-kicker">Modern Building. Lasting Trust.</span>
              <h1 className="text-balance text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-7xl">
                Creating construction spaces that feel premium, dependable, and built for the future.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 md:text-xl">
                Monricher Construction delivers residential, commercial, and fit-out projects with
                disciplined planning, professional execution, and a client experience designed to
                feel clear from day one.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#contact" className="button-primary">
                  Get a Free Quote
                </a>
                <a href="#projects" className="button-secondary">
                  View Projects
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-6 text-sm font-semibold text-slate-200">
                <span>Clear communication</span>
                <span>Premium workmanship</span>
                <span>Reliable delivery</span>
              </div>
            </Reveal>

            <Reveal className="glass-panel rounded-[28px] p-6 md:p-8" delay={0.15}>
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-200">
                  Company Overview
                </p>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                  Trusted Delivery
                </span>
              </div>
              <div className="mt-6 grid gap-5">
                {[
                  ["12+", "Years of construction experience"],
                  ["180+", "Projects delivered across residential and commercial work"],
                  ["98%", "Client satisfaction on fit-out and build projects"]
                ].map(([value, label]) => (
                  <div key={label} className="border-t border-white/10 pt-5 first:border-t-0 first:pt-0">
                    <p className="text-3xl font-bold text-white md:text-4xl">{value}</p>
                    <p className="mt-2 text-base leading-7 text-muted">{label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="-mt-6 pb-16 md:-mt-10 md:pb-24">
          <div className="container-shell">
            <Reveal>
              <div className="grid gap-4 rounded-[30px] border border-white/10 bg-white/[0.04] p-5 shadow-soft backdrop-blur-xl md:grid-cols-2 md:p-6 xl:grid-cols-4">
                {[
                  ["180+", "Successful projects"],
                  ["45+", "Skilled specialists"],
                  ["98%", "Client satisfaction"],
                  ["24/6", "Project support window"]
                ].map(([value, label], index) => (
                  <div
                    key={label}
                    className={`rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 ${
                      index === 0 ? "xl:col-span-1" : ""
                    }`}
                  >
                    <p className="text-3xl font-bold text-white md:text-4xl">{value}</p>
                    <p className="mt-2 text-base leading-7 text-muted">{label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section id="about" className="section-space">
          <div className="container-shell">
            <SectionHeading
              kicker="About Monricher"
              title="A professional construction partner built around trust, planning, and refined execution."
              text="We bring together clear communication, strong site coordination, and premium finishing standards to create spaces that feel modern without losing warmth or practicality."
            />

            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {[
                ["Quality Craftsmanship", "Detail-focused execution with durable materials and strong finishing standards."],
                ["Reliable Delivery", "Structured planning and accountability that keep each project moving with confidence."],
                ["Trusted Team", "Experienced professionals who prioritize discipline, communication, and care."],
                ["Client-Focused Service", "A straightforward experience designed to be easy to follow at every stage."]
              ].map(([title, text], index) => (
                <Reveal key={title} delay={index * 0.08}>
                  <article className="glass-panel h-full rounded-[26px] p-6">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-sm font-bold text-white">
                      {`0${index + 1}`}
                    </div>
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <p className="mt-3 text-base leading-7 text-muted">{text}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="section-space bg-white/[0.02]">
          <div className="container-shell">
            <SectionHeading
              kicker="Services"
              title="A comprehensive set of construction services, shaped for clarity and premium delivery."
              text="Each service is presented in a straightforward way so homeowners, business owners, and decision-makers can understand the value quickly."
            />

            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {serviceItems.map((item, index) => (
                <Reveal key={item.title} delay={index * 0.06}>
                  <article className="glass-panel h-full rounded-[28px] p-7 transition duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-glow">
                    <div className="mb-8 flex items-center justify-between gap-4">
                      <div className="h-14 w-14 rounded-[18px] border border-white/10 bg-gradient-to-br from-accent/20 to-white/5" />
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
                        {`0${index + 1}`}
                      </span>
                    </div>
                    <h3 className="max-w-[14ch] text-2xl font-bold leading-tight text-white">{item.title}</h3>
                    <p className="mt-4 text-base leading-7 text-muted">{item.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-10 flex justify-center">
              <a href="#contact" className="button-secondary">
                Get a Quote
              </a>
            </Reveal>
          </div>
        </section>

        <FeaturedProjects />

        <section id="why-us" className="section-space bg-white/[0.02]">
          <div className="container-shell">
            <SectionHeading
              kicker="Why Choose Us"
              title="Modern presentation backed by dependable project discipline."
              text="We keep the experience simple, professional, and reassuring for clients who want strong results without unnecessary complexity."
            />

            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {reasons.map((item, index) => (
                <Reveal key={item} delay={index * 0.05}>
                  <article className="glass-panel rounded-[24px] p-6">
                    <p className="text-lg font-semibold leading-8 text-white">{item}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="section-space">
          <div className="container-shell">
            <SectionHeading
              kicker="Testimonials"
              title="What clients appreciate most is the confidence they feel throughout the process."
              text="We keep every testimonial readable and grounded so the section builds trust rather than feeling decorative."
            />

            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {testimonials.map((item, index) => (
                <Reveal key={item.name} delay={index * 0.08}>
                  <article className="glass-panel h-full rounded-[26px] p-6">
                    <p className="text-base leading-8 text-slate-100">"{item.quote}"</p>
                    <div className="mt-8">
                      <p className="font-bold text-white">{item.name}</p>
                      <p className="text-sm text-muted">{item.location}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section-space bg-white/[0.02]">
          <div className="container-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionHeading
              kicker="Contact"
              title="Let's discuss your next project with clarity from the very beginning."
              text="The contact area is designed for comfort and readability, with clear inputs and visible contact information."
              align="left"
            />

            <Reveal className="glass-panel rounded-[30px] p-6 md:p-8">
              <form className="grid gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-bold text-slate-100">
                    Name
                    <input
                      type="text"
                      placeholder="Your full name"
                      className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-base text-white outline-none transition focus:border-accent/50 focus:ring-4 focus:ring-accent/10"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-slate-100">
                    Contact Number
                    <input
                      type="tel"
                      placeholder="Your phone number"
                      className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-base text-white outline-none transition focus:border-accent/50 focus:ring-4 focus:ring-accent/10"
                    />
                  </label>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-bold text-slate-100">
                    Email
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-base text-white outline-none transition focus:border-accent/50 focus:ring-4 focus:ring-accent/10"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-slate-100">
                    Project Type
                    <select className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-base text-white outline-none transition focus:border-accent/50 focus:ring-4 focus:ring-accent/10">
                      <option className="bg-panel">Select project type</option>
                      <option className="bg-panel">Residential Construction</option>
                      <option className="bg-panel">Commercial Construction</option>
                      <option className="bg-panel">Renovation & Remodeling</option>
                      <option className="bg-panel">Design & Build</option>
                      <option className="bg-panel">Fit-Out Services</option>
                    </select>
                  </label>
                </div>
                <label className="grid gap-2 text-sm font-bold text-slate-100">
                  Message
                  <textarea
                    rows={6}
                    placeholder="Tell us about your project"
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-base text-white outline-none transition focus:border-accent/50 focus:ring-4 focus:ring-accent/10"
                  />
                </label>
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="text-sm leading-7 text-muted">
                    <p>Phone: +639-xxxxxxxxxx</p>
                    <p>Email: info@MRconstruction.com</p>
                  </div>
                  <button type="submit" className="button-primary">
                    Request Consultation
                  </button>
                </div>
              </form>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
      <ConstructionChatbot />
    </div>
  );
}
