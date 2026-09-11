import { ConstructionChatbot } from "@/components/construction-chatbot";
import { HeroSection } from "@/components/hero-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PointerGlow } from "@/components/pointer-glow";

export function HomePage() {
  return (
    <div id="top" className="relative overflow-x-clip overflow-y-visible">
      <PointerGlow />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-hero-grid bg-[size:120px_120px] opacity-20 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        aria-hidden="true"
      />
      <SiteHeader />

      <main>
        <HeroSection />
      </main>

      <SiteFooter />
      <ConstructionChatbot />
    </div>
  );
}
