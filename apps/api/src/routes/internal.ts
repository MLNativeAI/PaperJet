import { handleOrganizationInvite, listUserInvitations } from "@paperjet/auth/invitations";
import { doesAdminAccountExist } from "@paperjet/db";
import { getAuthMode } from "@paperjet/shared";
import { Hono } from "hono";

const app = new Hono();

const router = app
  .get("/server-info", async (c) => {
    const adminAccountExists = await doesAdminAccountExist();
    const authMode = getAuthMode();
    return c.json({
      adminAccountExists: adminAccountExists,
      authMode: authMode,
    });
  })
  .get("/accept-invitation", async (c) => {
    return handleOrganizationInvite(c);
  })
  .get("/invitations", async (c) => {
    return listUserInvitations(c);
  });
export { router as internalRouter };
export type InternalRoutes = typeof router;
