import { zValidator } from "@hono/zod-validator";
import { createApiKey, listApiKeys, revokeApiKey } from "@paperjet/engine";
import { logger } from "@paperjet/shared";
import { Hono } from "hono";
import { z } from "zod";
import { getUser } from "@/lib/auth";

const app = new Hono();

const createApiKeySchema = z.object({
  name: z.string().min(1, "API key name is required").max(100),
});

const router = app
  .get("/", async (c) => {
    try {
      const user = await getUser(c);
      const apiKeys = await listApiKeys(user.id);
      return c.json(apiKeys);
    } catch (error) {
      logger.error(error, "Failed to list API keys");
      return c.json({ error: "Failed to list API keys" }, 500);
    }
  })
  .post("/", zValidator("json", createApiKeySchema), async (c) => {
    try {
      const user = await getUser(c);
      const { name } = c.req.valid("json");

      const result = await createApiKey(user.id, name);

      return c.json({
        id: result.id,
        key: result.key,
        name,
        createdAt: new Date(),
        lastUsedAt: null,
        status: "active",
      });
    } catch (error) {
      logger.error(error, "Failed to create API key");
      return c.json({ error: "Failed to create API key" }, 500);
    }
  })
  .delete("/:keyId", async (c) => {
    try {
      const user = await getUser(c);
      const keyId = c.req.param("keyId");

      if (!keyId) {
        return c.json({ error: "API key ID is required" }, 400);
      }

      await revokeApiKey(user.id, keyId);

      return c.json({ message: "API key revoked successfully" });
    } catch (error) {
      logger.error(error, "Failed to revoke API key");
      return c.json({ error: "Failed to revoke API key" }, 500);
    }
  });

export default router;
