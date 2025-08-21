import type { ApiKey } from "@paperjet/engine/types";
import { Hono } from "hono";
import { auth } from "@/lib/auth";

const app = new Hono();

const router = app.get("/", async (c) => {
  const data = await auth.api.listApiKeys({});

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
});

export default router;
