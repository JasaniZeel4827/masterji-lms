// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         hostname: "masteji-mordern-lms.t3.storageapi.dev",
//         port: "",
//         protocol: "https"
//       },
//     ],
//     dangerouslyAllowSVG: true,
//   },
// };

// export default nextConfig;







import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "masteji-mordern-lms.t3.storageapi.dev",
        protocol: "https",
      },
    ],
    dangerouslyAllowSVG: true,
  },

  // ✅ Disable DevTools popup
  // devIndicators: {
  //   buildActivity: false,
  // },
};

export default nextConfig;
