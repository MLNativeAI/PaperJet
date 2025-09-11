import type { Session } from "better-auth";
import type { InvitationStatus } from "better-auth/plugins";
import type { AdminRoutes } from "./routes/admin";
import type { ApiKeysRoutes } from "./routes/v1/api-keys";
import type { ExecutionRoutes } from "./routes/v1/executions";
import type { WorkflowRoutes } from "./routes/v1/workflows";

export type { ApiKeysRoutes };
export type { ExecutionRoutes };
export type { WorkflowRoutes };
export type { AdminRoutes };

export type UserInvitation = {
  id: string;
  organizationId: string;
  organizationName: string;
  email: string;
  role: "member" | "admin" | "owner";
  status: InvitationStatus;
  inviterId: string;
  expiresAt: string;
};

export type SessionWithOrg = Session & {
  activeOrganizationId: string;
};
