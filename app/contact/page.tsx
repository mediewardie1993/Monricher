import { PageShell } from "@/components/page-shell";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SkipToRail } from "@/components/skip-to-rail";

export default function ContactPage() {
  return (
    <PageShell>
      <SkipToRail
        items={[
          { label: "Overview", href: "#contact-overview" },
          { label: "Inquiry Form", href: "#contact-form" },
          { label: "Details", href: "#contact-details" }
        ]}
      />

      <section id="contact-overview" className="section-space">
        <div className="container-shell">
          <SectionHeading
            kicker="Contact"
            title="A dedicated contact page designed for fast and comfortable inquiry."
            text="Share your project details and the Monricher team will respond with clear next steps."
          />
        </div>
      </section>

      <section id="contact-form" className="section-space bg-white/[0.02]">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            kicker="Inquiry Form"
            title="Tell us about your project."
            text="The form is simple and readable so every client can complete it with ease."
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
              <button type="submit" className="button-primary w-full sm:w-auto">
                <span>Request Consultation</span>
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      <section id="contact-details" className="section-space">
        <div className="container-shell">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Phone", "+639-xxxxxxxxxx"],
              ["Email", "info@MRconstruction.com"],
              ["Office", "Caloocan City, Metro Manila"],
              ["Hours", "Mon - Sat | 8:00 AM - 6:00 PM"]
            ].map(([label, value], index) => (
              <Reveal key={label} delay={index * 0.05}>
                <article className="glass-panel rounded-[22px] p-6">
                  <p className="section-kicker">{label}</p>
                  <p className="mt-3 text-lg font-semibold text-white">{value}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
