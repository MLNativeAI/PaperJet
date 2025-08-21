import type { AdminRoutes } from "@paperjet/api/routes";
import type { ConfigurationUpdate } from "@paperjet/engine/types";
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

export const getUsageData = async () => {
  const response = await adminClient["usage-data"].$get({});
  return response.json();
};

export const getUsageStats = async () => {
  const response = await adminClient["usage-stats"].$get({});
  return response.json();
};

export const getConfiguration = async () => {
  const response = await adminClient.config.$get({});
  if (!response.ok) {
    throw new Error("Failed to fetch configuration");
  }
  return response.json();
};

export const updateConfiguration = async (config: ConfigurationUpdate) => {
  const response = await adminClient.config.$patch({
    json: config,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update configuration");
  }

  return response.json();
};

export const validateConnection = async (config: ConfigurationUpdate) => {
  const response = await adminClient["validate-connection"].$post({
    json: config,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to validate connection");
  }

  return response.json();
};
