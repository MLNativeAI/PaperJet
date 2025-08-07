import { logger } from "@paperjet/shared";
import { type Job, Queue, Worker } from "bullmq";
import z from "zod";
import { baseQueueOptions } from "../queues";
import { redisConnection } from "../redis";
import { QUEUE_NAMES } from "../types";

export const extractMarkdownQueue = new Queue(QUEUE_NAMES.MARKDOWN_JOB, {
  ...baseQueueOptions,
  defaultJobOptions: {
    ...baseQueueOptions.defaultJobOptions,
    attempts: 1,
  },
});

const extractMarkdownJobSchema = z.object({
  workflowId: z.uuid(),
  workflowExecutionId: z.uuid(),
});

export type ExtractMarkdownJobData = z.infer<typeof extractMarkdownJobSchema>;

export const extractMarkdownWorker = new Worker(
  QUEUE_NAMES.MARKDOWN_JOB,
  async (job: Job<ExtractMarkdownJobData>) => {
    logger.info({ job: job.data }, "Starting markdown extraction job");
    await extractMarkdownFromImages();
  },
  {
    connection: redisConnection,
    concurrency: 10,
    name: "extract-markdown-worker",
  },
);

async function extractMarkdownFromImages() {
  throw new Error("Function not implemented.");
}
