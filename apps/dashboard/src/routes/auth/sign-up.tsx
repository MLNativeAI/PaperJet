import { createFileRoute } from "@tanstack/react-router";
import { getAuthMode } from "@/lib/api";
import SignUpPage from "@/pages/sign-up-page";

export const Route = createFileRoute("/auth/sign-up")({
  beforeLoad: async () => {
    const { authMode } = await getAuthMode();
    return { authMode };
  },
  component: SignUpPage,
});
