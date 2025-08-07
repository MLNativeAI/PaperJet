import { logger } from "@paperjet/shared";
import { type Job, Queue, Worker } from "bullmq";
import z from "zod";
import { redisConnection } from "../redis";
import { baseQueueOptions } from "../shared";
import { QUEUE_NAMES } from "../types";

export const extractionQueue = new Queue(QUEUE_NAMES.EXTRACTION_JOB, {
  ...baseQueueOptions,
  defaultJobOptions: {
    ...baseQueueOptions.defaultJobOptions,
    attempts: 1,
  },
});

const extractionJobSchema = z.object({
  workflowId: z.uuid(),
  workflowExecutionId: z.uuid(),
});

export type ExtractionJobData = z.infer<typeof extractionJobSchema>;

export const extractWorker = new Worker(
  QUEUE_NAMES.EXTRACTION_JOB,
  async (job: Job<ExtractionJobData>) => {
    logger.info({ job: job.data }, "Starting extraction job");
    await extractData();
  },
  {
    connection: redisConnection,
    concurrency: 10,
    name: "extract-worker",
  },
);

async function extractData() {
  throw new Error("Function not implemented.");
}
