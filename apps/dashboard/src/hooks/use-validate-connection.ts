import type { AdminRoutes } from "@paperjet/api/routes";
import type { ConfigurationUpdate, ConnectionValidationResult } from "@paperjet/engine/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { hc } from "hono/client";

const adminClient = hc<AdminRoutes>("/api/admin");

export function useModelConfiguration() {
  const queryClient = useQueryClient();

  const validateConnection = useMutation({
    mutationFn: async (config: ConfigurationUpdate) => {
      const response = await adminClient["validate-connection"].$post({
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
