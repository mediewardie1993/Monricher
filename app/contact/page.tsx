"use client";

import { useState, type FormEvent } from "react";
import { PageShell } from "@/components/page-shell";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SkipToRail } from "@/components/skip-to-rail";
import { TiltCard } from "@/components/tilt-card";
import { companyInfo } from "@/lib/site-data";
import { withBasePath } from "@/lib/base-path";
import { sendInquiry } from "@/lib/inquiry";

type SubmitStatus = "idle" | "sending" | "sent" | "error";

export default function ContactPage() {
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");

    const form = event.currentTarget;
    const data = new FormData(form);
    const fields = Object.fromEntries(data.entries()) as Record<string, string>;

    const ok = await sendInquiry("New inquiry from monricherconstruction.com", fields);
    if (ok) {
      setStatus("sent");
      form.reset();
    } else {
      setStatus("error");
    }
  };

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
            <form className="grid gap-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-slate-100">
                  Name
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your full name"
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-base text-white outline-none transition focus:border-accent/50 focus:ring-4 focus:ring-accent/10"
                  />
                </label>
                <label className="grid gap-2 text-sm font-bold text-slate-100">
                  Contact Number
                  <input
                    type="tel"
                    name="phone"
                    required
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
                    name="email"
                    required
                    placeholder="you@example.com"
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-base text-white outline-none transition focus:border-accent/50 focus:ring-4 focus:ring-accent/10"
                  />
                </label>
                <label className="grid gap-2 text-sm font-bold text-slate-100">
                  Service
                  <select
                    name="service"
                    defaultValue=""
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-base text-white outline-none transition focus:border-accent/50 focus:ring-4 focus:ring-accent/10"
                  >
                    <option className="bg-panel" value="" disabled>
                      Select a service
                    </option>
                    <option className="bg-panel">Consultation</option>
                    <option className="bg-panel">Design</option>
                    <option className="bg-panel">General Construction Services</option>
                  </select>
                </label>
              </div>
              <label className="grid gap-2 text-sm font-bold text-slate-100">
                Company Name <span className="font-normal text-muted">(optional)</span>
                <input
                  type="text"
                  name="company"
                  placeholder="Your company name"
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-base text-white outline-none transition focus:border-accent/50 focus:ring-4 focus:ring-accent/10"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-100">
                Message
                <textarea
                  name="message"
                  required
                  rows={6}
                  placeholder="Tell us about your project"
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-base text-white outline-none transition focus:border-accent/50 focus:ring-4 focus:ring-accent/10"
                />
              </label>
              <p className="text-xs leading-6 text-muted">
                By submitting this form, you agree to let us use the details you've shared to respond to your
                inquiry, in line with our{" "}
                <a href={withBasePath("/privacy")} className="underline decoration-white/30 underline-offset-4 hover:text-white">
                  Privacy Policy
                </a>
                .
              </p>

              {status === "sent" ? (
                <p className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-300">
                  Thank you — your inquiry has been sent. Our team will get back to you shortly.
                </p>
              ) : null}
              {status === "error" ? (
                <p className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-300">
                  Something went wrong sending your inquiry. Please call {companyInfo.phone} or email{" "}
                  {companyInfo.email} directly.
                </p>
              ) : null}

              <button
                type="submit"
                disabled={status === "sending"}
                className="button-primary w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <span>{status === "sending" ? "Sending..." : "Build With Us"}</span>
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      <section id="contact-details" className="section-space">
        <div className="container-shell">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Mobile Number", companyInfo.phone],
              ["Email Address", companyInfo.email],
              ["Physical Address", companyInfo.address],
              ["Facebook Page", companyInfo.facebook]
            ].map(([label, value], index) => (
              <Reveal key={label} delay={index * 0.05}>
                <TiltCard className="glass-panel rounded-[22px] p-6">
                  <p className="section-kicker">{label}</p>
                  <p className="mt-3 text-lg font-semibold text-white">{value}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
