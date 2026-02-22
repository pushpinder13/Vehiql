/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsHmrCache: false,
    optimizePackageImports: ['lucide-react', '@clerk/nextjs'],
  },
  images:{
    unoptimized: true,
    remotePatterns:[
      {
        protocol:"https",
        hostname: "lpuibowzqcchtdfjlapa.supabase.co",
      }
    ],
    formats: ['image/webp'],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
};



export default nextConfig;
