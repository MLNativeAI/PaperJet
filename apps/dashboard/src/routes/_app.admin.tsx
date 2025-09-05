import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/admin")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="text-muted-foreground">Manage your PaperJet instance configuration and usage</p>
      </div>

      <div className="border-b">
        <nav className="-mb-px flex space-x-8">
          <Link
            to="/admin/config"
            activeProps={{
              className: "border-primary text-primary",
            }}
            className="py-2 px-1 border-b-2 font-medium text-sm border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
          >
            Configuration
          </Link>
          <Link
            to="/admin/usage"
            activeProps={{
              className: "border-primary text-primary",
            }}
            className="py-2 px-1 border-b-2 font-medium text-sm border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
          >
            Usage
          </Link>
        </nav>
      </div>

      <div className="pt-4">
        <Outlet />
      </div>
    </div>
  );
}
