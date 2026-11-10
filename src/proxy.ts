import { NextResponse, type NextRequest } from "next/server";
import { hasLocale, localeFromAcceptLanguage } from "@/i18n/config";

/** Toda URL sin idioma se redirige a /ca o /es según el navegador. */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";
  if (hasLocale(first)) return;

  const locale = localeFromAcceptLanguage(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Excluye internos de Next, la API y cualquier archivo con extensión (imágenes, iconos, sitemap…)
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
