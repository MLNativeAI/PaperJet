import type { ApiKey } from "@paperjet/engine/types";
import { logger } from "@paperjet/shared";
import { Hono } from "hono";
import { auth } from "@/lib/auth";

const app = new Hono();

const router = app.get("/", async (c) => {
  try {
    const data = await auth.api.listApiKeys({
      headers: c.req.raw.headers,
    });

    const apiKeys: ApiKey[] = data.map((fullKey) => {
      return {
        id: fullKey.id,
        name: fullKey.name,
        userId: fullKey.userId,
        enabled: fullKey.enabled,
        key: fullKey.id,
        lastRequest: fullKey.lastRequest?.toDateString() || null,
        createdAt: fullKey.createdAt.toDateString(),
      };
    });
    return c.json(apiKeys);
  } catch (error) {
    logger.error(error, "Failed to get api keys");
    return c.json({ error: "Internal server error" }, 500);
  }
});

export { router as v1ApiKeyRouter };

export type ApiKeysRoutes = typeof router;
