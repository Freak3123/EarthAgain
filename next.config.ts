import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "earthagain.in",
      },
      {
        protocol: "https",
        hostname: "www.svgrepo.com",
      },
      {
        protocol: "https",
        hostname: "jbipzumtwhxggtgtirnl.supabase.co",
        pathname: "/storage/v1/object/public/events/**",
      },
       {
        protocol: 'https',
        hostname: 'jbipzumtwhxggtgtirnl.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/blogs/**',
      },
    ],
  },
};

export default nextConfig;
