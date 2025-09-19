import { zValidator } from "@hono/zod-validator";
import { handleOrganizationInvite, listUserInvitations } from "@paperjet/auth/invitations";
import { doesAdminAccountExist, listModels } from "@paperjet/db";
import { getUsageStats } from "@paperjet/engine";
import { configUpdateSchema } from "@paperjet/engine/types";
import { getAuthMode, logger } from "@paperjet/shared";
import { Hono } from "hono";
import z from "zod";

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
  // .get("/config", async (c) => {
  //   const configuration = await getConfiguration();
  //   return c.json(configuration);
  // })
  .patch("/config", zValidator("json", configUpdateSchema), async (c) => {
    try {
      const _body = c.req.valid("json");
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
  })
  .post("/validate-connection", zValidator("json", configUpdateSchema), async (c) => {
    try {
      const _body = c.req.valid("json");
      return c.json({});
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
export { router as adminRouter };
export type AdminRoutes = typeof router;
