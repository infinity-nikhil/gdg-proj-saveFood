import { env } from "./env";
import { json, preflight } from "./lib/http";
import { authRoutes } from "./routes/auth";
import { claimRoutes } from "./routes/claims";
import { impactRoutes } from "./routes/impact";
import { listingRoutes } from "./routes/listings";

const server = Bun.serve({
  port: env.port,
  routes: {
    "/api/health": () => json({ ok: true }),
    ...authRoutes,
    ...listingRoutes,
    ...claimRoutes,
    ...impactRoutes,
  },
  fetch(req) {
    if (req.method === "OPTIONS") return preflight();
    return json({ error: "Not found" }, 404);
  },
});

console.log(`Morsel API ready on ${server.url}`);
