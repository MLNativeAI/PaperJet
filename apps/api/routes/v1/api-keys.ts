import { zValidator } from "@hono/zod-validator";
import type { ApiKey } from "@paperjet/engine/types";
import { logger } from "@paperjet/shared";
import { Hono } from "hono";
import { z } from "zod";
import { auth } from "@/lib/auth";

const app = new Hono();

const router = app
  .get("/", async (c) => {
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
          key: `${fullKey.start}*****`,
          lastRequest: fullKey.lastRequest ? fullKey.lastRequest.toISOString() : null,
          createdAt: fullKey.createdAt.toISOString(),
        };
      });
      return c.json(apiKeys);
    } catch (error) {
      logger.error(error, "Failed to get api keys");
      return c.json({ error: "Internal server error" }, 500);
    }
  })
  .post("/", zValidator("json", z.object({ name: z.string().min(1) })), async (c) => {
    try {
      const { name } = c.req.valid("json");
      const newKey = await auth.api.createApiKey({
        body: {
          name,
        },
        headers: c.req.raw.headers,
      });

      return c.json({
        id: newKey.id,
        name: newKey.name,
        key: newKey.key,
      });
    } catch (error) {
      logger.error(error, "Failed to create api key");
      return c.json({ error: "Internal server error" }, 500);
    }
  })
  .delete("/:id", async (c) => {
    try {
      const { id } = c.req.param();

      await auth.api.updateApiKey({
        body: {
          keyId: id,
          enabled: false,
        },
        headers: c.req.raw.headers,
      });

      return c.json({ message: "API key revoked successfully" });
    } catch (error) {
      logger.error(error, "Failed to revoke api key");
      return c.json({ error: "Internal server error" }, 500);
    }
  });

export { router as v1ApiKeyRouter };

export type ApiKeysRoutes = typeof router;
