import { extractDataFromMarkdown } from "@paperjet/engine";
import { type Job, Queue, Worker } from "bullmq";
import z from "zod";
import { redisConnection } from "../redis";
import { QUEUE_NAMES } from "../types";

export const extractionQueue = new Queue(QUEUE_NAMES.EXTRACTION_JOB, {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: 10,
    removeOnFail: 5,
    attempts: 2, // Expensive AI operations, limited retries
    backoff: {
      type: "exponential" as const,
      delay: 2000,
    },
  },
});

const extractionJobSchema = z.object({
  workflowId: z.string(),
  workflowExecutionId: z.string(),
});

export type ExtractionJobData = z.infer<typeof extractionJobSchema>;

export const extractWorker = new Worker(
  QUEUE_NAMES.EXTRACTION_JOB,
  async (job: Job<ExtractionJobData>) => {
    const { workflowId, workflowExecutionId } = job.data;
    const result = await extractDataFromMarkdown(workflowId, workflowExecutionId);
    return { success: true, extractedData: result };
  },
  {
    connection: redisConnection,
    concurrency: 10,
    name: "extract-worker",
  },
);
