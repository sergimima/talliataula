import type { NextConfig } from "next";

/**
 * Estadísticas (Umami). El script y los envíos pasan por el propio dominio (/api/st/...)
 * y Next los reenvía al contenedor de Umami. Así no dependen de otro dominio y los
 * bloqueadores de anuncios no los cortan. Las rutas /api/* no pasan por el proxy de idioma.
 * Se resuelve en el build: hace falta NEXT_PUBLIC_UMAMI_WEBSITE_ID en .env.local al construir.
 */
const umamiInternalUrl = process.env.UMAMI_INTERNAL_URL || "http://umami:3000";
const umamiEnabled = Boolean(process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID);

const nextConfig: NextConfig = {
  // Servidor autónomo para la imagen Docker (.next/standalone)
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async rewrites() {
    if (!umamiEnabled) return [];
    return [{ source: "/api/st/:path*", destination: `${umamiInternalUrl}/:path*` }];
  },
};

export default nextConfig;
