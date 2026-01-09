import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
      },
    ],
  },
  // Powering up for production
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
