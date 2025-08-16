import { zValidator } from "@hono/zod-validator";
import { getWorkflow, getWorkflows } from "@paperjet/engine";
import { logger } from "@paperjet/shared";
import { Hono } from "hono";
import { z } from "zod";
import { getUser } from "@/lib/auth";
import { workflowIdSchema } from "@/lib/validation";

const app = new Hono();
const router = app
  .get("/", async (c) => {
    try {
      logger.info("Getting workflows");
      const user = await getUser(c);
      const workflows = await getWorkflows(user.id);
      return c.json(workflows);
    } catch (error) {
      logger.error(error, "Get workflows error:");
      return c.json({ error: "Failed to get workflows" }, 500);
    }
  })
  .get(
    "/:id",
    zValidator(
      "param",
      z.object({
        workflowId: workflowIdSchema,
      }),
    ),
    async (c) => {
      try {
        const user = await getUser(c);
        const { workflowId } = c.req.valid("param");
        const workflowData = await getWorkflow(workflowId, user.id);
        return c.json(workflowData);
      } catch (error) {
        logger.error(error, "Get workflow error:");
        if (error instanceof Error && error.message === "Workflow not found") {
          return c.json({ error: "Workflow not found" }, 404);
        }
        return c.json({ error: "Failed to get workflow" }, 500);
      }
    },
  );
export default router;

export type WorkflowRouteType = typeof router;
