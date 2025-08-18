import { zValidator } from "@hono/zod-validator";
import { getAllWorkflowExecutions, getWorkflowExecutionWithExtractedData } from "@paperjet/engine";
import { logger } from "@paperjet/shared";
import { Hono } from "hono";
import z from "zod";
import { getUser } from "@/lib/auth";
import { workflowExecutionIdSchema } from "@/lib/validation";

const app = new Hono();

const router = app
  .get("/", async (c) => {
    try {
      const user = await getUser(c);
      const executions = await getAllWorkflowExecutions(user.id);
      return c.json(executions);
    } catch (error) {
      logger.error(error, "Get all executions error:");
      return c.json({ error: "Failed to get executions" }, 500);
    }
  })
  .get(
    "/:executionId",
    zValidator(
      "param",
      z.object({
        executionId: workflowExecutionIdSchema,
      }),
    ),
    async (c) => {
      try {
        const user = await getUser(c);
        const { executionId } = c.req.valid("param");
        const execution = await getWorkflowExecutionWithExtractedData(executionId, user.id);
        return c.json(execution);
      } catch (error) {
        logger.error(error, "Get execution by ID error:");
        if (error instanceof Error && error.message === "not found") {
          return c.json({ error: "Execution not found" }, 404);
        }
        return c.json({ error: "Failed to get execution" }, 500);
      }
    },
  );

export default router;
