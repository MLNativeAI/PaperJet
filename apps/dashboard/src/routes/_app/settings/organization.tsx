import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/settings/organization')({
  component: RouteComponent,
  beforeLoad: () => {
    return {
      breadcrumbs: [
        {
          link: "/settings",
          label: "Settings",
        },
        {
          link: "/settings/organization",
          label: "Organization",
        },
      ],
    };
  },
})

function RouteComponent() {
  return <div>Hello "/_app/settings/organization"!</div>
}
