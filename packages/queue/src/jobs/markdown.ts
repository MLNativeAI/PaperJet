import { convertPageToMarkdown } from "@paperjet/engine";
import { logger } from "@paperjet/shared";
import { type Job, Queue, Worker } from "bullmq";
import z from "zod";
import { redisConnection } from "../redis";
import { baseQueueOptions } from "../shared";
import { QUEUE_NAMES } from "../types";

export const markdownQueue = new Queue(QUEUE_NAMES.MARKDOWN_JOB, {
  ...baseQueueOptions,
  defaultJobOptions: {
    ...baseQueueOptions.defaultJobOptions,
    attempts: 1,
  },
});

const markdownJobSchema = z.object({
  workflowExecutionId: z.string(),
  documentPageId: z.string(),
});

export type MarkdownJobData = z.infer<typeof markdownJobSchema>;

export const markdownWorker = new Worker(
  QUEUE_NAMES.MARKDOWN_JOB,
  async (job: Job<MarkdownJobData>) => {
    logger.info({ job: job.data }, "Starting markdown job");
    const { workflowExecutionId, documentPageId } = job.data;
    await convertPageToMarkdown(workflowExecutionId, documentPageId);
    logger.info("Markdown job completed");
    return { success: true, documentPageId };
  },
  {
    connection: redisConnection,
    concurrency: 10,
    name: "markdown-worker",
  },
);
