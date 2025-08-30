import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/settings/billing')({
  component: RouteComponent,
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
})

function RouteComponent() {
  return <div>Hello "/_app/settings/billing"!</div>
}
