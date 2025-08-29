import { createFileRoute, Outlet, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>
      
      <div className="border-b">
        <nav className="-mb-px flex space-x-8">
          <Link
            to="/settings/api-keys"
            activeProps={{
              className: "border-primary text-primary",
            }}
            className="py-2 px-1 border-b-2 font-medium text-sm border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
          >
            API Keys
          </Link>
          <Link
            to="/settings/billing"
            activeProps={{
              className: "border-primary text-primary",
            }}
            className="py-2 px-1 border-b-2 font-medium text-sm border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
          >
            Billing
          </Link>
          <Link
            to="/settings/organization"
            activeProps={{
              className: "border-primary text-primary",
            }}
            className="py-2 px-1 border-b-2 font-medium text-sm border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
          >
            Organization
          </Link>
          <Link
            to="/settings/models"
            activeProps={{
              className: "border-primary text-primary",
            }}
            className="py-2 px-1 border-b-2 font-medium text-sm border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
          >
            Models
          </Link>
        </nav>
      </div>
      
      <div className="pt-4">
        <Outlet />
      </div>
    </div>
  );
}
