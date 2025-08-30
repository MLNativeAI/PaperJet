import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import "../../styles.css";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

type RouterContext = {
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
  notFoundComponent: () => <div>404 Not Found</div>,
});
