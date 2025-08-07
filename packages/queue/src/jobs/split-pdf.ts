import { Worker, Job, Queue } from "bullmq";
import { baseQueueOptions } from "../queues";
import { QUEUE_NAMES } from "../types";
import z from "zod";
import { logger } from "@paperjet/shared";
import { redisConnection } from "../redis";

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
    await splitDocumentIntoImages();
  },
  {
    connection: redisConnection,
    concurrency: 20,
    name: "split-pdf-worker",
  },
);
async function splitDocumentIntoImages() {
  throw new Error("Function not implemented.");
}
