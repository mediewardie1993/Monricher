export function SiteFooter() {
  return (
    <footer className="border-t border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.08))] py-14">
      <div className="container-shell">
        <div className="mb-10 grid gap-8 rounded-[30px] border border-white/10 bg-white/[0.03] p-8 shadow-soft lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-4">
            <p className="section-kicker">Monricher Construction</p>
            <h2 className="max-w-xl text-3xl font-bold leading-tight text-white md:text-4xl">
              Built to feel modern, dependable, and ready for serious clients.
            </h2>
          </div>
          <div className="flex flex-wrap gap-4 lg:justify-end">
            <a href="#contact" className="button-primary">
              Get a Quote
            </a>
            <a href="#services" className="button-secondary">
              Our Services
            </a>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-4">
            <p className="font-display text-lg font-bold tracking-[0.08em] text-white">MONRICHER</p>
            <p className="max-w-sm text-sm leading-7 text-muted">
              Premium construction, renovation, and fit-out services delivered with clarity,
              organization, and a refined modern standard.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-200">Quick Links</h3>
            <div className="grid gap-2 text-sm text-muted">
              <a href="#about">About</a>
              <a href="#services">Services</a>
              <a href="#projects">Projects</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-200">Contact</h3>
            <div className="grid gap-2 text-sm text-muted">
              <p>+234 800 000 0000</p>
              <p>info@monricherconstruction.com</p>
              <p>14 Admiralty Way, Lekki Phase 1, Lagos</p>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-200">Business Hours</h3>
            <div className="grid gap-2 text-sm text-muted">
              <p>Mon - Fri | 8:00 AM - 6:00 PM</p>
              <p>Sat | 9:00 AM - 3:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
