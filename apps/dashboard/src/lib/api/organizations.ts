import type { AdminRoutes } from "@paperjet/api/routes";

import { hc } from "hono/client";

const adminClient = hc<AdminRoutes>("/api/admin");

export const isAdminSetupRequired = async () => {
  const response = await adminClient["setup-required"].$get({});
  return response.json();
};

export const getAuthMode = async () => {
  const response = await adminClient["auth-mode"].$get({});
  return response.json();
};
