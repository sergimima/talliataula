import { site } from "@/config/site";

/**
 * Estadísticas (Umami) servidas desde el propio dominio, para que no dependan de otro
 * dominio ni las corten los bloqueadores. Se configura en tiempo de ejecución (sin rebuild):
 *   UMAMI_WEBSITE_ID   ID de la web en el panel de Umami. Sin él, no se carga nada.
 *   UMAMI_INTERNAL_URL Dónde está Umami desde el servidor (por defecto, el contenedor del compose).
 *
 * GET  /api/st/script.js -> script de Umami, con la configuración ya aplicada
 * POST /api/st/api/send  -> envío de visitas y eventos a Umami
 */
export const dynamic = "force-dynamic";

const upstream = () => (process.env.UMAMI_INTERNAL_URL || "http://umami:3000").replace(/\/$/, "");
const websiteId = () => process.env.UMAMI_WEBSITE_ID?.trim() || "";

// Cabeceras que Umami necesita para detectar navegador, idioma, país y bots.
const FORWARDED_HEADERS = ["content-type", "user-agent", "accept-language", "referer", "x-umami-cache"];

function noop(status = 200) {
  return new Response("", {
    status,
    headers: { "Content-Type": "application/javascript; charset=utf-8", "Cache-Control": "no-store" },
  });
}

export async function GET(_req: Request, ctx: RouteContext<"/api/st/[...path]">) {
  const { path } = await ctx.params;
  if (path.join("/") !== "script.js") return new Response("Not found", { status: 404 });

  const id = websiteId();
  if (!id) return noop();

  try {
    const res = await fetch(`${upstream()}/script.js`, { cache: "no-store" });
    if (!res.ok) return noop();
    const tracker = await res.text();
    // El script de Umami lee su configuración de los atributos de su propia etiqueta <script>;
    // se fijan aquí antes de que arranque, en la misma ejecución.
    const config = `(function(s){if(s){s.setAttribute("data-website-id",${JSON.stringify(id)});s.setAttribute("data-domains",${JSON.stringify(new URL(site.url).hostname)});}})(document.currentScript);\n`;
    return new Response(config + tracker, {
      headers: { "Content-Type": "application/javascript; charset=utf-8", "Cache-Control": "public, max-age=3600" },
    });
  } catch {
    return noop();
  }
}

export async function POST(req: Request, ctx: RouteContext<"/api/st/[...path]">) {
  const { path } = await ctx.params;
  if (path.join("/") !== "api/send" || !websiteId()) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  for (const name of FORWARDED_HEADERS) {
    const value = req.headers.get(name);
    if (value) headers.set(name, value);
  }
  // IP del visitante (la pone Nginx) para el país; Umami no la guarda.
  const ip = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (ip) headers.set("x-forwarded-for", ip);

  try {
    const res = await fetch(`${upstream()}/api/send`, {
      method: "POST",
      headers,
      body: await req.text(),
      cache: "no-store",
    });
    return new Response(await res.text(), {
      status: res.status,
      headers: { "Content-Type": res.headers.get("content-type") ?? "application/json", "Cache-Control": "no-store" },
    });
  } catch {
    return new Response(JSON.stringify({ ok: false }), { status: 502, headers: { "Content-Type": "application/json" } });
  }
}
