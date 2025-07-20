import { createFileRoute } from "@tanstack/react-router";
import { getAuthMode } from "@/lib/api";
import SignInPage from "@/pages/sign-in-page";

export const Route = createFileRoute("/auth/sign-in")({
  beforeLoad: async () => {
    const { authMode } = await getAuthMode();
    return { authMode };
  },
  component: SignInPage,
});
