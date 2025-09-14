import { runExecutionContext } from "@paperjet/shared/src/context";
import type { Context } from "hono";

export const withContext = async <T>(c: Context, next: () => Promise<T>): Promise<T> => {
  // const userId = await getUserIdIfLoggedIn(c);
  // const workflowId = c.req.param("workflowId");
  // const executionId = c.req.param("executionId");
  const env = Bun.env.ENVIRONMENT;

  return await runExecutionContext({ env }, () => next());
};
