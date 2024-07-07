/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "lastfm.freetls.fastly.net",
                protocol: "https"
            }
        ]
    }
};

export default nextConfig;
