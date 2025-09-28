import type { AdminRoutes } from "@paperjet/api/routes";
import { queryOptions } from "@tanstack/react-query";
import { hc } from "hono/client";

const adminClient = hc<AdminRoutes>("/api/admin");

export const serverInfoQueries = {
  serverInfo: () =>
    queryOptions({
      queryKey: ["server-info"],
      queryFn: async () => {
        const response = await adminClient["server-info"].$get({});
        return response.json();
      },
      staleTime: 5000,
    }),
};
