// Next's basePath rewriting only covers next/link, next/image, and
// next/script — plain <a href> and <img>/<video> src strings (which this
// site uses throughout) are left untouched. Locally and in the portable USB
// build the site is served from the domain root, so this is a no-op; the
// GitHub Pages workflow is the only place that sets NEXT_PUBLIC_BASE_PATH
// (to "/Monricher", since project-page Pages sites serve from a subpath
// instead of the root), which is inlined into the client bundle at build
// time. Wrap every hardcoded root-relative path ("/contact", "/photos/...")
// in this so both deployments resolve correctly.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath(path: string): string {
  return `${basePath}${path}`;
}
