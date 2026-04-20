import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for the Docker/Dokploy image (`Dockerfile`) — emits `.next/standalone` for `node server.js`.
  output: "standalone",
  // Dev-only: allow JS/CSS when you open the site as 127.0.0.1 or IPv6 loopback.
  // Default allowlist is mostly "localhost"; without this, the page can look "broken" or fail to load.
  allowedDevOrigins: ["127.0.0.1", "::1"],
  poweredByHeader: false,
  async headers() {
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "img-src 'self' data: https:",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
      "style-src 'self' 'unsafe-inline' https:",
      "connect-src 'self' https:",
      "font-src 'self' data: https:",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
