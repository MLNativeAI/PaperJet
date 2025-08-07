import { extractWorker } from "./jobs/extraction";
import { markdownWorker } from "./jobs/markdown";
import { splitPdfWorker } from "./jobs/split-pdf";
import { extractionWorkflowWorker } from "./workflows/extraction";

export { workflowExecutionQueue } from "./workflows/extraction";
export const allWorkers = [extractionWorkflowWorker, markdownWorker, splitPdfWorker, extractWorker];
