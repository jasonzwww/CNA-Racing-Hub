
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'www.car-logos.org' },
      { protocol: 'https', hostname: 'ir-racing.s3.amazonaws.com' }
    ],
  },
  env: {
    API_KEY: process.env.API_KEY || '',
  }
};

export default nextConfig;
