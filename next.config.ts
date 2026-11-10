import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Servidor autónomo para la imagen Docker (.next/standalone)
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
