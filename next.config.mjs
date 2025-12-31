/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsHmrCache: false,
  },
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname: "pkayjdkerjplfqgqlzmr.supabase.co",
      },
      {
        protocol:"https",
        hostname: "lpuibowzqcchtdfjlapa.supabase.co",
      }
    ]
  },
};



export default nextConfig;
