import type {
  apikey,
  configuration,
  documentData,
  file,
  usageData,
  usageModelPrice,
  workflow,
  workflowExecution,
} from "@db/schema";

export type DbFile = typeof file.$inferSelect;

export type DbWorkflow = typeof workflow.$inferSelect;

export type DbWorkflowExecution = typeof workflowExecution.$inferSelect;

export type DbUsageModelPrice = typeof usageModelPrice.$inferSelect;

export type DbUsageData = typeof usageData.$inferSelect;

export type DbDocumentData = typeof documentData.$inferSelect;

export type DbConfiguration = typeof configuration.$inferSelect;

export type DbApiKey = typeof apikey.$inferSelect;
