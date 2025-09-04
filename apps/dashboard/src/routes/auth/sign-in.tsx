import { createFileRoute } from "@tanstack/react-router";
import { getAuthMode } from "@/lib/api/admin";
import SignInPage from "@/pages/sign-in-page";

export const Route = createFileRoute("/auth/sign-in")({
  validateSearch: (search: Record<string, unknown>) => ({
    notFound: search.notFound as string | undefined,
    invite: search.invite as string | undefined,
  }),
  beforeLoad: async () => {
    const { authMode } = await getAuthMode();
    return { authMode };
  },
  component: SignInPage,
});
