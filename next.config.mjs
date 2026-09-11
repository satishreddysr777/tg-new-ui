/** @type {import('next').NextConfig} */
const API_ORIGIN = process.env.API_ORIGIN ?? "http://localhost:4000";

const nextConfig = {
  // Self-contained server bundle (.next/standalone) for the Docker image.
  output: "standalone",
  async rewrites() {
    // Proxy API calls to tg-api so the session cookie is first-party to the
    // Next app — which lets middleware read it for route protection.
    // NOTE: API_ORIGIN is baked in at build time.
    return [
      {
        source: "/api/v1/:path*",
        destination: `${API_ORIGIN}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
