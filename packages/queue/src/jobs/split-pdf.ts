import { splitPdfIntoImages } from "@paperjet/engine";
import { logger } from "@paperjet/shared";
import { type Job, Queue, Worker } from "bullmq";
import z from "zod";
import { redisConnection } from "../redis";
import { QUEUE_NAMES } from "../types";

export const splitPdfQueue = new Queue(QUEUE_NAMES.SPLIT_JOB, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 1,
  },
});

const splitPdfJobSchema = z.object({
  workflowId: z.string(),
  workflowExecutionId: z.string(),
});

export type SplitPdfJobData = z.infer<typeof splitPdfJobSchema>;

export const splitPdfWorker = new Worker(
  QUEUE_NAMES.SPLIT_JOB,
  async (job: Job<SplitPdfJobData>) => {
    logger.info("Starting PDF split job");
    const pageCount = await splitPdfIntoImages(job.data.workflowExecutionId);
    logger.info("PDF split job completed");
    return { success: true, pageCount };
  },
  {
    connection: redisConnection,
    concurrency: 1,
    name: "split-pdf-worker",
  },
);
