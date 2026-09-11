/**
 * Sitewide filmic finish: a soft edge vignette plus a faint animated grain
 * texture. Pure CSS/SVG, fixed and pointer-events-none, so it costs nothing
 * beyond paint and never interferes with interaction. Disabled for
 * prefers-reduced-motion via globals.css (the grain animation only).
 */
export function CinematicOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[60]" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_65%,rgba(2,5,10,0.28)_100%)]" />
      <div className="cinematic-grain absolute inset-0 opacity-[0.05] mix-blend-overlay" />
    </div>
  );
}
