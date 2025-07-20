import { getConfiguration, getUsageData, getUsageStats, isSetupRequired } from "@paperjet/engine";
import { Hono } from "hono";
import { getAuthMode } from "@/lib/env";

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
  });

export default router;
