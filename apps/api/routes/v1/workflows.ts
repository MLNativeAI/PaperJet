import { zValidator } from "@hono/zod-validator";
import {
  createWorkflowFromApi,
  getWorkflowExecutionWithExtractedData,
  updateExecutionJobId,
  uploadFileAndCreateExecution,
} from "@paperjet/engine";
import { WorkflowConfigurationSchema } from "@paperjet/engine/types";
import { workflowExecutionQueue } from "@paperjet/queue";
import { logger } from "@paperjet/shared";
import { Hono } from "hono";
import z from "zod";
import { getUser } from "@/lib/auth";
import { workflowExecutionIdSchema, workflowIdSchema } from "@/lib/validation";

const app = new Hono();

const createWorkflowApiSchema = z.object({
  name: z.string().min(1, "Workflow name is required"),
  description: z.string().default(""),
  configuration: WorkflowConfigurationSchema,
});

const router = app
  .post("/", zValidator("json", createWorkflowApiSchema), async (c) => {
    try {
      const createWorkflowData = c.req.valid("json");
      const user = await getUser(c);
      logger.info({ data: createWorkflowData }, `Creating new workflow via API`);
      const { workflowId } = await createWorkflowFromApi(
        createWorkflowData.name,
        createWorkflowData.description,
        createWorkflowData.configuration,
        user.id,
      );
      logger.info({ workflowId, name: createWorkflowData.name }, "Workflow created");
      return c.json({ workflowId: workflowId, message: "Workflow created" }, 201);
    } catch (error) {
      // TODO unified error handling for API requests & shared error types
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
  })
  .post(
    "/:workflowId/execute",
    zValidator(
      "param",
      z.object({
        workflowId: workflowIdSchema,
      }),
    ),
    zValidator(
      "form",
      z.object({
        file: z
          .instanceof(File)
          .refine((file) => file.size > 0, "File cannot be empty")
          .refine((file) => file.type === "application/pdf", "File must be a PDF "),
      }),
    ),
    async (c) => {
      try {
        const user = await getUser(c);
        const { workflowId } = c.req.valid("param");
        const { file } = c.req.valid("form");
        const execution = await uploadFileAndCreateExecution(workflowId, user.id, file);
        const job = await workflowExecutionQueue.add(execution.workflowExecutionId, {
          workflowId: execution.workflowId,
          workflowExecutionId: execution.workflowExecutionId,
        });
        const jobId = job.id;
        await updateExecutionJobId(execution.workflowExecutionId, jobId || "");
        return c.json({
          ...execution,
        });
      } catch (error) {
        logger.error(error, "Re-extract data error:");
        if (error instanceof Error && error.message === "Workflow not found") {
          return c.json({ error: "Workflow not found" }, 404);
        }
        return c.json({ error: "Internal server error" }, 500);
      }
    },
  )
  .post(
    "/:workflowId/execute-bulk",
    zValidator(
      "param",
      z.object({
        workflowId: workflowIdSchema,
      }),
    ),
    zValidator(
      "form",
      z.object({
        files: z
          .array(z.instanceof(File))
          .min(1, "At least one file is required")
          .refine((files) => files.every((file) => file.size > 0), "Files cannot be empty")
          .refine((files) => files.every((file) => file.type === "application/pdf"), "All files must be PDFs"),
      }),
    ),
    async (c) => {
      try {
        const user = await getUser(c);
        const { workflowId } = c.req.valid("param");
        const { files } = c.req.valid("form");

        const executions = [];

        for (const file of files) {
          const execution = await uploadFileAndCreateExecution(workflowId, user.id, file);
          const job = await workflowExecutionQueue.add(execution.workflowExecutionId, {
            workflowId: execution.workflowId,
            workflowExecutionId: execution.workflowExecutionId,
          });
          const jobId = job.id;
          await updateExecutionJobId(execution.workflowExecutionId, jobId || "");
          executions.push(execution);
        }

        return c.json({
          executions,
          message: `Successfully created ${executions.length} workflow executions`,
        });
      } catch (error) {
        logger.error(error, "Bulk execute error:");
        if (error instanceof Error && error.message === "Workflow not found") {
          return c.json({ error: "Workflow not found" }, 404);
        }
        return c.json({ error: "Internal server error" }, 500);
      }
    },
  )
  .get(
    "/:workflowId/executions/:workflowExecutionId",
    zValidator(
      "param",
      z.object({
        workflowId: workflowIdSchema,
        workflowExecutionId: workflowExecutionIdSchema,
      }),
    ),
    async (c) => {
      const user = await getUser(c);
      const { workflowExecutionId } = c.req.valid("param");
      const execution = await getWorkflowExecutionWithExtractedData(workflowExecutionId, user.id);
      return c.json(execution);
    },
  );

export default router;

export type V1WorkflowRouteType = typeof router;
