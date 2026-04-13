import path from "path";
import { fileURLToPath } from "url";

/* Multiple lockfiles (e.g. parent folder) make Next infer the wrong root; pin tracing + dev output here. */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: projectRoot,
  webpack: (config, { dev }) => {
    /* Stale HMR graphs were resurrecting deleted modules (Preloader / PinnedNarrative). */
    if (dev) {
      config.cache = false;
    }
    return config;
  },
  async headers() {
    const isDev = process.env.NODE_ENV === "development";
    const noStore = { key: "Cache-Control", value: "no-store, must-revalidate, max-age=0" };
    return [
      ...(isDev
        ? [
            { source: "/_next/static/:path*", headers: [noStore] },
            { source: "/_next/webpack-hmr", headers: [noStore] },
          ]
        : []),
      {
        source: "/(.*)",
        headers: [
          ...(isDev ? [noStore] : []),
          ...(isDev
            ? []
            : [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains; preload",
                },
              ]),
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
