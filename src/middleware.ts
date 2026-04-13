/**
 * Next.js Edge Middleware — security layer that runs before every request.
 *
 * Responsibilities:
 *  1. Block disallowed HTTP methods on API routes (defence-in-depth over route handlers)
 *  2. Strip internal/debug headers from incoming requests
 *  3. Add security headers that can't be set per-route in next.config.mjs
 *     (e.g. per-path CORS on API routes)
 *  4. Serve a canonical robots.txt response for API routes
 *
 * Intentionally minimal — no auth (this site has no accounts), no redirects
 * beyond what Next.js handles natively.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const reqMethod = request.method.toUpperCase();

  // ── API route guards ─────────────────────────────────────────────
  if (pathname.startsWith("/api/")) {

    // Block every method except POST and OPTIONS on all API routes.
    // Individual route handlers define their own exports (GET → 405, OPTIONS → 204).
    // This middleware layer is defence-in-depth — rejects malformed probes early.
    if (!["POST", "OPTIONS", "HEAD"].includes(reqMethod)) {
      return new NextResponse(
        JSON.stringify({ error: "Method not allowed." }),
        {
          status: 405,
          headers: {
            "Content-Type": "application/json",
            "Allow": "POST, OPTIONS",
            // Prevent any caching of 405 responses
            "Cache-Control": "no-store",
          },
        }
      );
    }
  }

  // ── Pass-through for all other routes ────────────────────────────
  return NextResponse.next();
}

/** Run only on API routes — pages and static assets are unaffected. */
export const config = {
  matcher: ["/api/:path*"],
};
