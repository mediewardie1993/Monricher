import { FeaturedProjects } from "@/components/featured-projects";
import { ConstructionChatbot } from "@/components/construction-chatbot";
import { HeroSection } from "@/components/hero-section";
import { LagImageWindow } from "@/components/lag-image-window";
import { Reveal } from "@/components/reveal";
import { reasons, serviceItems, testimonials } from "@/lib/site-data";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PointerGlow } from "@/components/pointer-glow";

export function HomePage() {
  return (
    <div id="top" className="relative overflow-x-clip">
      <PointerGlow />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-hero-grid bg-[size:120px_120px] opacity-20 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        aria-hidden="true"
      />
      <SiteHeader />

      <main>
        <HeroSection />

        <section className="relative z-10 py-14 md:py-20">
          <div className="container-shell">
            <Reveal className="mx-auto max-w-3xl text-center">
              <span className="section-kicker">Project Focus</span>
              <h2 className="mt-3 text-balance font-display text-[2rem] font-semibold leading-[0.95] text-white sm:text-[2.6rem] md:text-[3.2rem]">
                Built with precision. Delivered with confidence.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted md:text-lg">
                We keep every stage clear and professional so clients can follow the process with trust.
              </p>
            </Reveal>
          </div>
        </section>

        <LagImageWindow
          image="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1800&q=80"
          heightClassName="min-h-[22rem] sm:min-h-[26rem] md:min-h-[32rem] lg:min-h-[40rem]"
          className="pt-0 md:pt-0"
          kicker="Built Environment"
          title="Every section can carry the same calm premium motion."
          text="The image stays behind the content and trails slightly as the page moves, keeping the experience polished instead of noisy."
        />

        <section id="about" className="section-space">
          <div className="container-shell">
            <SectionHeading
              kicker="About Monricher"
              title="A professional construction partner built around trust, planning, and refined execution."
              text="We bring together clear communication, strong site coordination, and premium finishing standards to create spaces that feel modern without losing warmth or practicality."
            />

            <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-2 xl:grid-cols-4">
              {[
                ["Quality Craftsmanship", "Detail-focused execution with durable materials and strong finishing standards."],
                ["Reliable Delivery", "Structured planning and accountability that keep each project moving with confidence."],
                ["Trusted Team", "Experienced professionals who prioritize discipline, communication, and care."],
                ["Client-Focused Service", "A straightforward experience designed to be easy to follow at every stage."]
              ].map(([title, text], index) => (
                <Reveal key={title} delay={index * 0.08}>
                    <article className="glass-panel h-full rounded-[26px] p-5 md:p-6">
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

        <LagImageWindow
          image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80"
          heightClassName="min-h-[16rem] sm:min-h-[20rem] md:min-h-[24rem] lg:min-h-[30rem]"
          kicker="Modern Delivery"
          title="Clear visuals help each scroll section feel like its own scene."
        />

        <section id="services" className="section-space bg-white/[0.02]">
          <div className="container-shell">
            <SectionHeading
              kicker="Services"
              title="A comprehensive set of construction services, shaped for clarity and premium delivery."
              text="Each service is presented in a straightforward way so homeowners, business owners, and decision-makers can understand the value quickly."
            />

            <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-2 xl:grid-cols-3">
              {serviceItems.map((item, index) => (
                <Reveal key={item.title} delay={index * 0.06}>
                  <article className="glass-panel h-full rounded-[28px] p-5 sm:p-6 xl:p-7 transition duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-glow">
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
              <a href="#contact" className="button-secondary w-full sm:w-auto">
                <span>Get a Quote</span>
              </a>
            </Reveal>
          </div>
        </section>

        <LagImageWindow
          image="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=80"
          heightClassName="min-h-[16rem] sm:min-h-[20rem] md:min-h-[24rem] lg:min-h-[30rem]"
          kicker="Commercial Interior"
          title="A premium construction site should feel immersive, not flat."
        />

        <FeaturedProjects />

        <LagImageWindow
          image="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1800&q=80"
          heightClassName="min-h-[16rem] sm:min-h-[20rem] md:min-h-[24rem] lg:min-h-[30rem]"
          kicker="Residential Detail"
          title="Subtle motion keeps the page feeling current without losing trust."
        />

        <section id="why-us" className="section-space bg-white/[0.02]">
          <div className="container-shell">
            <SectionHeading
              kicker="Why Choose Us"
              title="Modern presentation backed by dependable project discipline."
              text="We keep the experience simple, professional, and reassuring for clients who want strong results without unnecessary complexity."
            />

            <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-2 xl:grid-cols-3">
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

        <LagImageWindow
          image="https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1800&q=80"
          heightClassName="min-h-[16rem] sm:min-h-[20rem] md:min-h-[24rem] lg:min-h-[30rem]"
          kicker="Client Experience"
          title="The image windows can speak while the main sections stay readable."
        />

        <section id="testimonials" className="section-space">
          <div className="container-shell">
            <SectionHeading
              kicker="Testimonials"
              title="What clients appreciate most is the confidence they feel throughout the process."
              text="We keep every testimonial readable and grounded so the section builds trust rather than feeling decorative."
            />

            <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-2 xl:grid-cols-3">
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

        <LagImageWindow
          image="https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1800&q=80"
          heightClassName="min-h-[16rem] sm:min-h-[20rem] md:min-h-[24rem] lg:min-h-[30rem]"
          kicker="Project Confidence"
          title="Each window can later hold real project messaging and location details."
        />

        <section id="contact" className="section-space bg-white/[0.02]">
          <div className="container-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionHeading
              kicker="Contact"
              title="Let's discuss your next project with clarity from the very beginning."
              text="The contact area is designed for comfort and readability, with clear inputs and visible contact information."
              align="left"
            />

            <Reveal className="glass-panel rounded-[30px] p-5 sm:p-6 md:p-8">
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
                <div className="flex flex-col items-start gap-4 pt-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                  <div className="text-sm leading-7 text-muted">
                    <p>Phone: +639-xxxxxxxxxx</p>
                    <p>Email: info@MRconstruction.com</p>
                  </div>
                  <button type="submit" className="button-primary w-full sm:w-auto">
                    <span>Request Consultation</span>
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
