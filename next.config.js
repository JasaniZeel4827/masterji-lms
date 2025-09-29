/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      {
        hostname: "masteji-mordern-lms.t3.storageapi.dev",
        protocol: "https",
      },
    ],
    dangerouslyAllowSVG: true,
  },

  // Performance optimizations
  reactStrictMode: true,
  
  // Build optimizations
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
