import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import "../../styles.css";
import type { ServerInfo } from "@paperjet/db/types";
import type { QueryClient } from "@tanstack/react-query";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { Session, User } from "better-auth";
import { authQueries } from "@/queries/auth";

type RouterContext = {
  session: Session | undefined;
  user: User | undefined;
  serverInfo: ServerInfo | undefined;
  queryClient: QueryClient;
  breadcrumbs: {
    link: string;
    label: string;
  }[];
  useFullWidth: boolean;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  ),
  beforeLoad: async ({ context }) => {
    const userSession = await context.queryClient.fetchQuery(authQueries.session());
    return { session: userSession.session, user: userSession.user };
  },
  notFoundComponent: () => <div>404 Not Found</div>,
});
