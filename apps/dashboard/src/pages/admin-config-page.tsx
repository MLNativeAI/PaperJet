import AdminModelConfigForm from "@/components/forms/admin-model-config-form";
import { useConfiguration } from "@/hooks/use-configuration";

export default function AdminConfigPage() {
  const { configuration, isLoading } = useConfiguration();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full px-4 py-8 space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configuration</h1>
          <p className="text-muted-foreground mt-2">
            Configure your PaperJet instance. These settings apply to all accounts.
          </p>
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Model configuration</h2>
        </div>
        {<AdminModelConfigForm configuration={configuration} />}
      </div>
    </div>
  );
}
