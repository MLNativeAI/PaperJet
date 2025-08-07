import { db } from "@paperjet/db";
import { documentPage, workflow, workflowExecution } from "@paperjet/db/schema";
import { WorkflowExecutionStatus } from "@paperjet/engine/types";
import { logger } from "@paperjet/shared";
import { type Job, Queue, WaitingChildrenError, Worker } from "bullmq";
import { asc, eq } from "drizzle-orm";
import z from "zod";
import { extractionQueue } from "../jobs/extraction";
import { markdownQueue } from "../jobs/markdown";
import { splitPdfQueue } from "../jobs/split-pdf";
import { baseQueueOptions } from "../shared";
import { QUEUE_NAMES } from "../types";

export const workflowExecutionQueue = new Queue(QUEUE_NAMES.EXTRACTION_WORKFLOW, {
  ...baseQueueOptions,
  defaultJobOptions: {
    ...baseQueueOptions.defaultJobOptions,
    attempts: 1,
  },
});

const workflowSteps = z.enum([
  "INIT",
  "WAITING_FOR_SPLIT",
  "MARKDOWN",
  "WAITING_FOR_MARKDOWN",
  "EXTRACTION",
  "WAITING_FOR_EXTRACTION",
  "FINISHED",
]);

const WorkflowExtractionDataSchema = z.object({
  workflowId: z.uuid(),
  workflowExecutionId: z.uuid(),
  step: workflowSteps,
});

export type WorkflowExtractionData = z.infer<typeof WorkflowExtractionDataSchema>;

export const extractionWorkflowWorker = new Worker(
  QUEUE_NAMES.EXTRACTION_WORKFLOW,
  async (job: Job<WorkflowExtractionData>, token?: string) => {
    let step = job.data.step;
    while (step !== workflowSteps.enum.FINISHED) {
      switch (step) {
        case workflowSteps.enum.INIT: {
          step = await handleDocumentSplit(job);
          break;
        }
        case workflowSteps.enum.WAITING_FOR_SPLIT: {
          await checkChildJobsCompletedSuccessfully(job, workflowSteps.enum.WAITING_FOR_SPLIT, token);
          step = workflowSteps.enum.MARKDOWN;
          await job.updateData({ ...job.data, step: workflowSteps.enum.MARKDOWN });
          break;
        }
        case workflowSteps.enum.MARKDOWN: {
          step = await handleMarkdown(job);
          break;
        }
        case workflowSteps.enum.WAITING_FOR_MARKDOWN: {
          await checkChildJobsCompletedSuccessfully(job, workflowSteps.enum.WAITING_FOR_MARKDOWN, token);
          step = workflowSteps.enum.EXTRACTION;
          break;
        }
        case workflowSteps.enum.EXTRACTION: {
          await handleExtraction(job);
          step = workflowSteps.enum.WAITING_FOR_EXTRACTION;
          break;
        }
        case workflowSteps.enum.WAITING_FOR_EXTRACTION: {
          await checkChildJobsCompletedSuccessfully(job, workflowSteps.enum.WAITING_FOR_EXTRACTION, token);
          await finalizeWorkflow();
          step = workflowSteps.enum.FINISHED;
          break;
        }
      }
    }
    logger.info("Extraction workflow completed");
  },
);

async function handleDocumentSplit(job: Job<WorkflowExtractionData>) {
  const { workflowExecutionId } = job.data;
  await db
    .update(workflowExecution)
    .set({ status: WorkflowExecutionStatus.enum.Processing })
    .where(eq(workflowExecution.id, workflowExecutionId));

  if (!job.id) {
    throw new Error("Fatal error, job ID missing");
  }

  await splitPdfQueue.add(workflowExecutionId, job.data, {
    parent: {
      id: job.id,
      queue: job.queueQualifiedName,
    },
  });

  await job.updateData({ ...job.data, step: workflowSteps.enum.WAITING_FOR_SPLIT });
  return workflowSteps.enum.WAITING_FOR_SPLIT;
}

async function handleMarkdown(job: Job<WorkflowExtractionData>) {
  if (!job.id) {
    throw new Error("Fatal error, job ID missing");
  }
  const { workflowExecutionId } = job.data;
  const pageData = await db.query.documentPage.findMany({
    where: eq(documentPage.workflowExecutionId, workflowExecutionId),
    orderBy: [asc(documentPage.pageNumber)],
  });
  const bulkJobData = pageData.map((pageEntry) => {
    return {
      name: workflowExecutionId,
      data: {
        workflowExecutionId: workflowExecutionId,
        documentPageId: pageEntry.id,
        parent: {
          id: job.id,
          queue: job.queueQualifiedName,
        },
      },
    };
  });
  await markdownQueue.addBulk(bulkJobData);
  await job.updateData({ ...job.data, step: workflowSteps.enum.MARKDOWN });
  return workflowSteps.enum.MARKDOWN;
}

async function handleExtraction(job: Job<WorkflowExtractionData>) {
  if (!job.id) {
    throw new Error("Fatal error, job ID missing");
  }

  const { workflowExecutionId } = job.data;
  await extractionQueue.add(workflowExecutionId, job.data, {
    parent: {
      id: job.id,
      queue: job.queueQualifiedName,
    },
  });

  await job.updateData({ ...job.data, step: workflowSteps.enum.WAITING_FOR_EXTRACTION });
  return workflowSteps.enum.WAITING_FOR_EXTRACTION;
}

async function finalizeWorkflow() {
  logger.info("Workflow execution completed");
}

async function checkChildJobsCompletedSuccessfully(job: Job<WorkflowExtractionData>, jobName: string, token?: string) {
  if (!token) {
    logger.error("Invalid token");
    throw new Error("Invalid token");
  }
  const shouldWaitForSplit = await job.moveToWaitingChildren(token); // weird bullmq "waiting" logic
  if (shouldWaitForSplit) {
    throw new WaitingChildrenError();
  }
  const childrenValues = await job.getChildrenValues();
  const failedChildren = Object.entries(childrenValues).filter(([_, result]) => result instanceof Error);

  if (failedChildren.length > 0) {
    logger.error(`${jobName} failed`);
    throw new Error(`${jobName} failed`);
  }
}
