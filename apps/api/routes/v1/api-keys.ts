import { zValidator } from "@hono/zod-validator";
import { db } from "@paperjet/db";
import { apikey } from "@paperjet/db/schema";
import type { ApiKey } from "@paperjet/engine/types";
import { logger } from "@paperjet/shared";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { auth, getUserSession } from "@/lib/auth";

const app = new Hono();

const router = app
  .get("/", async (c) => {
    try {
      const { session } = await getUserSession(c);
      const data = await db.query.apikey.findMany({
        where: eq(apikey.organizationId, session.activeOrganizationId),
      });

      const apiKeys: ApiKey[] = data.map((fullKey) => {
        return {
          id: fullKey.id,
          name: fullKey.name,
          userId: fullKey.userId,
          enabled: fullKey.enabled || true,
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
      const { session } = await getUserSession(c);
      const newKey = await auth.api.createApiKey({
        body: {
          name,
        },
        headers: c.req.raw.headers,
      });

      await db
        .update(apikey)
        .set({
          organizationId: session.activeOrganizationId,
        })
        .where(eq(apikey.id, newKey.id));

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
      const { session } = await getUserSession(c);

      const apiKey = await db.query.apikey.findFirst({
        where: eq(apikey.organizationId, session.activeOrganizationId),
      });
      if (!apiKey) {
        return c.json({ error: "Key not found" }, 404);
      }
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
