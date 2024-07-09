import { fileURLToPath } from "node:url";
import createJiti from "jiti";
const jiti = createJiti(fileURLToPath(import.meta.url));

// Import env here to validate during build. Using jiti we can import .ts files :)
jiti("./src/utils/env/client");
jiti("./src/utils/env/server");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "lastfm.freetls.fastly.net",
        protocol: "https",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/_stats/script.js",
        destination: "https://cloud.umami.is/script.js",
      },
      {
        source: "/_stats/api/:path*",
        destination: "https://api-gateway.umami.dev/api/:path*"
      }
    ];
  },
};

export default nextConfig;
