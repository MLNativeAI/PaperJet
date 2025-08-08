import { logger } from "@paperjet/shared";
import { extractWorker } from "./jobs/extraction";
import { markdownWorker } from "./jobs/markdown";
import { splitPdfWorker } from "./jobs/split-pdf";
import { extractionWorkflowWorker } from "./workflows/extraction";

export { workflowExecutionQueue } from "./workflows/extraction";
export const allWorkers = [extractionWorkflowWorker, markdownWorker, splitPdfWorker, extractWorker];

allWorkers.forEach((worker) => {
  worker.on("completed", (job: any, result: any) => {
    logger.trace("Worker job completed", {
      jobId: job.id,
      jobName: job.name,
      specId: job.data.specId,
      result,
    });
  });
  worker.on("failed", (job: any, err: any) => {
    logger.error({ err, job }, "Worker job failed");
  });
  worker.on("stalled", (jobId: any) => {
    logger.warn("Worker job stalled", { jobId });
  });
  worker.on("error", (err: any) => {
    logger.error("Worker worker error", { error: err.message });
  });
});
