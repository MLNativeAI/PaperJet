import { zValidator } from "@hono/zod-validator";
import {
  getConfiguration,
  getUsageData,
  getUsageStats,
  isSetupRequired,
  updateConfiguration,
  validateConnection,
} from "@paperjet/engine";
import { configUpdateSchema } from "@paperjet/engine/types";
import { getAuthMode, logger } from "@paperjet/shared";
import { Hono } from "hono";
import z from "zod";

const app = new Hono();

type OrganizationEntry = {
  orgId: string;
  orgSlug: string;
  orgName: string;
  planName: string;
};

const router = app.get("/", async (c) => {
  const response = {};
  return c.json({
    isSetupRequired: isAdminSetupRequired,
  });
});
export { router as organizationRouter };
export type OrganizationRoutes = typeof router;
