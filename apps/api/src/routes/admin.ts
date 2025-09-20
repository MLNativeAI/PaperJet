import { zValidator } from "@hono/zod-validator";
import { handleOrganizationInvite, listUserInvitations } from "@paperjet/auth/invitations";
import { doesAdminAccountExist, listModels } from "@paperjet/db";
import { getUsageStats, validateConnection } from "@paperjet/engine";
import { modelConfigSchema } from "@paperjet/engine/types";
import { getAuthMode } from "@paperjet/shared";
import { Hono } from "hono";

const app = new Hono();

const router = app
  .get("/setup-required", async (c) => {
    const adminAccountExists = await doesAdminAccountExist();
    return c.json({
      adminAccountExists: adminAccountExists,
    });
  })
  .get("/accept-invitation", async (c) => {
    return handleOrganizationInvite(c);
  })
  .get("/invitations", async (c) => {
    return listUserInvitations(c);
  })
  .get("/auth-mode", async (c) => {
    return c.json({
      authMode: getAuthMode(),
    });
  })
  .get("/usage-data", async (c) => {
    const usageStats = getUsageStats([]);
    return c.json({
      usageData: [],
      usageStats: usageStats,
    });
  })
  .get("/models", async (c) => {
    const models = await listModels();
    return c.json(models);
  })
  .post("/models/add", zValidator("json", modelConfigSchema), async (c) => {
    try {
      const modelParams = c.req.valid("json");
      const { addNewModel } = await import("@paperjet/db");
      const result = await addNewModel(modelParams);
      return c.json({ success: true, model: result[0] });
    } catch (error) {
      console.error("Failed to add model:", error);
      return c.json({ error: "Failed to add model configuration" }, 500);
    }
  })
  .post("/models/validate-connection", zValidator("json", modelConfigSchema), async (c) => {
    try {
      const modelParams = c.req.valid("json");
      const result = await validateConnection(modelParams);
      return c.json(result);
    } catch (error) {
      return c.json({ error: error }, 500);
    }
  });
export { router as adminRouter };
export type AdminRoutes = typeof router;
