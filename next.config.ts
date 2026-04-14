import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for the Docker/Dokploy image (`Dockerfile`) — emits `.next/standalone` for `node server.js`.
  output: "standalone",
  // Dev-only: allow JS/CSS when you open the site as 127.0.0.1 or IPv6 loopback.
  // Default allowlist is mostly "localhost"; without this, the page can look "broken" or fail to load.
  allowedDevOrigins: ["127.0.0.1", "::1"],
};

export default nextConfig;
