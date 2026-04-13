import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ROOT_HOST = "monricher.com";
const MAIN_HOST = "www.monricher.com";
const MOBILE_HOST = "m.monricher.com";

const MOBILE_USER_AGENT =
  /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Silk|Kindle|Windows Phone/i;

const EXCLUDED_PATH_PREFIXES = ["/_next", "/api", "/favicon", "/robots.txt", "/sitemap"];

function isLocalHost(hostname: string) {
  return (
    hostname.includes("localhost") ||
    hostname.startsWith("127.0.0.1") ||
    hostname.startsWith("192.168.") ||
    hostname.endsWith(".local")
  );
}

function shouldSkipPath(pathname: string) {
  return EXCLUDED_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function buildRedirectUrl(request: NextRequest, host: string) {
  const url = request.nextUrl.clone();
  url.protocol = "https:";
  url.host = host;
  return url;
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (shouldSkipPath(pathname)) {
    return NextResponse.next();
  }

  const hostHeader = request.headers.get("host") ?? "";
  const hostname = hostHeader.split(":")[0].toLowerCase();

  if (!hostname || isLocalHost(hostname)) {
    return NextResponse.next();
  }

  const userAgent = request.headers.get("user-agent") ?? "";
  const isMobileVisitor = MOBILE_USER_AGENT.test(userAgent);
  const isMobileHost = hostname === MOBILE_HOST;
  const isMainHost = hostname === MAIN_HOST;
  const isRootHost = hostname === ROOT_HOST;

  if (isRootHost) {
    const targetHost = isMobileVisitor ? MOBILE_HOST : MAIN_HOST;
    return NextResponse.redirect(buildRedirectUrl(request, targetHost), 308);
  }

  if (isMainHost && isMobileVisitor) {
    return NextResponse.redirect(buildRedirectUrl(request, MOBILE_HOST), 308);
  }

  if (isMobileHost && !isMobileVisitor) {
    return NextResponse.redirect(buildRedirectUrl(request, MAIN_HOST), 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*).*)", "/"]
};
