import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['sifdqhfwpfbhqvwopgrx.supabase.co'],
  },
};

export default nextConfig;

export const config = {
  matcher: ['/admin/:path*'],
};
