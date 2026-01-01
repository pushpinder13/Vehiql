/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsHmrCache: false,
  },
  images:{
    unoptimized: true,
    remotePatterns:[
      {
        protocol:"https",
        hostname: "lpuibowzqcchtdfjlapa.supabase.co",
      }
    ]
  },
};



export default nextConfig;
