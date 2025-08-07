import { db } from "@paperjet/db";
import { workflowExecution } from "@paperjet/db/schema";
import { WorkflowExecutionStatus } from "@paperjet/engine/types";
import { logger } from "@paperjet/shared";
import { type Job, Queue, WaitingChildrenError, Worker } from "bullmq";
import { eq } from "drizzle-orm";
import z from "zod";
import { baseQueueOptions } from "./queues";
import { QUEUE_NAMES } from "./types";
import { splitPdfQueue } from "./jobs/split-pdf";
import { extractMarkdownQueue } from "./jobs/extract-markdown";

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
    const { workflowId, workflowExecutionId } = job.data;
    let step = job.data.step;
    while (step !== workflowSteps.enum.FINISHED) {
      switch (step) {
        case workflowSteps.enum.INIT: {
          step = await handleDocumentSplit(job);
          break;
        }
        case workflowSteps.enum.WAITING_FOR_SPLIT: {
          await validateJobTokenAndStatus(job, token);
          await checkChildJobsCompletedSuccessfully(job, workflowSteps.enum.WAITING_FOR_SPLIT);
          step = workflowSteps.enum.MARKDOWN;
          break;
        }
        case workflowSteps.enum.MARKDOWN: {
          step = await handleExtractMarkdown(job);
          break;
        }
        case workflowSteps.enum.WAITING_FOR_MARKDOWN: {
          await validateJobTokenAndStatus(job, token);
          await checkChildJobsCompletedSuccessfully(job, workflowSteps.enum.WAITING_FOR_MARKDOWN);
          step = workflowSteps.enum.EXTRACTION;
          break;
        }
        case workflowSteps.enum.EXTRACTION: {
          await handleExtraction(job, workflowId);
          step = workflowSteps.enum.WAITING_FOR_EXTRACTION;
          break;
        }
        case workflowSteps.enum.WAITING_FOR_EXTRACTION: {
          await validateJobTokenAndStatus(job, token);
          await checkChildJobsCompletedSuccessfully(job, workflowSteps.enum.WAITING_FOR_EXTRACTION);
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

  await splitPdfQueue.add(QUEUE_NAMES.SPLIT_JOB, job.data, {
    parent: {
      id: job.id,
      queue: job.queueQualifiedName,
    },
  });

  await job.updateData({ ...job.data, step: workflowSteps.enum.WAITING_FOR_SPLIT });
  return workflowSteps.enum.WAITING_FOR_SPLIT;
}
async function handleExtractMarkdown(job: Job<WorkflowExtractionData>) {
  const { workflowId, workflowExecutionId } = job.data;

  if (!job.id) {
    throw new Error("Fatal error, job ID missing");
  }

  await extractMarkdownQueue.add(QUEUE_NAMES.MARKDOWN_JOB, job.data, {
    parent: {
      id: job.id,
      queue: job.queueQualifiedName,
    },
  });

  await job.updateData({ ...job.data, step: workflowSteps.enum.WAITING_FOR_MARKDOWN });
  return workflowSteps.enum.WAITING_FOR_MARKDOWN;
}
async function handleMarkdownCompleteStep(job: Job<WorkflowExtractionData>) {}
async function handleExtraction(_job: Job<WorkflowExtractionData>, _workflowId: string) {
  throw new Error("Function not implemented.");
}
async function finalizeWorkflow() {
  throw new Error("Function not implemented.");
}

async function checkChildJobsCompletedSuccessfully(job, jobName: string) {
  const childrenValues = await job.getChildrenValues();
  const failedChildren = Object.entries(childrenValues).filter(([_, result]) => result instanceof Error);

  if (failedChildren.length > 0) {
    logger.error("PDF split job failed");
    throw new Error("PDF split failed");
  }
}

async function validateJobTokenAndStatus(job: Job<WorkflowExtractionData>, token?: string) {
  if (!token) {
    logger.error("Invalid token");
    throw new Error("Invalid token");
  }
  const shouldWaitForSplit = await job.moveToWaitingChildren(token);
  if (shouldWaitForSplit) {
    throw new WaitingChildrenError();
  }
}
