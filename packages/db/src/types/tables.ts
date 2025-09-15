import type { apikey, configuration, file, usageData, usageModelPrice, workflow, workflowExecution } from "@db/schema";

export type FileData = typeof file.$inferSelect;

export type DbWorkflow = typeof workflow.$inferSelect;

export type DbWorkflowExecution = typeof workflowExecution.$inferSelect;

export type DbUsageModelPrice = typeof usageModelPrice.$inferSelect;

export type DbUsageData = typeof usageData.$inferSelect;

export type Configuration = typeof configuration.$inferSelect;

export type DbApiKey = typeof apikey.$inferSelect;
