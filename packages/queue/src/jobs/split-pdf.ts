import { splitPdfIntoImages } from "@paperjet/engine";
import { logger } from "@paperjet/shared";
import { type Job, Queue, Worker } from "bullmq";
import z from "zod";
import { redisConnection } from "../redis";
import { baseQueueOptions } from "../shared";
import { QUEUE_NAMES } from "../types";

export const splitPdfQueue = new Queue(QUEUE_NAMES.SPLIT_JOB, {
  ...baseQueueOptions,
  defaultJobOptions: {
    ...baseQueueOptions.defaultJobOptions,
    attempts: 1,
  },
});

const splitPdfJobSchema = z.object({
  workflowId: z.uuid(),
  workflowExecutionId: z.uuid(),
});

export type SplitPdfJobData = z.infer<typeof splitPdfJobSchema>;

export const splitPdfWorker = new Worker(
  QUEUE_NAMES.SPLIT_JOB,
  async (job: Job<SplitPdfJobData>) => {
    logger.info("Starting PDF split job");
    await splitPdfIntoImages(job.data.workflowExecutionId);
    logger.info("PDF split job completed");
  },
  {
    connection: redisConnection,
    concurrency: 20,
    name: "split-pdf-worker",
  },
);
