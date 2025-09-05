import { zValidator } from "@hono/zod-validator";
import {
  createWorkflowFromApi,
  deleteWorkflow,
  getWorkflow,
  getWorkflowExecutionWithExtractedData,
  getWorkflows,
  updateExecutionJobId,
  updateWorkflow,
  uploadFileAndCreateExecution,
} from "@paperjet/engine";
import { WorkflowConfigurationSchema } from "@paperjet/engine/types";
import { workflowExecutionQueue } from "@paperjet/queue";
import { logger } from "@paperjet/shared";
import { Hono } from "hono";
import z from "zod";
import { getUserSession } from "@/lib/auth";
import { workflowExecutionIdSchema, workflowIdSchema } from "@/lib/validation";

const app = new Hono();

const createWorkflowApiSchema = z.object({
  name: z.string().min(1, "Workflow name is required"),
  description: z.string().default(""),
  configuration: WorkflowConfigurationSchema,
});

const updateWorkflowApiSchema = z.object({
  name: z.string().min(1, "Workflow name is required"),
  description: z.string().default(""),
  configuration: WorkflowConfigurationSchema,
});

function validateFiles(body: any): { success: true; files: File[] } | { success: false; error: string } {
  const files = body.files;

  // Convert to array if single file or already array
  const fileArray = Array.isArray(files) ? files : [files].filter(Boolean);

  if (fileArray.length === 0) {
    return { success: false, error: "At least one file is required" };
  }

  // Validate each file
  for (const file of fileArray) {
    if (!(file instanceof File) || file.size === 0) {
      return { success: false, error: "Invalid file" };
    }
    if (file.type !== "application/pdf") {
      return { success: false, error: "All files must be PDFs" };
    }
  }

  return { success: true, files: fileArray };
}

const router = app
  .get("/", async (c) => {
    try {
      const { session } = await getUserSession(c);
      const workflows = await getWorkflows(session.activeOrganizationId);
      return c.json(workflows);
    } catch (error) {
      logger.error(error, "Failed to fetch workflows");
      return c.json({ error: "Internal server error" }, 500);
    }
  })
  .post("/", zValidator("json", createWorkflowApiSchema), async (c) => {
    try {
      const createWorkflowData = c.req.valid("json");
      const { session } = await getUserSession(c);
      logger.info({ data: createWorkflowData }, `Creating new workflow via API`);
      const { workflowId } = await createWorkflowFromApi(
        createWorkflowData.name,
        createWorkflowData.description,
        createWorkflowData.configuration,
        session.activeOrganizationId,
        session.userId,
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
        const { session, user } = await getUserSession(c);
        const { workflowId } = c.req.valid("param");
        const { file } = c.req.valid("form");
        const execution = await uploadFileAndCreateExecution(
          workflowId,
          session.activeOrganizationId,
          session.userId,
          file,
        );
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
    async (c) => {
      try {
        const { session } = await getUserSession(c);
        const { workflowId } = c.req.valid("param");

        // Parse and validate files
        const body = await c.req.parseBody();
        const validation = validateFiles(body);

        if (!validation.success) {
          return c.json({ error: validation.error }, 400);
        }

        const fileArray = validation.files;

        const executions = [];

        // Process each file and create executions
        for (const file of fileArray) {
          const execution = await uploadFileAndCreateExecution(
            workflowId,
            session.activeOrganizationId,
            session.userId,
            file,
          );
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
    "/:workflowId",
    zValidator(
      "param",
      z.object({
        workflowId: workflowIdSchema,
      }),
    ),
    async (c) => {
      const { session } = await getUserSession(c);
      const { workflowId } = c.req.valid("param");
      const execution = await getWorkflow(workflowId, session.activeOrganizationId);
      return c.json(execution);
    },
  )
  .put(
    "/:workflowId",
    zValidator("json", updateWorkflowApiSchema),
    zValidator(
      "param",
      z.object({
        workflowId: workflowIdSchema,
      }),
    ),
    async (c) => {
      try {
        const { workflowId } = c.req.valid("param");
        const updateWorkflowData = c.req.valid("json");
        const { session } = await getUserSession(c);
        logger.info({ data: updateWorkflowData }, `Updating workflow ${workflowId}`);
        await updateWorkflow(
          workflowId,
          updateWorkflowData.name,
          updateWorkflowData.description,
          updateWorkflowData.configuration,
          session.activeOrganizationId,
        );
        logger.info({ workflowId, name: updateWorkflowData.name }, "Workflow updated");
        return c.json({ workflowId, message: "Workflow updated" }, 200);
      } catch (error) {
        // TODO unified error handling for API requests & shared error types
        logger.error(error, "update workflow error:");
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
      const { session } = await getUserSession(c);
      const { workflowExecutionId } = c.req.valid("param");
      const execution = await getWorkflowExecutionWithExtractedData(workflowExecutionId, session.activeOrganizationId);
      return c.json(execution);
    },
  )
  .delete(
    "/:workflowId",
    zValidator(
      "param",
      z.object({
        workflowId: workflowIdSchema,
      }),
    ),
    async (c) => {
      try {
        const { session } = await getUserSession(c);
        const { workflowId } = c.req.valid("param");

        await deleteWorkflow(workflowId, session.activeOrganizationId);

        return c.json({ message: "Workflow deleted successfully" });
      } catch (error) {
        logger.error(error, "Delete workflow error:");
        if (error instanceof Error && error.message === "Workflow not found") {
          return c.json({ error: "Workflow not found" }, 404);
        }
        return c.json({ error: "Internal server error" }, 500);
      }
    },
  );

export { router as v1WorkflowRouter };

export type WorkflowRoutes = typeof router;
