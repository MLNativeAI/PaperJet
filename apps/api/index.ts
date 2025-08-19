// Initialize OpenTelemetry instrumentation first
import "./instrumentation";

import { otel } from "@hono/otel";
import { envVars, logger } from "@paperjet/shared";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger as honoLogger } from "hono/logger";
import { poweredBy } from "hono/powered-by";
import { type auth, authHandler, authMiddleware } from "./lib/auth";
import { corsMiddleware } from "./lib/cors";
import { withContext } from "./lib/with-context";
import admin from "./routes/admin";
import apiKeys from "./routes/api-keys";
import v1Executions from "./routes/v1/executions";
import v1Workflows from "./routes/v1/workflows";
import workflows from "./routes/workflows";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

app.use("*", otel());
app.use(poweredBy({ serverName: "mlnative.com" }));
app.use(
  honoLogger((message) => {
    logger.trace(message);
  }),
);
app.use("/api/*", corsMiddleware);
app.use("/api/*", authMiddleware);
app.use("/api/*", withContext);
app.on(["POST", "GET"], "/api/auth/*", authHandler);

// Health check
app.get("/api/health", async (c) => {
  logger.info({ endpoint: "/api/health", method: "GET" }, "health check");
  return c.json({
    status: "ok",
  });
});

export const combinedApiRoutes = app
  .basePath("/api")
  .route("/workflows", workflows)
  .route("/admin", admin)
  .route("/api-keys", apiKeys)
  .route("/v1/workflows", v1Workflows)
  .route("/v1/executions", v1Executions);

if (process.env.NODE_ENV === "production") {
  // Serve all static files from the dist directory
  app.use("*", serveStatic({ root: "./dist" }));

  // Serve index.html for all other routes (SPA fallback)
  app.get("*", serveStatic({ path: "./dist/index.html" }));
} else {
  app.get("*", (c) => {
    return c.redirect(envVars.BASE_URL);
  });
}

const server = Bun.serve({
  port: envVars.PORT,
  hostname: "0.0.0.0",
  fetch: app.fetch,
  idleTimeout: 60,
});

import { allWorkers } from "@paperjet/queue";

logger.info(`Started ${allWorkers.length} job workers`);

logger.info(
  {
    port: server.port,
    environment: envVars.ENVIRONMENT,
    hostname: "0.0.0.0",
  },
  `🚀 Server running on port ${server.port} in ${envVars.ENVIRONMENT} mode`,
);

export type ApiRoutes = typeof combinedApiRoutes;
