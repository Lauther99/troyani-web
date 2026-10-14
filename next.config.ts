import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Las URLs del sitio terminan en "/" (wireframe pág. 3): /catalogo/, /productos/{slug}/
  trailingSlash: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
