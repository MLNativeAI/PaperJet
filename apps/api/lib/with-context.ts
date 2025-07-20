import { runExecutionContext } from "@paperjet/shared/src/context";
import type { Context } from "hono";
import { getUserIfLoggedIn as getUserIdIfLoggedIn } from "./auth";

export const withContext = async <T>(c: Context, next: () => Promise<T>): Promise<T> => {
  const userId = await getUserIdIfLoggedIn(c);
  const workflowId = c.req.param("workflowId");
  const executionId = c.req.param("executionId");
  const env = Bun.env.ENVIRONMENT;

  return await runExecutionContext({ userId, workflowId, executionId, env }, () => next());
};
