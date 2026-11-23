import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Servidor autónomo para la imagen Docker (.next/standalone)
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // Una sola dirección para Google: www.talliataula.com -> talliataula.com (redirección permanente)
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.talliataula.com" }],
        destination: "https://talliataula.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
