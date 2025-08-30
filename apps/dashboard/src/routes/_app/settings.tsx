import { createFileRoute, Outlet, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="max-w-7xl w-full mx-auto">
        <div className="space-y-6 max-w-7xl w-full mx-auto">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
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
      </div>
    </div>
  );
}
