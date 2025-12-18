import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized:true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    // ✅ Add this to allow localhost
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // ✅ Or add this experimental flag
  // experimental: {
  //   allowedOrigins: ["localhost:8000"],
  // }, 
};

export default nextConfig;