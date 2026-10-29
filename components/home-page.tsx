import { CompareSlider } from "@/components/compare-slider";
import { ConstructionChatbot } from "@/components/construction-chatbot";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { withBasePath } from "@/lib/base-path";
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

        <section className="section-space">
          <div className="container-shell">
            <SectionHeading
              kicker="Bliss Tagaytay"
              title="From blueprint to built."
              text="Drag the line to see the plan become the finished project."
            />
            <Reveal className="mt-10">
              <CompareSlider
                before={{
                  src: withBasePath("/photos/blueprint-to-build-plan.jpg"),
                  alt: "Bliss Tagaytay blueprint",
                  label: "Blueprint"
                }}
                after={{
                  src: withBasePath("/photos/blueprint-to-build-built.jpg"),
                  alt: "Bliss Tagaytay finished project",
                  label: "Built"
                }}
              />
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
      <ConstructionChatbot />
    </div>
  );
}
