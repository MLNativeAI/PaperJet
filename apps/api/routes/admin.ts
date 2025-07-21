import { getConfiguration, getUsageData, getUsageStats, isSetupRequired, updateConfiguration } from "@paperjet/engine";
import { Hono } from "hono";
import { getAuthMode } from "@/lib/env";
import { zValidator } from "@hono/zod-validator";
import { configUpdateSchema } from "@paperjet/engine/types";
import { logger } from "@paperjet/shared";
import z from "zod";

const app = new Hono();

const router = app
  .get("/setup-required", async (c) => {
    const isAdminSetupRequired = await isSetupRequired();
    return c.json({
      isSetupRequired: isAdminSetupRequired,
    });
  })
  .get("/auth-mode", async (c) => {
    return c.json({
      authMode: getAuthMode(),
    });
  })
  .get("/usage-data", async (c) => {
    const usageData = await getUsageData();
    return c.json(usageData);
  })
  .get("/usage-stats", async (c) => {
    const usageData = await getUsageData();
    const usageStats = getUsageStats(usageData);
    return c.json(usageStats);
  })
  .get("/config", async (c) => {
    const configuration = await getConfiguration();
    return c.json(configuration);
  })
  .patch("/config", zValidator("json", configUpdateSchema), async (c) => {
    try {
      const body = c.req.valid("json");

      await updateConfiguration(body);
      return c.json({ message: "Configuration has been updated" });
    } catch (error) {
      logger.error(error, "Update workflow basic data error:");
      if (error instanceof z.ZodError) {
        return c.json({ error: "Invalid config data", details: error.errors }, 400);
      }
      if (error instanceof Error && error.message === "Workflow not found") {
        return c.json({ error: "Workflow not found" }, 404);
      }
      return c.json({ error: "Internal server error" }, 500);
    }
  });

export default router;
