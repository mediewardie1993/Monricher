import { SiteLogo } from "@/components/site-logo";
import { companyInfo } from "@/lib/site-data";
import { withBasePath } from "@/lib/base-path";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.08))] py-14">
      <div className="container-shell">
        <div className="relative mb-10 grid gap-8 overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] p-8 shadow-soft lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-4">
            <p className="section-kicker">Monricher Construction</p>
            <h2 className="max-w-xl text-3xl font-bold leading-tight text-white md:text-4xl">
              Built to feel modern, dependable, and ready for serious clients.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4 lg:justify-end">
            <a href={withBasePath("/contact")} className="button-primary w-full sm:w-auto">
              <span>Get a Quote</span>
            </a>
            <a href={withBasePath("/services")} className="button-secondary w-full sm:w-auto">
              <span>Our Services</span>
            </a>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-4">
            <SiteLogo size="lg" />
            <p className="max-w-sm text-sm leading-7 text-muted">
              A 100% Filipino capitalized corporation delivering construction, design, and
              development services with honesty and integrity.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-200">Quick Links</h3>
            <div className="grid gap-2 text-sm text-muted">
              <a href={withBasePath("/")}>Home</a>
              <a href={withBasePath("/about")}>About</a>
              <a href={withBasePath("/projects")}>Projects</a>
              <a href={withBasePath("/services")}>Services</a>
              <a href={withBasePath("/contact")}>Contact</a>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-200">Contact</h3>
            <div className="grid gap-2 text-sm text-muted">
              <p>{companyInfo.phone}</p>
              <p>{companyInfo.email}</p>
              <p>{companyInfo.address}</p>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-200">Follow Us</h3>
            <div className="grid gap-2 text-sm text-muted">
              <a href={companyInfo.facebookUrl} target="_blank" rel="noopener noreferrer">
                {companyInfo.facebook}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
