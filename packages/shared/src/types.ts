import { z } from "zod";

export type IdReference = {
  userId?: string;
  workflowId?: string;
  executionId?: string;
  env?: string;
};
