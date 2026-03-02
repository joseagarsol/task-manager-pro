import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "9wutndnzry.ufs.sh",
        port: "",
        pathname: "/f/**",
      },
    ],
  },
};

export default nextConfig;
