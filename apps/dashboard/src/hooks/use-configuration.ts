import type { AdminRoutes } from "@paperjet/api/routes";
import type { Configuration } from "@paperjet/engine/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { hc } from "hono/client";

const adminClient = hc<AdminRoutes>("/api/admin");

export function useConfiguration() {
  const queryClient = useQueryClient();

  const {
    data: configuration,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["config"],
    queryFn: async () => {
      // const response = await adminClient.config.$get({});
      // if (!response.ok) {
      //   throw new Error("Failed to fetch configuration");
      // }
      // return response.json();
    },
  });

  return {
    configuration,
    isLoading,
    refetch,
  };
}
