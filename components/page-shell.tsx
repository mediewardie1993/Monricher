import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PointerGlow } from "@/components/pointer-glow";
import { ConstructionChatbot } from "@/components/construction-chatbot";

type PageShellProps = {
  children: ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="relative overflow-x-clip">
      <PointerGlow />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-hero-grid bg-[size:120px_120px] opacity-20 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        aria-hidden="true"
      />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <ConstructionChatbot />
    </div>
  );
}
