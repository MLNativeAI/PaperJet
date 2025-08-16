import { logger } from "@paperjet/shared";
import { Hono } from "hono";

const app = new Hono();
const router = app.get("/", async (c) => {
  try {
    return c.json([]);
  } catch (error) {
    logger.error(error, "Get all executions error:");
    return c.json({ error: "Failed to get executions" }, 500);
  }
});
export default router;

export type ExecutionRouteType = typeof router;
