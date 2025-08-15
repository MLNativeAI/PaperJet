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
  configuration: z.object({
    fields: z.array(
      z.object({
        slug: z.string(),
        description: z.string(),
        type: z.enum(["text", "number", "date", "boolean"]),
      }),
    ),
    tables: z.array(
      z.object({
        columns: z.array(
          z.object({
            id: z.string(),
            slug: z.string(),
            description: z.string(),
            type: z.enum(["text", "number", "date", "boolean"]),
          }),
        ),
        slug: z.string(),
        description: z.string(),
      }),
    ),
  }),
});

const router = app.post("/", zValidator("json", createWorkflowApiSchema), async (c) => {
  try {
    const createWorkflowData = c.req.valid("json");
    const user = await getUser(c);
    logger.info({ data: createWorkflowData }, `Creating new workflow via API`);
    const workflowId = await createWorkflowFromApi(
      createWorkflowData.name,
      createWorkflowData.description,
      createWorkflowData.configuration,
      user.id,
    );
    logger.info({ workflowId, name: createWorkflowData.name }, "Workflow created");
    return c.json({ workflowId: workflowId, message: "Workflow created" }, 201);
  } catch (error) {
    logger.error(error, "Create workflow error:");
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
