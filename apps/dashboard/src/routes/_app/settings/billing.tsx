import BillingPage from "@/pages/settings/billing";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/settings/billing")({
  component: BillingPage,
  beforeLoad: () => {
    return {
      breadcrumbs: [
        {
          link: "/settings",
          label: "Settings",
        },
        {
          link: "/settings/billing",
          label: "Billing",
        },
      ],
    };
  },
});
