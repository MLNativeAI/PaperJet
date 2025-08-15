import { zValidator } from "@hono/zod-validator";
import { createWorkflowFromApi } from "@paperjet/engine";
import { logger } from "@paperjet/shared";
import { Hono } from "hono";
import z from "zod";
import { getUser } from "@/lib/auth";

const app = new Hono();

const createWorkflowApiSchema = z.object({
  name: z.string().min(1, "Workflow name is required"),
  description: z.string().default(""),
  configuration: z.string(),
});

const router = app.post("/", zValidator("form", createWorkflowApiSchema), async (c) => {
  try {
    const validForm = c.req.valid("form");
    const user = await getUser(c);
    logger.info({ form: validForm }, `Creating new workflow via API`);
    const workflowId = await createWorkflowFromApi(
      validForm.name,
      validForm.description,
      validForm.configuration,
      user.id,
    );
    logger.info({ workflowId, name: validForm.name }, "Workflow created");
    return c.json({ workflowId: workflowId, message: "Workflow created" }, 201);
  } catch (error) {
    logger.error(error, "Create workflow from template error:");
    if (error instanceof Error) {
      return c.json(
        {
          error: error.message,
        },
        500,
      );
    } else {
      return c.json(
        {
          error: "Unknown server error",
        },
        500,
      );
    }
  }
});

export default router;

export type V1WorkflowRouteType = typeof router;
