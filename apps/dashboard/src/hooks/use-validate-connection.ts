import type { AdminRoutes } from "@paperjet/api/routes";
import type { ConnectionValidationResult, ModelConfigParams } from "@paperjet/engine/types";
import { useMutation } from "@tanstack/react-query";
import { hc } from "hono/client";

const adminClient = hc<AdminRoutes>("/api/admin");

export function useValidateConnection() {
  const validateConnection = useMutation({
    mutationFn: async (config: ModelConfigParams) => {
      const response = await adminClient.models["validate-connection"].$post({
        json: config,
      });

      if (!response.ok) {
        const error = await response.json();
        console.error(error);
        throw new Error(error.error || "Failed to validate connection");
      }

      return response.json() as Promise<ConnectionValidationResult>;
    },
  });

  return { validateConnection };
}
