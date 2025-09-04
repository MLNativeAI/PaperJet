import { createFileRoute } from "@tanstack/react-router";
import { getAuthMode } from "@/lib/api/admin";
import SignUpPage from "@/pages/sign-up-page";

export const Route = createFileRoute("/auth/sign-up")({
  beforeLoad: async () => {
    const { authMode } = await getAuthMode();
    return { authMode };
  },
  validateSearch: (search: Record<string, unknown>) => ({
    notFound: search.notFound as string | undefined,
    invite: search.invite as string | undefined,
  }),
  component: SignUpPage,
});