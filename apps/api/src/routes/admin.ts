import { zValidator } from "@hono/zod-validator";
import { handleOrganizationInvite, listUserInvitations } from "@paperjet/auth/invitations";
import {
  addNewModel,
  deleteModel,
  doesAdminAccountExist,
  getRuntimeConfiguration,
  listModels,
  setRuntimeModel,
  updateModel,
} from "@paperjet/db";
import { getUsageStats, validateConnection } from "@paperjet/engine";
import { modelConfigSchema } from "@paperjet/engine/types";
import { getAuthMode } from "@paperjet/shared";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono();

const router = app
  .get("/server-info", async (c) => {
    const adminAccountExists = await doesAdminAccountExist();
    const authMode = getAuthMode();
    return c.json({
      adminAccountExists: adminAccountExists,
      authMode: authMode,
    });
  })
  .get("/accept-invitation", async (c) => {
    return handleOrganizationInvite(c);
  })
  .get("/invitations", async (c) => {
    return listUserInvitations(c);
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
  .get("/runtime-config", async (c) => {
    const config = await getRuntimeConfiguration();
    return c.json(config);
  })
  .post("/models/add", zValidator("json", modelConfigSchema), async (c) => {
    try {
      const modelParams = c.req.valid("json");
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
  })
  .put("/models/update", zValidator("json", z.object({ id: z.string() }).merge(modelConfigSchema)), async (c) => {
    try {
      const { id, ...modelParams } = c.req.valid("json");
      const result = await updateModel(id, modelParams);
      return c.json({ success: true, model: result[0] });
    } catch (error) {
      console.error("Failed to update model:", error);
      return c.json(
        {
          error: (error as Error).message || "Failed to update model configuration",
        },
        500,
      );
    }
  })
  .delete("/models/delete", zValidator("json", z.object({ id: z.string() })), async (c) => {
    try {
      const { id } = c.req.valid("json");
      await deleteModel(id);
      return c.json({ success: true });
    } catch (error) {
      console.error("Failed to delete model:", error);
      return c.json(
        {
          error: (error as Error).message || "Failed to delete model configuration",
        },
        500,
      );
    }
  })
  .post(
    "/runtime-config",
    zValidator(
      "json",
      z.object({
        type: z.enum(["fast", "accurate"]),
        modelId: z.string(),
      }),
    ),
    async (c) => {
      try {
        const { type, modelId } = c.req.valid("json");
        await setRuntimeModel(type, modelId);
        return c.json({ success: true });
      } catch (error) {
        console.error("Failed to set runtime model:", error);
        return c.json({ error: "Failed to set runtime model" }, 500);
      }
    },
  );
export { router as adminRouter };
export type AdminRoutes = typeof router;
