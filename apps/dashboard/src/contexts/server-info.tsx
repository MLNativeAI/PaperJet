import type { AdminRoutes } from "@paperjet/api/routes";
import type { ServerInfo } from "@paperjet/db/types";
import { useQuery } from "@tanstack/react-query";
import { hc } from "hono/client";
import { createContext, type ReactNode, useContext } from "react";

type ServerInfoContextType = {
  serverInfo: ServerInfo | undefined;
};

const ServerInfoContext = createContext<ServerInfoContextType | undefined>(undefined);
const adminClient = hc<AdminRoutes>("/api/admin");

export function ServerInfoProvider({ children }: { children: ReactNode }) {
  const { data: serverInfo, isLoading } = useQuery({
    queryKey: ["server-info"],
    queryFn: async () => {
      const response = await adminClient["server-info"].$get({});
      return response.json();
    },
  });

  return <ServerInfoContext.Provider value={{ serverInfo }}>{isLoading ? null : children}</ServerInfoContext.Provider>;
}

export function useServerInfo() {
  const context = useContext(ServerInfoContext);
  if (!context) {
    throw new Error("useServerInfo must be used within ServerInfoProvider");
  }
  return context;
}
