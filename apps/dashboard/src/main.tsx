import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/contexts/auth";
import { ServerInfoProvider, useServerInfo } from "@/contexts/server-info";
import { routeTree } from "./routeTree.gen";

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  defaultStructuralSharing: true, // Enable structural sharing for better performance
  context: {
    queryClient,
    session: undefined,
    user: undefined,
    serverInfo: undefined,
    breadcrumbs: [
      {
        label: "PaperJet",
        link: "/",
      },
    ],
    useFullWidth: false,
  },
  scrollRestoration: true,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const { session, user } = useAuth();
  const { serverInfo } = useServerInfo();
  return (
    <RouterProvider
      router={router}
      context={{
        session,
        user,
        serverInfo,
      }}
    />
  );
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ServerInfoProvider>
          <AuthProvider>
            <InnerApp />
          </AuthProvider>
        </ServerInfoProvider>
      </QueryClientProvider>
      <Toaster position="top-right" />
    </StrictMode>,
  );
}
